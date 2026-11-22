import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  decodeFile,
  prepareImageFile,
  readImageBytes,
} from "../image-engine.mjs";
const fixture = async () =>
  new File([await readFile("assets/portrait.webp")], "gallery.jpg", {
    type: "",
  });
test("An available but rejecting bitmap decoder falls back to the image element", async () => {
  const file = await fixture();
  let fallbackCalls = 0;
  const bitmap = await decodeFile(file, {
    createBitmap: async () => {
      throw new DOMException("Cannot decode", "InvalidStateError");
    },
    loadImage: async (owned) => {
      fallbackCalls++;
      assert.equal(owned.type, "image/webp");
      assert.equal(owned.name, "gallery.jpg");
      return { width: 1000, height: 1121 };
    },
  });
  assert.equal(fallbackCalls, 1);
  assert.equal(bitmap.width, 1000);
});
test("Selected bytes are snapshotted once and reused after provider access disappears", async () => {
  const input = await fixture();
  let reads = 0;
  const provider = {
    name: input.name,
    type: "",
    size: input.size,
    async arrayBuffer() {
      if (++reads > 1) throw new Error("Provider expired");
      return input.arrayBuffer();
    },
  };
  const owned = await prepareImageFile(provider);
  assert.notEqual(owned, provider);
  assert.equal(owned.size, input.size);
  assert.equal(await prepareImageFile(owned), owned);
  for (let i = 0; i < 3; i++)
    await decodeFile(owned, {
      createBitmap: async (file) => {
        assert.equal(file, owned);
        return { width: 1000, height: 1121 };
      },
    });
  assert.equal(reads, 1);
});
test("Missing bitmap API works, invalid images never reach either decoder, and failures stay distinct", async () => {
  const file = await fixture();
  const result = await decodeFile(file, {
    createBitmap: null,
    loadImage: async () => ({
      naturalWidth: 1000,
      naturalHeight: 1121,
      width: 1000,
      height: 1121,
    }),
  });
  assert.equal(result.width, 1000);
  await assert.rejects(
    decodeFile(file, {
      createBitmap: async () => {
        throw Error();
      },
      loadImage: async () => {
        throw Error();
      },
    }),
    /^Error: decode$/,
  );
  let calls = 0;
  await assert.rejects(
    decodeFile(new File(["<svg></svg>"], "picture.jpg"), {
      createBitmap: async () => {
        calls++;
      },
      loadImage: async () => {
        calls++;
      },
    }),
    /unsupported/,
  );
  assert.equal(calls, 0);
  await assert.rejects(
    readImageBytes({
      arrayBuffer: async () => {
        throw Error();
      },
    }),
    /fileRead/,
  );
});
test("Fallback oversized bitmaps are closed before returning a pixel-limit error", async () => {
  let closed = false;
  await assert.rejects(
    decodeFile(await fixture(), {
      createBitmap: null,
      loadImage: async () => ({
        width: 10000,
        height: 10000,
        close() {
          closed = true;
        },
      }),
    }),
    /pixels/,
  );
  assert.equal(closed, true);
});
