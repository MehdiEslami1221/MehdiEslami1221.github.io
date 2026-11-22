// Browser-independent image geometry, size search and UTF-8 ZIP writer.
export const LIMITS = Object.freeze({
  files: 20,
  fileBytes: 40 * 1024 ** 2,
  totalBytes: 100 * 1024 ** 2,
  pixels: 24_000_000,
  side: 8192,
});
export const defaults = () => ({
  format: "webp",
  quality: 88,
  minQuality: 35,
  target: 0,
  shrink: true,
  width: 0,
  height: 0,
  lock: true,
  upscale: false,
  rotation: 0,
  flipX: false,
  flipY: false,
  crop: { x: 0, y: 0, w: 100, h: 100 },
  background: "#ffffff",
  flatten: false,
  suffix: "-optimized",
});
const number = (v, fallback = 0) =>
  Number.isFinite(Number(v)) ? Number(v) : fallback;
export const clamp = (v, min, max) =>
  Math.min(max, Math.max(min, number(v, min)));
export function normalizeCrop(c = {}) {
  const round = (v) => Number(v.toFixed(4));
  const x = round(clamp(c.x, 0, 99)),
    y = round(clamp(c.y, 0, 99));
  return {
    x,
    y,
    w: round(clamp(c.w ?? 100, 1, 100 - x)),
    h: round(clamp(c.h ?? 100, 1, 100 - y)),
  };
}
export function geometry(sourceWidth, sourceHeight, options = {}) {
  const crop = normalizeCrop(options.crop),
    rotation = ((number(options.rotation) % 360) + 360) % 360;
  const sx = (sourceWidth * crop.x) / 100,
    sy = (sourceHeight * crop.y) / 100,
    sw = (sourceWidth * crop.w) / 100,
    sh = (sourceHeight * crop.h) / 100;
  const rotated = rotation === 90 || rotation === 270,
    bw = rotated ? sh : sw,
    bh = rotated ? sw : sh;
  let width = clamp(options.width || bw, 1, LIMITS.side),
    height = clamp(options.height || bh, 1, LIMITS.side);
  if (options.lock !== false) {
    const scale = Math.min(
      options.width > 0 ? width / bw : Infinity,
      options.height > 0 ? height / bh : Infinity,
      options.upscale ? Infinity : 1,
    );
    const factor = Number.isFinite(scale) ? scale : 1;
    width = bw * factor;
    height = bh * factor;
  } else if (!options.upscale) {
    width = Math.min(width, bw);
    height = Math.min(height, bh);
  }
  const safety = Math.min(
    1,
    LIMITS.side / width,
    LIMITS.side / height,
    Math.sqrt(LIMITS.pixels / (width * height)),
  );
  return {
    sx,
    sy,
    sw,
    sh,
    rotation,
    width: Math.max(1, (safety < 1 ? Math.floor : Math.round)(width * safety)),
    height: Math.max(
      1,
      (safety < 1 ? Math.floor : Math.round)(height * safety),
    ),
  };
}
export async function searchSize(
  encode,
  {
    width,
    height,
    quality = 0.88,
    minQuality = 0.35,
    target = 0,
    shrink = true,
    lossless = false,
    signal,
    onProgress = () => {},
  },
) {
  const check = () => {
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  };
  let best = null,
    attempt = 0,
    w = width,
    h = height;
  const high = clamp(quality, 0.05, 1),
    low = Math.min(high, clamp(minQuality, 0.05, 1));
  const take = async (q) => {
    check();
    onProgress(++attempt);
    const blob = await encode(w, h, q);
    check();
    if (!blob || !blob.size) throw new Error("encode");
    const r = {
      blob,
      width: w,
      height: h,
      quality: lossless ? null : q,
      met: !target || blob.size <= target,
      attempts: attempt,
    };
    if (!best || blob.size < best.blob.size) best = r;
    return r;
  };
  for (let pass = 0; pass < (shrink && target ? 8 : 1); pass++) {
    const top = await take(high);
    if (top.met) return top;
    let smallest = top;
    if (!lossless && low < high) {
      const bottom = await take(low);
      smallest = bottom;
      if (bottom.met) {
        let left = low,
          right = high,
          fit = bottom;
        for (let i = 0; i < 7; i++) {
          const middle = (left + right) / 2,
            r = await take(middle);
          if (r.met) {
            fit = r;
            left = middle;
          } else right = middle;
        }
        return fit;
      }
    }
    if (!shrink || !target || (w === 1 && h === 1)) break;
    const scale = Math.min(
      0.82,
      Math.max(0.15, Math.sqrt(target / smallest.blob.size) * 0.9),
    );
    w = Math.max(1, Math.floor(w * scale));
    h = Math.max(1, Math.floor(h * scale));
  }
  return {
    ...best,
    attempts: attempt,
    met: !target || best.blob.size <= target,
  };
}
export function fileName(name, format, suffix = "-optimized") {
  const clean = (s) =>
    String(s)
      .normalize("NFC")
      .replace(/[\x00-\x1f\x7f\u202a-\u202e\u2066-\u2069/\\:*?"<>|]/g, "-")
      .replace(/^[. ]+|[. ]+$/g, "");
  const base =
    clean(
      String(name)
        .split(/[\/\\]/)
        .pop()
        .replace(/\.[^.]+$/, ""),
    ).slice(0, 90) || "image";
  return (
    base +
    clean(suffix).slice(0, 30) +
    "." +
    ({ jpeg: "jpg", png: "png", webp: "webp" }[format] || "png")
  );
}
const crcTable = Uint32Array.from({ length: 256 }, (_, n) => {
  for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
export function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
export async function zipFiles(files) {
  const local = [],
    directory = [],
    names = new Set();
  let offset = 0,
    centralSize = 0;
  for (const file of files) {
    let name = file.name,
      n = 2;
    while (names.has(name))
      name = file.name.replace(/(\.[^.]+)$/u, `-${n++}$1`);
    names.add(name);
    const nameBytes = new TextEncoder().encode(name),
      data = new Uint8Array(await file.blob.arrayBuffer()),
      crc = crc32(data);
    const header = new Uint8Array(30 + nameBytes.length),
      v = new DataView(header.buffer);
    v.setUint32(0, 0x04034b50, true);
    v.setUint16(4, 20, true);
    v.setUint16(6, 0x800, true);
    v.setUint16(12, 33, true);
    v.setUint32(14, crc, true);
    v.setUint32(18, data.length, true);
    v.setUint32(22, data.length, true);
    v.setUint16(26, nameBytes.length, true);
    header.set(nameBytes, 30);
    local.push(header, file.blob);
    const central = new Uint8Array(46 + nameBytes.length),
      c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x800, true);
    c.setUint16(14, 33, true);
    c.setUint32(16, crc, true);
    c.setUint32(20, data.length, true);
    c.setUint32(24, data.length, true);
    c.setUint16(28, nameBytes.length, true);
    c.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    directory.push(central);
    offset += header.length + data.length;
    centralSize += central.length;
  }
  const end = new Uint8Array(22),
    e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, files.length, true);
  e.setUint16(10, files.length, true);
  e.setUint32(12, centralSize, true);
  e.setUint32(16, offset, true);
  return new Blob([...local, ...directory, end], { type: "application/zip" });
}
// Reject animation and oversized images from container headers before decoding.
export function inspectImage(buffer) {
  const a = new Uint8Array(buffer),
    v = new DataView(buffer),
    ascii = (start, len) =>
      String.fromCharCode(...a.subarray(start, start + len));
  const valid = (format, width, height, animated = false) => {
    if (
      !width ||
      !height ||
      width * height > LIMITS.pixels ||
      Math.max(width, height) > 16384
    )
      throw new Error("pixels");
    if (animated) throw new Error("animated");
    return { format, width, height };
  };
  if (
    a.length >= 24 &&
    v.getUint32(0) === 0x89504e47 &&
    ascii(12, 4) === "IHDR"
  ) {
    let animated = false;
    for (let p = 8; p + 12 <= a.length; ) {
      const len = v.getUint32(p),
        type = ascii(p + 4, 4);
      if (type === "acTL") animated = true;
      if (type === "IEND") break;
      p += 12 + len;
    }
    return valid("png", v.getUint32(16), v.getUint32(20), animated);
  }
  if (a.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    let w = 0,
      h = 0,
      animated = false;
    for (let p = 12; p + 8 <= a.length; ) {
      const type = ascii(p, 4),
        len = v.getUint32(p + 4, true),
        s = p + 8;
      if (s + len > a.length) throw new Error("decode");
      const u24 = (i) => a[i] | (a[i + 1] << 8) | (a[i + 2] << 16);
      if (type === "VP8X" && len >= 10) {
        animated = !!(a[s] & 2);
        w = 1 + u24(s + 4);
        h = 1 + u24(s + 7);
      } else if (type === "VP8 " && len >= 10 && !w) {
        w = v.getUint16(s + 6, true) & 0x3fff;
        h = v.getUint16(s + 8, true) & 0x3fff;
      } else if (type === "VP8L" && len >= 5 && !w) {
        const bits = v.getUint32(s + 1, true);
        w = 1 + (bits & 0x3fff);
        h = 1 + ((bits >>> 14) & 0x3fff);
      }
      if (type === "ANIM") animated = true;
      p = s + len + (len % 2);
    }
    return valid("webp", w, h, animated);
  }
  if (a.length > 4 && a[0] === 255 && a[1] === 216) {
    let p = 2;
    while (p + 4 < a.length) {
      if (a[p] !== 255) {
        p++;
        continue;
      }
      while (a[p] === 255) p++;
      const marker = a[p++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (p + 2 > a.length) break;
      const len = v.getUint16(p);
      if (len < 2 || p + len > a.length) break;
      if (
        [
          0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd,
          0xce, 0xcf,
        ].includes(marker) &&
        len >= 7
      )
        return valid("jpeg", v.getUint16(p + 5), v.getUint16(p + 3));
      p += len;
    }
    throw new Error("decode");
  }
  throw new Error("unsupported");
}
