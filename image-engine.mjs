import {
  geometry,
  searchSize,
  inspectImage,
  LIMITS,
} from "./image-core.mjs?v=20261123-image3";
// Own the selected bytes before clearing the picker or reading the image again.
const preparedFiles = new WeakSet();
function readWithFileReader(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const check = (loaded) => {
      try {
        onProgress(loaded);
        return true;
      } catch (error) {
        reject(error);
        reader.abort();
        return false;
      }
    };
    reader.onprogress = (event) => check(event.loaded);
    reader.onload = () => {
      if (check(reader.result.byteLength)) resolve(reader.result);
    };
    reader.onerror = reader.onabort = () => reject(new Error("fileRead"));
    reader.readAsArrayBuffer(file);
  });
}
// Start the read immediately, before metadata getters or file-input mutations.
export function readImageBytes(file, onProgress = () => {}) {
  const modern = () => {
    if (typeof file.arrayBuffer !== "function")
      return Promise.reject(new Error("fileRead"));
    try {
      return Promise.resolve(file.arrayBuffer()).then((buffer) => {
        onProgress(buffer.byteLength);
        return buffer;
      });
    } catch {
      return Promise.reject(new Error("fileRead"));
    }
  };
  const reading =
    typeof FileReader === "function"
      ? readWithFileReader(file, onProgress).catch((error) => {
          if (error.message !== "fileRead") throw error;
          onProgress(0);
          return modern();
        })
      : modern();
  return reading.catch((error) => {
    if (["fileSize", "batchSize"].includes(error.message)) throw error;
    throw new Error("fileRead");
  });
}
function ownImageBytes(file, buffer) {
  if (!buffer.byteLength) throw new Error("fileRead");
  if (buffer.byteLength > LIMITS.fileBytes) throw new Error("fileSize");
  const info = inspectImage(buffer);
  const owned = new File([buffer], file.name || "image", {
    type: "image/" + info.format,
  });
  preparedFiles.add(owned);
  return owned;
}
export async function prepareImageFile(file) {
  if (preparedFiles.has(file)) return file;
  const buffer = await readImageBytes(file, (loaded) => {
    if (loaded > LIMITS.fileBytes) throw new Error("fileSize");
  });
  return ownImageBytes(file, buffer);
}
export function captureImageFiles(files, maxBytes = LIMITS.totalBytes) {
  const loaded = files.map(() => 0);
  return files.map((file, index) => {
    // Every selected file starts reading within the original change event.
    const captured = readImageBytes(file, (bytes) => {
      if (bytes > LIMITS.fileBytes) throw new Error("fileSize");
      loaded[index] = bytes;
      if (loaded.reduce((sum, n) => sum + n, 0) > maxBytes)
        throw new Error("batchSize");
    })
      .then((buffer) => ownImageBytes(file, buffer))
      .catch((error) => {
        loaded[index] = 0;
        throw error;
      });
    captured.catch(() => {}); // Later entries may reject before the sequential decoder reaches them.
    return captured;
  });
}
export function loadImageElement(blob) {
  return new Promise((resolve, reject) => {
    const objectURL = URL.createObjectURL(blob);
    const image = new Image();
    const release = () => {
      image.onload = image.onerror = null;
      URL.revokeObjectURL(objectURL);
    };
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        release();
        reject(new Error("decode"));
        return;
      }
      image.onload = image.onerror = null;
      // Keep its object URL alive through drawImage, including on mobile engines.
      image.close = () => {
        release();
        image.removeAttribute("src");
      };
      resolve(image);
    };
    image.onerror = () => {
      release();
      reject(new Error("decode"));
    };
    image.src = objectURL;
  });
}
export async function decodeFile(
  file,
  {
    createBitmap = globalThis.createImageBitmap,
    loadImage = loadImageElement,
  } = {},
) {
  const owned = await prepareImageFile(file);
  let bitmap;
  if (typeof createBitmap === "function") {
    try {
      bitmap = await createBitmap.call(globalThis, owned, {
        imageOrientation: "from-image",
      });
    } catch {
      /* An available API can still reject a valid image. */
    }
  }
  if (!bitmap) {
    try {
      bitmap = await loadImage(owned);
    } catch {
      throw new Error("decode");
    }
  }
  const width = bitmap.naturalWidth || bitmap.width;
  const height = bitmap.naturalHeight || bitmap.height;
  if (!width || !height) {
    bitmap.close?.();
    throw new Error("decode");
  }
  if (width * height > LIMITS.pixels) {
    bitmap.close?.();
    throw new Error("pixels");
  }
  return bitmap;
}
export function drawImage(source, g, width, height, options = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("encode");
  if (options.format === "jpeg" || options.flatten) {
    ctx.fillStyle = options.background || "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.translate(width / 2, height / 2);
  ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
  ctx.rotate((g.rotation * Math.PI) / 180);
  const rotated = g.rotation === 90 || g.rotation === 270;
  ctx.drawImage(
    source,
    g.sx,
    g.sy,
    g.sw,
    g.sh,
    -(rotated ? height : width) / 2,
    -(rotated ? width : height) / 2,
    rotated ? height : width,
    rotated ? width : height,
  );
  return canvas;
}
export function canvasBlob(canvas, type, quality) {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("encode"));
        else if (blob.type !== type) reject(new Error("format"));
        else resolve(blob);
      },
      type,
      quality,
    ),
  );
}
export async function optimize(source, options, { signal, onProgress } = {}) {
  const g = geometry(source.width, source.height, options);
  let canvas = null,
    lastWidth = 0,
    lastHeight = 0;
  try {
    return await searchSize(
      async (width, height, quality) => {
        if (!canvas || lastWidth !== width || lastHeight !== height) {
          if (canvas) {
            canvas.width = 1;
            canvas.height = 1;
          }
          canvas = drawImage(source, g, width, height, options);
          lastWidth = width;
          lastHeight = height;
        }
        return canvasBlob(canvas, "image/" + options.format, quality);
      },
      {
        ...g,
        quality: options.quality / 100,
        minQuality: options.minQuality / 100,
        target: options.target * 1024,
        shrink: options.shrink,
        lossless: options.format === "png",
        signal,
        onProgress,
      },
    );
  } finally {
    if (canvas) {
      canvas.width = 1;
      canvas.height = 1;
    }
  }
}
export async function previewBlob(source, options, limit = 1000) {
  const g = geometry(source.width, source.height, options),
    scale = Math.min(1, limit / Math.max(g.width, g.height)),
    c = drawImage(
      source,
      g,
      Math.max(1, Math.round(g.width * scale)),
      Math.max(1, Math.round(g.height * scale)),
      { ...options, format: "png", flatten: false },
    );
  try {
    return await canvasBlob(c, "image/png");
  } finally {
    c.width = 1;
    c.height = 1;
  }
}
