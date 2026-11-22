import {
  geometry,
  searchSize,
  inspectImage,
  LIMITS,
} from "./image-core.mjs?v=20261122-image1";
export async function decodeFile(file) {
  if (file.size > LIMITS.fileBytes) throw new Error("fileSize");
  inspectImage(await file.arrayBuffer());
  let bitmap;
  if (typeof createImageBitmap === "function")
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  else {
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      bitmap = image;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  if (
    (bitmap.width || bitmap.naturalWidth) *
      (bitmap.height || bitmap.naturalHeight) >
    LIMITS.pixels
  ) {
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
