# Image tools

The bilingual workbench is static and runs on GitHub Pages. Browser Canvas
encodes JPEG, PNG and WebP without external dependencies or file uploads. The
homepage has a dedicated discovery card beside the retained profile-text tool.
The original circuit/meteor code, portrait, installed launch and résumés are not
changed by this feature.

## Source map

| Source | Responsibility |
| --- | --- |
| `content/image.mjs` | Locale paths and search metadata |
| `scripts/image-pages.mjs` | Static bilingual shell, controls, visible guide, schema and discovery card |
| `image-core.mjs` | Limits, geometry, target search, container inspection, safe names and ZIP |
| `image-engine.mjs` | Decode, Canvas transforms, verified MIME, export and capped preview |
| `image.js` | Queue, settings, crop interaction, previews, cancellation, downloads and locale shell |
| `image.css` | Scoped dark layout and reachable mobile actions |
| `tests/image.test.mjs` | Geometry, real byte target contracts, cancellation, ZIP and input guards |

## Processing contract

- Accept still JPEG, PNG and WebP: at most 20 files, 40 MiB per file, 100 MiB
  total and 24 million decoded pixels per image. Reject animation, SVG, HEIC,
  AVIF and malformed containers. Very long source sides above 16384 px are
  rejected before decoding. Output is bounded to 8192 px per side and 24 MP.
- Selected file bytes are read once into an owned File before the picker is
  cleared. Use FileReader if Blob.arrayBuffer fails or is absent. Inspect headers
  before decoding. EXIF orientation is applied by the browser. If
  createImageBitmap is absent OR rejects the image, retry with a loaded image
  element. Keep its object URL alive until close(), after canvas drawing.
  Source metadata is not copied to Canvas exports. Color management is browser
  dependent; the tool does not promise identical print colors or custom DPI.
- Crop percentages refer to the unrotated, orientation-correct source. Apply
  crop, quarter-turn rotation and output-axis flips. Aspect-locked width/height
  form a bounding box. Zero means no requested limit. Enlarging is opt-in and
  does not recover detail. Unlocked dimensions explicitly allow stretching.
- A target KB is 1024 bytes. Encode at the quality ceiling first. If needed,
  test the floor and make seven bounded quality probes to retain the highest
  sampled fitting quality. If permitted, retry at smaller dimensions for at
  most eight size passes. Each attempt checks abort state. Impossible targets
  retain a real export and report failure; actual bytes determine success.
- PNG has no quality parameter. It can reach a target through permitted
  dimension reduction, or report the target as unreachable. JPEG always fills
  the chosen background. WebP/PNG preserve alpha unless flattening is selected.
- Verify `Blob.type` rather than accepting a silent PNG fallback. Files that
  become larger remain clearly labeled. No fixed compression percentage or
  lossless resizing is promised. A fresh encode may be larger than the source.
- Work proceeds sequentially. Close decoded bitmaps, release canvases and revoke
  removed/replaced object URLs. Keep only a capped original preview and tiny
  queue thumbnails. No image or filename is persisted to browser storage.
- Settings are per-image; applying to all includes the crop and transforms.
  Changed settings invalidate old exports. ZIP includes only ready files and
  states the count. Entries use UTF-8, CRC32, collision-safe sanitized names and
  stored data, since image formats are already compressed. No ZIP dependency.
- Switch language by loading the paired static shell and retaining the working
  queue in memory. Update visible content, canonical, metadata and JSON-LD.
  Reload/closing the tab clears work; files are not recovered automatically.

## Verification

Run `npm run build`, `npm test`, `node --check image.js`,
`node --check image-engine.mjs`, `node --check app.js`, `git diff --check`.
The Node test suite needs Node 22+ only. The ZIP format was additionally checked
with Python's independent `zipfile` reader during development.

In a real browser check a transparent PNG, JPEG with EXIF orientation and WebP;
actual output MIME, alpha versus solid JPEG background, crop/rotation/flip pixels,
a fitting target, an impossible target with size reduction disabled, grouped
processing, cancellation, file chooser rejects and individual/ZIP downloads.
Inspect the native full-resolution dialog and keyboard close, language switching
with a populated queue, and both static routes at 360px and 1280px. A browser's
codec result is not identical across all devices; native Android and iOS file
pickers and memory limits still warrant device testing.

## Primary platform references

- [Canvas toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- [ImageBitmap decoding and orientation](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap)


## Image import compatibility

Imports must not depend on crypto.randomUUID: local queue IDs use a monotonic
counter and never serve as authentication tokens. An error in queue creation or
preview encoding is not proof that the original image is damaged. Keep read,
decode, encode, format and internal failures distinct in both languages.

Compatibility tests cover an available bitmap API rejecting a valid image,
a missing API, independent file bytes after the source provider expires,
unsupported headers never reaching a decoder, oversized fallback cleanup and
real HTML image decoding, including orientation and alpha. Cache versions for
the page controller and both imported image modules must advance together when
import behavior changes, so existing mobile clients fetch the corrected files.
