import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  defaults,
  geometry,
  normalizeCrop,
  searchSize,
  crc32,
  zipFiles,
  fileName,
  inspectImage,
  LIMITS,
} from "../image-core.mjs";
test("Crop, rotation, aspect boxes, no-upscale and canvas limits compose correctly", () => {
  assert.deepEqual(normalizeCrop({ x: 90, y: -2, w: 40, h: 0 }), {
    x: 90,
    y: 0,
    w: 10,
    h: 1,
  });
  const fractional = normalizeCrop({ x: 100 / 3, y: 0, w: 100 / 3, h: 100 });
  assert.deepEqual(normalizeCrop(fractional), fractional);
  let g = geometry(4000, 3000, {
    ...defaults(),
    crop: { x: 25, y: 0, w: 50, h: 100 },
    rotation: 90,
    width: 1200,
    height: 1200,
  });
  assert.deepEqual(
    [g.sx, g.sw, g.sh, g.width, g.height],
    [1000, 2000, 3000, 1200, 800],
  );
  g = geometry(400, 200, { ...defaults(), width: 800, height: 800 });
  assert.deepEqual([g.width, g.height], [400, 200]);
  g = geometry(400, 200, {
    ...defaults(),
    width: 800,
    height: 800,
    upscale: true,
  });
  assert.deepEqual([g.width, g.height], [800, 400]);
  g = geometry(400, 200, {
    ...defaults(),
    width: 300,
    height: 300,
    lock: false,
  });
  assert.deepEqual([g.width, g.height], [300, 200]);
  g = geometry(10000, 10000, {
    ...defaults(),
    width: 8192,
    height: 8192,
    upscale: true,
  });
  assert.ok(g.width * g.height <= LIMITS.pixels);
  assert.ok(g.width <= 8192);
});
test("Target search selects highest fitting quality and never reports an oversized success", async () => {
  const encode = async (w, h, q) =>
    new Blob([new Uint8Array(Math.ceil(w * h * q))]);
  const result = await searchSize(encode, {
    width: 100,
    height: 100,
    quality: 0.9,
    minQuality: 0.1,
    target: 4000,
    shrink: false,
  });
  assert.ok(result.met);
  assert.ok(result.blob.size <= 4000);
  assert.ok(result.quality > 0.39);
  assert.equal(result.width, 100);
  const impossible = await searchSize(encode, {
    width: 100,
    height: 100,
    quality: 0.9,
    minQuality: 0.5,
    target: 100,
    shrink: false,
  });
  assert.equal(impossible.met, false);
  assert.equal(impossible.blob.size, 5000);
  assert.equal(impossible.width, 100);
  const smaller = await searchSize(encode, {
    width: 100,
    height: 100,
    quality: 0.9,
    minQuality: 0.5,
    target: 100,
    shrink: true,
  });
  assert.equal(smaller.met, true);
  assert.ok(smaller.width < 100);
  assert.ok(smaller.blob.size <= 100);
});
test("PNG uses dimensions instead of quality, cancellation is honored and empty encodes fail", async () => {
  const qualities = [];
  const r = await searchSize(
    async (w, h, q) => {
      qualities.push(q);
      return new Blob([new Uint8Array(w * h)]);
    },
    {
      width: 100,
      height: 100,
      quality: 0.9,
      minQuality: 0.1,
      target: 100,
      lossless: true,
      shrink: true,
    },
  );
  assert.equal(r.met, true);
  assert.equal(r.quality, null);
  assert.ok(qualities.every((q) => q === 0.9));
  const signal = AbortSignal.abort();
  await assert.rejects(
    searchSize(async () => new Blob(["a"]), { width: 1, height: 1, signal }),
    { name: "AbortError" },
  );
  await assert.rejects(
    searchSize(async () => null, { width: 1, height: 1 }),
    /encode/,
  );
});
test("UTF-8 ZIP contains correct data, CRC, directory offsets and collision-safe names", async () => {
  assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
  assert.equal(fileName("../مهدی.png", "jpeg", "/small"), "مهدی-small.jpg");
  const blob = await zipFiles([
    { name: "عکس.webp", blob: new Blob(["first"]) },
    { name: "عکس.webp", blob: new Blob(["second"]) },
  ]);
  const data = new Uint8Array(await blob.arrayBuffer()),
    view = new DataView(data.buffer),
    decoder = new TextDecoder();
  let offset = 0;
  const entries = [];
  while (view.getUint32(offset, true) === 0x04034b50) {
    const flags = view.getUint16(offset + 6, true),
      size = view.getUint32(offset + 18, true),
      nameSize = view.getUint16(offset + 26, true),
      extra = view.getUint16(offset + 28, true);
    assert.ok(flags & 0x800);
    const name = decoder.decode(
        data.subarray(offset + 30, offset + 30 + nameSize),
      ),
      start = offset + 30 + nameSize + extra,
      content = data.subarray(start, start + size);
    assert.equal(view.getUint32(offset + 14, true), crc32(content));
    entries.push([name, decoder.decode(content)]);
    offset = start + size;
  }
  assert.deepEqual(entries, [
    ["عکس.webp", "first"],
    ["عکس-2.webp", "second"],
  ]);
  assert.equal(view.getUint32(offset, true), 0x02014b50);
  assert.equal(view.getUint32(data.length - 22, true), 0x06054b50);
  assert.equal(view.getUint16(data.length - 12, true), 2);
  assert.equal(view.getUint32(data.length - 6, true), offset);
});
test("Header checks recognize real assets, reject unsupported and oversized containers before decoding", async () => {
  const webp = await readFile("assets/portrait.webp");
  const info = inspectImage(
    webp.buffer.slice(webp.byteOffset, webp.byteOffset + webp.length),
  );
  assert.equal(info.format, "webp");
  assert.ok(info.width > 0);
  const png = new Uint8Array(33),
    v = new DataView(png.buffer);
  v.setUint32(0, 0x89504e47);
  png.set(new TextEncoder().encode("IHDR"), 12);
  v.setUint32(16, 100000);
  v.setUint32(20, 100000);
  assert.throws(() => inspectImage(png.buffer), /pixels/);
  assert.throws(
    () => inspectImage(new TextEncoder().encode("<svg></svg>").buffer),
    /unsupported/,
  );
});
