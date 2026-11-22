import {
  geometry,
  searchSize,
  inspectImage,
  LIMITS,
} from "./image-core.mjs?v=20261123-image2";
// Own the selected bytes before clearing the picker or reading the image again.
const preparedFiles = new WeakSet();
export async function readImageBytes(file) {
  if (typeof file.arrayBuffer === "function") {
    try {
      return await file.arrayBuffer();
    } catch {
      /* Try FileReader as well. */
    }
  }
  if (typeof FileReader !== "function") throw new Error("fileRead");
  try {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reader.onabort = () => reject(new Error("fileRead"));
      reader.readAsArrayBuffer(file);
    });
  } catch {
    throw new Error("fileRead");
  }
}
export async function prepareImageFile(file) {
  if (preparedFiles.has(file)) return file;
  if (file.size > LIMITS.fileBytes) throw new Error("fileSize");
  const buffer = await readImageBytes(file);
  if (!buffer.byteLength) throw new Error("fileRead");
  const info = inspectImage(buffer);
  const owned = new File([buffer], file.name || "image", {
    type: "image/" + info.format,
    lastModified: file.lastModified || Date.now(),
  });
  preparedFiles.add(owned);
  return owned;
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
