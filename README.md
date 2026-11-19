# Mehdi Eslami

Bilingual Persian / English portfolio at **https://mehdieslami.ir**, built with static HTML, CSS and browser JavaScript. It remains on GitHub Pages: no server, database, API key, hosted form provider or paid service is needed for the portfolio features.

## Local preview and checks

Use Node.js 22 or later. There are no npm dependencies to install.

```sh
npm run build
npm test
npm run dev
```

Open the printed URL (normally http://127.0.0.1:8000). A plain static HTTP server also works. `npm run build` regenerates `fa/index.html` and the bilingual sitemap from `index.html`; commit the generated files so GitHub Pages needs no build step. `.nojekyll` preserves the static output. Keep `CNAME` when deploying.

## What visitors can do

- Switch between English and Persian, including right-to-left layout, localized labels, dates and quotations. `/` and `/fa/` contain crawlable content without JavaScript. Language changes preserve the current section and form/tool input. A browser preference remembers the chosen language; explicit `/fa/` links open in Persian.
- Search project names, descriptions and technologies in either language; filter web applications or the Java/API project.
- Open a project story, see actual app captures for DearLater and Didgah, follow the source link, and copy a deep link such as `/#project-dearlater`.
- Try three deliberately small browser demonstrations: a five-second sealed letter, a sample survey score and checked stock movements. These do **not** run or host the projects' backends and do not send messages or store real records.
- Count down to the next Programmer's Day (Gregorian day 256), using **the visitor’s device time zone**. Leap years, daylight-saving offsets, the whole local celebration day and the annual rollover are handled. The detected IANA zone is displayed beside the counter; there is no country lookup or location permission. On that date the background changes automatically while the page is open. The calendar download is an all-day `.ics` event. No notification, scheduler or unattended process is implied.
- Preview and end the celebration manually without changing the actual countdown. The celebration adds an aurora palette and bounded falling code to the existing circuit field.
- Format/minify JSON, count words/Unicode characters and estimate reading time, or compare text/background contrast. User input is processed in the current browser tab and is never uploaded.
- Use `Ctrl/Cmd K` for a searchable command menu, or open it with the header button. `Esc` closes native dialogs. A short introduction can be printed or saved as PDF through the browser's print dialog; it is not a fabricated employment résumé.

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

The supplied IRANSansX Regular and Bold webfonts are used in Persian. They are owner-supplied commercial assets, not covered by the Vazirmatn SIL license. Keep their applicable license with your own records. The existing Vazirmatn fallback retains `assets/OFL.txt`.

## Inquiries and privacy

The project form prepares a Telegram message to `Mr_MehdiEslami` or an email to `P30lod@gmail.com`. Visitors must press **send in the destination app**. The site does not store submissions or claim delivery. Copyable text and an explicit fallback link remain available. Do not add credentials or Telegram tokens to client JavaScript.

Local storage holds only language and motion preferences. Project demonstrations reset when reopened. There are no third-party analytics, runtime libraries or external font requests.

## Accessibility and motion

Native dialogs handle focus and Escape. The footer motion control pauses the circuit and decorative CSS motion; the quote pause control remains separate. Both start paused for reduced-motion preferences. Background animation and quote timers stop when the page is hidden; the clock recalculates on return. Quote rotation pauses on hover, keyboard focus or outside its viewport. The default scene uses gently drifting nodes, chamfered light trails, two ambient light pools and a subtle orbit, with bounded mouse parallax. The original celebration scene stays separate. Mobile canvas density, packet count and frame rate are bounded.

## Search setup

Both language routes declare canonical URLs and reciprocal language alternatives. The sitemap lists both routes. Google Search Console and Bing Webmaster verification still require the owner's actual records. A sitemap and metadata do not guarantee indexing or ranking. The .ir domain remains country-associated.

See [AGENTS.md](AGENTS.md) before future edits.
