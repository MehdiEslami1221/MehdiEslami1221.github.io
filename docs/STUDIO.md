# Interactive studio

The studio extends the portfolio with browser interactions while retaining the
existing circuit scene, monogram, launch treatment and bilingual service pages.
It has no backend, external runtime package, account requirement or analytics.

## Routes and source

| Source | Responsibility |
| --- | --- |
| `content/studio.mjs` | Tool descriptions, localized metadata and public paths. |
| `scripts/studio-pages.mjs` | Homepage cards, two playground pages and two profile text pages. |
| `studio-core.mjs` | Unicode/ASCII transformations, project modules, request scenarios and seeded artwork geometry. |
| `studio.js` | Events, safe DOM updates, clipboard, downloads and the canvas controller. |
| `studio.css` | Responsive cards, panels, controls and tool layouts. |
| `tests/studio.test.mjs` | Persian joining, Unicode bounds, ASCII output, feature selection and deterministic geometry. |

The public routes are `/playground/`, `/fa/playground/`,
`/tools/profile-text/` and `/fa/tools/profile-text/`. The normal build generates
them with the existing twelve routes and includes all sixteen in the sitemap.
Each pair has independent metadata, reciprocal language links and self-canonical
URLs. Keep the shared Person and WebSite identifiers unchanged.

## Tool behavior

Profile names retain Persian joining and zero-width non-joiners. Frames keep
the original text; Latin styles map letters to Unicode characters. Real ASCII
lettering accepts Latin letters, digits, spaces, dots, underscores and hyphens.
It wraps at word boundaries where possible. Clean input is limited to forty
code points and removes control characters and directional overrides. Rendering
must use `textContent` or form values, never interpolate user text as HTML.
Clipboard failure presents a selected text field for manual copying. Social
apps can restrict characters and line breaks; previewing the pasted result is
part of the tool's visible guidance.

The skill map links a selected technology to documented projects. Do not add
technology relationships without checking the project's actual source or notes.
The circuit puzzle has three randomized boards and a three-second penalty per
wrong choice. It stores only a local personal best; it has no global leaderboard.
Leaving the document stops an active game instead of quietly counting absence.

The project builder selects from known features and exports a text brief and an SVG map. The
map is an initial sketch, not a completed application, delivery estimate or
price. The request tool walks through predefined successful, invalid, offline
and slow-response scenarios. It sends no real API requests.

The light signature uses bounded seeded geometry on a 1200×750 canvas. The same
preview canvas is exported as PNG. Animation is limited to 24 frames per second,
stops when the document or artwork is hidden and supports motion pause and
reduced-motion preferences. Name changes produce a deterministic new pattern.

Language links preserve the current tool inputs through a short-lived session
draft. User text is not placed in URLs or sent to a server. Persistent storage
adds only the circuit-game personal best to existing portfolio preferences.

## Glass and meteor reflections

Transparency and backdrop filtering are scoped to panels. Dark fallback fills,
readable text and the original project capture treatment remain in place.
Meteor reflections reuse the existing bounded measurements and motion controls;
their glow and edge tint are slightly stronger. New homepage studio cards and
the quote panel participate in the same reflection system. Do not set an opaque
root background or change the original scene's negative stacking layers.

## Verification

Run the build, full Node test suite, JavaScript syntax checks and diff whitespace
check after relevant changes. Check all sixteen static routes for metadata,
language alternatives, local resource links and sitemap inclusion. Exercise
Persian, English, mixed input, empty values, ASCII, copying and inert markup text.
Test game penalties and completion, feature selection/export, every request
scenario and image export. Review home and tool routes at mobile and desktop
widths, including keyboard use, language preservation and motion pause.
