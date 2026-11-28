# Portfolio maintenance

Architecture scene updated from baseline `d69f11e` on 28 November 2026. This is a maintenance baseline, not a fixed article count or a promise about external account settings. Read the current source and [AGENTS.md](../AGENTS.md) before editing. Topic guides are indexed in [README.md](README.md).

## Ownership and deployment

| Component | Repository / responsibility |
| --- | --- |
| Portfolio | [MehdiEslami1221.github.io](https://github.com/MehdiEslami1221/MehdiEslami1221.github.io), `https://mehdieslami.ir/` and `/fa/` |
| Journal | [mehdieslami-blog](https://github.com/MehdiEslami1221/mehdieslami-blog), `https://blog.mehdieslami.ir/` and `/en/` |
| Editorial content | Sanity project `kaaepoyb`, public `production` dataset; configured by the journal repository |
| Comments and reactions | The journal's Cloudflare Worker/D1 service; no private credentials belong in this portfolio |

The portfolio is dependency-free static HTML, CSS and browser JavaScript. Node.js 22 or later runs its build and tests. GitHub Pages serves committed output from `main`; the repository has no custom publishing workflow. The generated **pages build and deployment** run is separate from the journal's **Publish blog** workflow. Keep `CNAME` and `.nojekyll`. Do not replace root-domain DNS records during journal maintenance.

## Source and generated output

| Area | Edit here |
| --- | --- |
| Homepage markup and bilingual text | `index.html`; `app.js` for runtime messages and behavior |
| Overall layout and countdown modes | `style.css` |
| Ordinary code-architecture background | `architecture-scene.mjs`; `app.js` owns canvas/time and shared panel light |
| Dates, calendar export and pure helpers | `core.mjs` |
| Metadata and stable Person/WebSite identities | `seo.mjs` |
| Services | `content/services.mjs`, `scripts/service-pages.mjs`, `services.css` |
| Profile text | `content/profile.mjs`, `profile-core.mjs`, `profile.js`, `profile.css`, `scripts/profile-pages.mjs` |
| Image workbench | `content/image.mjs`, `image-core.mjs`, `image-engine.mjs`, `image.js`, `image.css`, `scripts/image-pages.mjs` |
| Date workbench | `content/date.mjs`, `date-core.mjs`, `date-markup.mjs`, `date-clock.mjs`, `date.js`, `date.css`, `date-discovery.css`, `scripts/date-pages.mjs` |
| Sourced quotes and interval | `content/quotes.mjs`, `quote-rotation.mjs`, `app.js` |
| Journal discovery | `blog-feed.mjs`, `blog.js`, `blog.css` |
| Installed-app launch | `scripts/pwa-shell.mjs`, `pwa.js`, `pwa.css`, `site.webmanifest` |
| Build and local server | `scripts/build.mjs`, `scripts/serve.mjs` |

`index.html` is the English source. Localized leaves use `data-en`/`data-fa`; translated attributes use the corresponding placeholder, aria, alt and href pairs. New attribute kinds must be implemented in both the static builder and runtime localizer. Language switching preserves form/tool state and updates metadata and service links. An explicit URL determines the initial language.

`npm run build` regenerates `fa/index.html`, service/tool pages and sitemap. Do not hand-edit generated routes. The current eighteen indexable routes are two homes, ten service routes and two routes each for profile, image and date tools. Retired playground redirects remain `noindex`. Commit generated changes together with their sources.

## Accepted presentation

The HTML order is introduction/portrait, technology strip, services, work, four recent journal posts, about/skills, résumé, contact, Programmer's Day, quotes, image/profile discovery pair, date discovery, lab and footer. Services stay in website/custom web application/Java Spring Boot/Android order. Use actual source order for keyboard and screen-reader consistency.

Preserve the charcoal/lime ME identity, supplied portrait, IRANSansX typography, genuine project captures and four supplied résumé PDFs. Keep the PDF bytes unchanged. Captures have no filtered image border/shadow; captions sit below them. Keep public anchors and project deep links, including `#services`, `#work`, `#blog`, `#about`, `#resume`, `#contact`, `#day`, `#date-tools` and `#lab`.

### Countdown and celebration

The ordinary card is the dark glass time chip: decorative 256 / 2⁸ processor, four readable time units and an accessible circuit progressbar. `programmerDayState(now)` is the single authority for the visitor-local Gregorian day 256, leap years, DST, the whole celebration day and next occurrence. Its progress spans consecutive local Programmer's Day boundaries, is one during the real holiday and starts the next cycle after it. It does not reset on January 1. Never replace this with a fixed 365-day duration or infer a zone from language.

Ordinary styles belong under `body:not(.celebrating)`. Celebration retains its midnight/cyan/violet/gold palette, banner and original layout; ordinary chip/heading/circuit are hidden. Preview changes appearance only, never the real date, countdown, progress or `.ics` export. Changed digits animate briefly; no extra clock or animation loop is needed. See [COUNTDOWN.md](COUNTDOWN.md).

### Background and panel light

`app.js` owns one `#network` canvas and frame loop. On ordinary days, `architecture-scene.mjs` draws the blueprint grid, component frames, fading code and branching circuit packets. Packet positions join the shared panel-light system. The previous circuit/star/portal drawing remains in the celebration only. Both modes retain the occasional single meteor and small fragments. `panelSelector` registers one `.meteor-reflection` overlay per outer panel, including asynchronously rendered journal cards. A scoped observer handles new cards; do not duplicate overlays or attach them to nested controls.

Use cached viewport rectangles, refreshed at most 10 Hz, and strongest-nearby-source falloff. Nearby panels receive a subtle fill/rim; distant panels stay dark. Retain 24 fps narrow-screen / 30 fps desktop caps, bounded DPR, hidden-tab suspension and OS reduced motion. New panels must join this system rather than add a competing loop. See [SPACE.md](SPACE.md). The journal's quieter CSS binary/editorial scene is independent.

### Quotes, tools and installed launch

The quote card follows the countdown. Eighteen sourced bilingual excerpts rotate in order every ten seconds. One monotonic deadline drives both text and the circular countdown; its continuous ring animation is independent of the 100ms text ticks. Manual next resets it. Hidden tabs resume remaining time; hover/focus do not pause it. Reduced motion keeps text rotation. Do not restore quote or footer animation-stop buttons.

Image, profile, date and lab tools process input locally. Preserve safe text rendering, bounded work, cancellation and language-switch drafts. Image bytes must be owned immediately during selection before provider access is lost; preserve the Android device-file picker and decode fallback. Date conversion distinguishes calculated civil Hijri from official observed dates; no annual occasion database is maintained. The retired playground features remain retired.

The installed-app intro is first ordinary standalone navigation per tab session only, with immediate input dismissal and the independent 1.8-second fallback. There is no service worker/offline guarantee. Never apply an opaque root `html` background or global color-scheme override: it can hide the negative-z canvas. See [LAUNCH.md](LAUNCH.md).

## Journal integration contract

The portfolio reads `https://blog.mehdieslami.ir/latest-posts.json` once per page visit. The journal exports version 1 with `posts.fa` and `posts.en`, at most four metadata entries each. Entry fields are `id`, `title`, `excerpt`, `language`, `url`, `publishedAt`, `readingMinutes`, optional `category` and optional `image` (`url`, `alt`, optional `caption`). Do not rename `image` to `cover` or change version/endpoint without coordinating both repositories.

Published translations replace duplicate cards; otherwise original-language posts stay visible with native direction and typography. Article destinations retain their real language route. Validate public HTTPS destinations and Sanity image hosts; render strings through DOM text properties. Keep loading, empty, retry and native blog-link fallbacks. Never add filler posts, full bodies, Sanity tokens or per-visitor CMS reads. A successful journal deployment refreshes the snapshot without a portfolio rebuild; already-open pages are not continuously polled.

## Edit and release procedure

1. Fetch the current `main`, inspect status and preserve unrelated local changes. Read the affected topic guide before editing.
2. Modify source files; rebuild generated pages when HTML, localized content, metadata or templates change. Advance changed homepage style/app/core URL versions together when their browser cache dependencies change. Documentation-only edits do not require a cache bump or regeneration.
3. Run the checks appropriate to the change:

   ```sh
   npm run build
   npm test
   node --check app.js
   git diff --check
   npm run dev
   ```

4. For UI work, inspect English/Persian at 360px and desktop. Check visible focus, dialogs/Escape, language input preservation, filter/empty states, ordinary/preview restoration, local date/calendar labels, nearby/far lighting and reduced motion. Date changes require six-zone boundary checks; tool changes require real valid/invalid inputs. Never send an inquiry as a test.
5. Review the diff, including generated output and stable metadata/asset paths. Commit to `main` and check **pages build and deployment**. Verify the changed public routes after successful publication. Keep reports limited to checks actually performed.

Tests cover date/time zones, calendar conversion, profile Unicode, image geometry/encoding/import, PWA isolation, quotes, feed validation and SEO across all eighteen routes. Test counts may change; use current command output rather than a fixed count as the acceptance criterion. Markdown-only work needs link/path review and a clean diff, not fabricated browser or runtime test results.

## Operational limits

The inquiry form prepares Telegram/email text; visitors send it in the destination app. Browser demonstrations do not run the projects' backends or store real records. Do not add secret tokens or claim automatic delivery. Local/session storage is convenience state, not an account system.

DNS, certificate issuance, Search Console verification and search rankings are external state. Repository files cannot prove those settings or guarantee indexing. Keep canonical/hreflang, stable `#me` identity, sitemap and honest schema intact. The journal's private moderator password and Cloudflare/Sanity deployment secrets belong to their own service/account settings, never to this repository or public documentation.
