# Installed app launch

The installed portfolio opens with the ivory/lime ME monogram on charcoal.
Its launch treatment is separate from the website's layout and animated circuit
background. Updating this feature must preserve the appearance and behavior of
the page that follows it.

## Reference revisions

| Revision | Reference |
| --- | --- |
| `748db7a` | Portfolio before launch customization, including the circuit scene, meteors and ME monogram. |
| `d47f179` | Corrected launch release: original page appearance with the custom splash retained. |

These revisions document the launch change. For subsequent maintenance, compare
against the latest accepted revision so later changes are preserved as well.

## Launch behavior

- The shared manifest retains `id: "/"`, `start_url: "/"`, standalone display and
  `#080a09` for the native theme and launch background.
- Dedicated 192px and 512px PNG icons use the existing logo. A separate 512px
  maskable icon keeps the mark within the launcher safe zone.
- The in-page intro appears on the first ordinary navigation in an installed
  app's tab session. Browser tabs, reloads, history restores and subsequent
  internal navigation skip it.
- Name and role follow the page language. The intro uses a subtle green glow,
  a short accent line and a brief fade into the existing page.
- Reduced motion and the saved motion pause remove decorative movement.
  Keyboard or pointer input dismisses the intro immediately.
- An independent 1.8-second fallback removes the launch state if the controller
  stalls. A late callback must not reopen an already dismissed intro.
- Native splash size, composition and duration remain browser/OS decisions.
  There is no service worker, offline cache, loading percentage or additional
  backend attached to this feature.

## Background layering

The circuit canvas sits in `.network-viewport` at `z-index: -2`; the ambient
grain layer sits above it at `z-index: -1`. The existing page relies on a
transparent root element and propagation of the body's background to the canvas.

Setting `html { background: #080a09; }` stops that propagation. The body then
paints its opaque background above the negative layers, covering the circuit
scene even though its animation code still runs. A global `color-scheme` also
changes native control presentation beyond the splash.

Keep the native splash background in `site.webmanifest` and the in-page splash
background on `.app-launch`. Do not add root/background overrides, reorder the
existing layers or change their stacking to accommodate launch styling.

## Source map

| File | Responsibility |
| --- | --- |
| `site.webmanifest` | Installation identity, native launch colors and icons. |
| `scripts/pwa-shell.mjs` | Shared launch head, markup and early detection. |
| `pwa.css` | Styles scoped to the launch overlay and its descendants. |
| `pwa.js` | Independent dismissal, input skip and transition handling. |
| `scripts/export-app-icons.py` | Development-time raster exports of the existing logo. |
| `scripts/build.mjs` | Rebuilds homepage launch blocks and the Persian route. |
| `scripts/service-pages.mjs` | Includes the same launch shell in service routes. |
| `tests/pwa.test.mjs` | Guards styling scope, navigation selection and dismissal behavior. |

`index.html` remains the homepage source. Rebuild generated Persian and service
pages instead of editing them directly. During splash-only work, preserve
`app.js`, `style.css`, `core.mjs`, `services.css`, page copy, portrait, fonts,
project captures, original résumé PDFs and all existing navigation.

## Verification

Run `npm run build`, `npm test`, `node --check app.js`, `node --check pwa.js` and
`git diff --check` after relevant source changes. Review the final diff against
the accepted pre-change revision. Outside the shared launch blocks, all twelve
static pages must retain their prior markup during splash-only work.

Inspect both languages at 360px and 1280px. Confirm that the circuit scene and
light trails remain visible after launch, the motion control still works and
the layout has no horizontal overflow. Check normal browser entry separately
from installed entry, including reduced motion, immediate input dismissal,
reload/history navigation and controller failure.

The corrected release passed 16 automated tests and a twelve-page markup
comparison. Its background was checked in desktop and mobile browser previews.
Native Android splash rendering still requires a real-device check; browser
previews do not verify the OS-generated launch screen. Existing installations
may need a manifest refresh or reinstall to pick up updated native launch data.
