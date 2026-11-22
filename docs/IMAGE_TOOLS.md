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


## Android file-provider reads

Start all selected file reads synchronously inside the original change handler,
before awaiting another image, inspecting provider size/timestamp or mutating the
native file input. FileReader starts first where available; limits are checked
from actual read progress and buffer length (40 MiB/file, 100 MiB/batch). Owned
Files are decoded sequentially after capture. Keep read rejections observed even
when a later file fails before the decoder reaches it. Do not disable the native
input during capture; prevent a second picker activation with its click handler.

The image picker uses `image/*`; the separate “Choose from device files” input
has no accept filter so Android can offer its document/file picker. Both paths
share header validation and image limits; the unfiltered picker does not permit
unsupported files to reach a decoder. If a provider still refuses to supply bytes,
point to the alternate picker rather than labeling the image damaged or claiming
that a JavaScript retry can grant operating-system access.

Regression tests verify synchronous starts for every selected file and assert
that provider size/lastModified getters are never needed before capture. A
Chromium Android provider issue is documented at
https://issues.chromium.org/issues/40123366. This motivates the compatibility
path; it does not establish a reproduced failure on every Android device.
