# Mehdi Eslami

Bilingual Persian / English portfolio at **https://mehdieslami.ir**, built with static HTML, CSS and browser JavaScript. It remains on GitHub Pages: no server, database, API key, hosted form provider or paid service is needed for the portfolio features.

## Local preview and checks

Use Node.js 22 or later. There are no npm dependencies to install.

```sh
npm run build
npm test
npm run dev
```

Open the printed URL (normally http://127.0.0.1:8000). A plain static HTTP server also works. `npm run build` refreshes homepage metadata, regenerates `fa/index.html`, creates ten localized service pages and rebuilds the eighteen-URL sitemap; commit the generated files so GitHub Pages needs no build step. `.nojekyll` preserves the static output. Keep `CNAME` when deploying.

## Homepage priorities

The homepage leads with the introduction, development services and selected
projects, followed by about/skills, résumé downloads and contact. Services are
ordered as website development, custom web applications, Java/Spring Boot and
Android. Free tools come after contact: the image/profile discovery pair (image
first), date tools and the JSON/text/contrast lab. Programmer’s Day and sourced
quotes close the main content. Preserve this source order in both languages and
keep the existing card styles, anchors and generated discovery markers.

## What visitors can do

- Switch between English and Persian, including right-to-left layout, localized labels, dates and quotations. `/` and `/fa/` contain crawlable content without JavaScript. Language changes preserve the current section and form/tool input. Each explicit URL opens its own language. Switching languages keeps the current input and updates metadata and service links together.
- Search project names, descriptions and technologies in either language; filter web applications or the Java/API project.
- Open a project story, see actual interface captures for all five projects, follow the source link, and copy a deep link such as `/#project-dearlater`.
- Try three deliberately small browser demonstrations: a five-second sealed letter, a sample survey score and checked stock movements. These do **not** run or host the projects' backends and do not send messages or store real records.
- Count down to the next Programmer's Day (Gregorian day 256), using **the visitor’s device time zone**. Leap years, daylight-saving offsets, the whole local celebration day and the annual rollover are handled. The detected IANA zone is displayed beside the counter; there is no country lookup or location permission. On that date the background changes automatically while the page is open. The calendar download is an all-day `.ics` event. No notification, scheduler or unattended process is implied.
- Preview and end the celebration manually without changing the actual countdown. The celebration adds an aurora palette and bounded falling code to the existing circuit field.
- Format/minify JSON, count words/Unicode characters and estimate reading time, or compare text/background contrast. User input is processed in the current browser tab and is never uploaded.
- Use `Ctrl/Cmd K` for a searchable command menu, or open it with the header button. `Esc` closes native dialogs. Download the owner-supplied English/Persian résumés in dark or light/ATS style from `#resume`. All four original PDFs stay byte-for-byte unchanged. A short introduction can be printed or saved as PDF through the browser's print dialog; it is not a fabricated employment résumé.

The Persian version uses formal, fluent written Persian with clear service descriptions and respectful address. Keep this voice consistent in page copy, metadata, project details and interface messages.

## Installed app launch

`site.webmanifest` supplies the install name, standalone display, charcoal launch
background, dedicated 192/512px icons and a separate safe-zone maskable icon.
All eighteen routes link to the same manifest and retain the existing root app
identity. There are no global background or color-scheme overrides: the original
negative-z-index circuit canvas and native controls retain their previous appearance.

`scripts/pwa-shell.mjs` generates shared launch markup and early detection during
the normal build. `pwa.css` and `pwa.js` provide a brief, localized monogram intro
only on the first ordinary navigation in an installed app's tab session. Browser
tabs, reloads, history restores and later internal navigation skip the intro.
Reduced motion and the saved motion preference remove decorative movement. Input
skips the intro immediately; an independent 1.8s fallback removes it even if the
controller fails. No service worker, offline cache or artificial loading progress
is introduced. Native splash sizing and timing remain browser/OS-controlled.

To re-export icons after a logo geometry change, run
`python3 scripts/export-app-icons.py` with Pillow installed in the development
environment. This does not add a runtime dependency. On Android, existing
installations may need a manifest refresh or reinstall to pick up the native
launch appearance; always verify that on a real device.

See [docs/LAUNCH.md](docs/LAUNCH.md) for launch styling boundaries, the background
layering fix and checks to run before changing this feature.

## Source map

| File                  | Purpose                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `index.html`          | English source, `data-en` / `data-fa` text, metadata, project links and initial content             |
| `fa/index.html`       | Generated static Persian page; rebuild instead of editing directly                                  |
| `app.js`              | Language controller, form handoff, quotes, motion, dialogs, demos, tools and keyboard menu          |
| `core.mjs`            | Pure date, calendar, contrast, text and stock helpers                                               |
| `style.css`           | Existing visual identity plus responsive Persian/English extensions and print layout                |
| `scripts/build.mjs`   | Dependency-free Persian page and sitemap generation                                                 |
| `scripts/serve.mjs`   | Local development server only; not needed by GitHub Pages                                           |
| `tests/core.test.mjs` | Date boundaries, all-day calendar, contrast, Unicode text, stock validation and static-route checks |
| `docs/screenshots.md` | Which captures are real, their source revisions and demo scope                                      |

Project cards display the captured interface edge-to-edge, without a filtered border or shadow. Captions sit below the image in normal flow. Mobile cards use one column with separate action and note rows; English project names stay isolated inside the Persian layout. Keep screenshot decorations outside inversion filters to avoid bright halos.

The supplied IRANSansX Regular and Bold webfonts are used in Persian. They are owner-supplied commercial assets, not covered by the Vazirmatn SIL license. Keep their applicable license with your own records. The existing Vazirmatn fallback retains `assets/OFL.txt`.

## Inquiries and privacy

The project form prepares a Telegram message to `Mr_MehdiEslami` or an email to `P30lod@gmail.com`. Visitors must press **send in the destination app**. The site does not store submissions or claim delivery. Copyable text and an explicit fallback link remain available. Do not add credentials or Telegram tokens to client JavaScript.

Local storage holds language and motion preferences and favorite profile-style identifiers. A short-lived session draft preserves tool input when switching language. Project demonstrations reset when reopened. There are no third-party analytics, runtime libraries or external font requests.

## Accessibility and motion

Native dialogs handle focus and Escape. The footer motion control pauses the circuit and decorative CSS motion; the quote pause control remains separate. Both start paused for reduced-motion preferences. Background animation and quote timers stop when the page is hidden; the clock recalculates on return. Quote rotation pauses on hover, keyboard focus or outside its viewport. The default scene uses gently drifting nodes, chamfered light trails, two ambient light pools and a subtle orbit, with bounded mouse parallax. Occasional single shooting stars leave a brief green reflection on nearby panel edges. The light follows viewport coordinates, with panel measurements bounded to 10Hz while a star is active; pause, reduced motion, hidden tabs and resize clear it. The original celebration scene stays separate. Mobile canvas density, packet count and frame rate are bounded.

## Search setup

All eighteen localized pages declare self-canonical URLs and reciprocal language alternatives. The sitemap lists both homepages, both service overviews, four service pages in each language, and the paired profile-text, image-tool and date-tool routes. `seo.mjs` is shared with the homepage language controller, and `content/services.mjs` owns service copy. Page titles, descriptions, structured data and visible content stay aligned. Google Search Console and Bing Webmaster verification still require the owner's actual records. A sitemap and metadata do not guarantee indexing or ranking. The .ir domain remains country-associated.

See [docs/SEO.md](docs/SEO.md) for the page map, owner verification steps and measurement limits. See [AGENTS.md](AGENTS.md) before future edits.

## Profile text generator

`/tools/profile-text/` and `/fa/tools/profile-text/` provide copyable English and
Persian lettering, decorative frames, emoji and ASCII. Categories, style search,
preview sizing, favorites, a custom combination builder, bulk copying and text
export make the results easier to browse. Results are deduplicated and displayed
in batches of 24. The generator runs in the browser without an external service.

The former playground routes redirect to the profile tool and are excluded from
indexing and the sitemap. The five retired experiments are no longer part of the
interface or executable code. Existing JSON, text and contrast tools remain in
`#lab`.

See [docs/PROFILE_TEXT.md](docs/PROFILE_TEXT.md) for behavior and maintenance.


## Image compressor and resizer

`/tools/image-optimizer/` and `/fa/tools/image-optimizer/` provide a browser-only
image workbench. JPEG, PNG and still WebP inputs support independent per-image
settings, quality bounds, an actual KB target, optional dimension reduction,
aspect-locked resizing or explicit stretching, crop percentages and pointer
selection, rotation, flips and transparency/background control. A split preview
and a native full-resolution dialog make the output inspectable. Batch export
uses a dependency-free UTF-8 ZIP writer; settings can be copied to the whole queue.
The locale shell can switch while working files remain in memory.

See [docs/IMAGE_TOOLS.md](docs/IMAGE_TOOLS.md) for limits, encoding trade-offs,
source files and verification. The existing homepage presentation and splash
remain unchanged; a new discovery card links to the tool.

## Date and calendar tools

The `#date-tools` discovery card is in the free-tools area after contact and
before ONLINE TOOLS on both homepages.
It opens the complete workbench and crawlable guide at `/tools/date-converter/` and
`/fa/tools/date-converter/`. Convert Persian, Gregorian and calculated civil
Hijri dates, calculate age and the next birthday, compare or shift dates, browse
the monthly calendar, copy results and download a birthday calendar file.
A branded analog clock offers matching digital time, explicit zones and three
dark face styles.
The dark interface supports Persian/Arabic digits, an explicit today time zone,
leap-birthday policies and mobile layouts. All calculations run in the browser.
Occasion lists and official-holiday data are not included; keep the calculated
Hijri method label visible. See [docs/DATE_TOOLS.md](docs/DATE_TOOLS.md).
