# Profile text generator

The profile tool is the only retained feature from the former playground.
Its public routes are `/tools/profile-text/` and `/fa/tools/profile-text/`.
The skills map, circuit game, project builder, request simulator and light
signature have been removed from navigation, source modules and public content.
Their old playground URLs redirect to the corresponding profile tool, declare
`noindex` and are omitted from the sixteen-URL sitemap.

## Source map

| File | Responsibility |
| --- | --- |
| `content/profile.mjs` | Localized page copy, metadata and routes. |
| `scripts/profile-pages.mjs` | Profile pages, homepage discovery card and retired-route redirects. |
| `profile-core.mjs` | Unicode styles, Persian transforms, frames, effects, deduplication and ASCII. |
| `profile-data.mjs` | Arabic presentation-form mappings from standard Unicode decompositions. |
| `profile.js` | Filtering, safe rendering, favorites, clipboard, custom mixes and text export. |
| `profile.css` | Responsive layouts and scoped tool styling. |
| `tests/profile.test.mjs` | Output families, Unicode bounds, joining, normalization and retired-feature removal. |

## Copyable styles

Latin lettering includes serif and sans-serif variants, italic, script, Gothic,
double-struck, monospace, full-width, circled and squared alphabets. Script,
italic, Gothic and double-struck alphabets contain Unicode exceptions: keep the
explicit replacements rather than relying on contiguous code points alone.
Alternative letter maps, text effects, frames, emoji, mixed styles and real
ASCII extend the set. ASCII wraps at word boundaries and uses only `#`, spaces
and newlines in its output.

Persian styles include three tatweel lengths, context-sensitive presentation
forms, decorative marks, frames and emoji. Tatweel is inserted only between
letters that can join; non-joining letters and ZWNJ remain boundaries. Transparent
marks are skipped when determining neighbors. Presentation-form output normalizes
back to the same base text with NFKC. Do not insert arbitrary spaces between
Persian letters or claim that every visual font is a separate copyable alphabet.

Input is limited to eighty code points. Control characters and directional
overrides are removed; normal Persian half-spaces and joining are retained.
Effects are bounded to at most four added marks per letter. Actual duplicate
strings are removed. Typical results are 157 styles for `mehdi eslami` and 139
for `مهدی اسلامی`; counts vary with the input and are displayed dynamically.
Rendering uses `textContent` or form values, never user-authored HTML.

## Interaction and storage

Results are categorized and rendered in batches of 24. Search matches English
and Persian style names and stable style IDs. A preview-size control affects
only the tool. Saved styles persist identifiers, not user text. Favorites work
in memory if local storage is blocked. A short-lived session draft preserves
input, filters, preview size and custom-combination state when switching language.

The custom builder combines a lettering style, one of the frames and up to four
extra symbol code points. Refreshing mixes changes the paired combinations while
leaving the base alphabets and frames stable. Copy-all and text export use the
entire filtered result set, including results not yet rendered. Clipboard failure
presents a selected field for manual copying. App-specific character and line-break
restrictions are explained in the visible guide.

## Preservation and verification

The homepage and service SEO, supplied résumés, original circuit scene, glass
panels, meteor effects and launch treatment retain their existing behavior.
Do not change root backgrounds or stacking to style this tool. Keep the native
manifest and launch files outside the scope of profile-text changes.

Run the normal build, full Node tests, JavaScript syntax checks and diff whitespace
check. Validate assigned Unicode characters across uppercase, lowercase and digit
inputs. Exercise Persian, English, mixed names, ZWNJ, empty/long input, style
filters, favorites, copy, custom mixes, export and language preservation. Review
the two tool pages and homepage at mobile and desktop widths. Confirm that the
retired tools are absent and their redirect pages remain outside the sitemap.
