# Maintaining Mehdi Eslami’s portfolio

This is the owner's bilingual portfolio at https://mehdieslami.ir on GitHub Pages. Read README.md first, and read `docs/LAUNCH.md` before changing installation or splash behavior. Preserve the current dark charcoal / lime identity, supplied portrait, circuit background, and both languages unless the owner explicitly changes them. Do not introduce a required server, API key, paid service, third-party analytics or backend for these portfolio features.

## Content and languages

- `index.html` is canonical source; static English is under `/`. Each localized text leaf has `data-en` and `data-fa`. Attribute translations use `data-placeholder-*`, `data-aria-*` and `data-alt-*`.
- Persian must be formal, fluent and natural. Use standard written Persian and respectful plural address (شما / کنید), concise labels such as “درخواست همکاری” and “مشاهدهٔ نمونه‌کارها”, and concrete explanations of the work. Avoid slang, literal translations, vague slogans, inflated claims, ornate prose and repeated marketing formulas. Keep that voice consistent in metadata, service pages, project details, dialogs, tool feedback and form messages. Use the supplied IRANSansX files in Persian and preserve their owner-supplied licensing status.
- Run `npm run build` after changes to HTML, translations or metadata. It creates the static `/fa/` route and the bilingual sitemap. Do not edit `fa/index.html` directly. When adding a new translatable attribute, update both the build script and the runtime localizer.
- Runtime messages and project stories are in `app.js`. Keep English/Persian messages paired. Preserve form and lab input while switching languages; update existing status messages too.
- Preserve public anchors `#work`, `#services`, `#about`, `#contact`, `#day` and `#lab`, and deep links `#project-dearlater`, `#project-didgah`, `#project-warehouse`, `#project-yadban` and `#project-videofetch`.

## Presentation and navigation

The home sequence is introduction/portrait, technology strip, services, work, about/skills, résumé downloads, contact, image-tool/profile-text discovery pair, date tools, lab, Programmer's Day, sourced quotes, footer. Paid development services and the inquiry path take priority; all free tools follow contact. Within services, keep website development, custom web applications, Java/Spring Boot and Android in that order. Within the paired free discovery cards, image tools precede profile text. Keep this order in the actual HTML so keyboard, screen-reader and visual reading order agree; do not simulate it with CSS order. Cards retain repository links and a separate detail button. The last unfiltered card is wide; filtering uses regular cards. Do not nest buttons in anchors.

All five app images are real local interface captures; see `docs/screenshots.md`. Warehouse uses synthetic local records, Yadban mounts the original Dashboard with a read-only sample API, and VideoFetch shows its actual frontend with the backend disconnected. Do not pass concepts or synthetic metrics off as real screenshots, customers or results. Keep genuine source repository links available without JavaScript.

## Browser features and boundaries

- Programmer’s Day is the 256th Gregorian day. `core.mjs` uses native local dates for the visitor’s device zone, including leap years, daylight-saving offsets and the next-year boundary. Keep the date label, visible zone, countdown, celebration boundary and calendar export aligned; do not infer a zone from the interface language, IP or country. The full holiday uses the celebration scene automatically. Manual preview is temporary and must not falsify the countdown. No scheduled automation is needed: this is client-side page behavior.
- All three project demos are explicitly browser-only. DearLater does not send messages or enforce real secrecy; Didgah does not collect research responses; Warehouse does not write real inventory records. Keep negative-stock and quantity checks.
- JSON formatting uses `JSON.parse` / `JSON.stringify`, never `eval`. Render user text with textContent or form values. Text, contrast and JSON tools make no network calls.
- Native dialogs provide focus trapping and Escape. Keep close buttons, visible focus indicators, deep-link restoration and keyboard menu behavior. Do not rely only on hover for an action.
- Footer motion controls affect decorative animation, with a separate quote control. Reduced motion disables effects initially. Pause hidden-tab work and retain bounded canvas nodes, density and frame rate.
- Inquiries only prepare Telegram/email messages. The visitor sends in the destination app; preserve copyable fallback and accurate status. Never put credentials in the site or claim automatic delivery.

## Verify changes

1. Run `npm run build`, `npm test`, `node --check app.js` and `git diff --check` when relevant inputs changed.
2. Preview the actual static routes. Check Persian and English at 360px and 1280px; inspect the portrait, card layout, countdown, lab, quote controls and contact form for overflow and legibility.
3. Check language switching without input loss, project search/filter/empty state, opening/closing project details, a shared deep link, keyboard menu, and motion pause. Exercise altered demos/tools with ordinary and invalid input. Never send a real inquiry as a test.
4. For date changes, test UTC, Tehran, Berlin, Los Angeles, Tokyo and Kiritimati, including different active states at the same instant and summer offsets while the current date is in winter. Also test ordinary/leap years, one second before midnight, the entire holiday and annual rollover. The pure tests do not replace checking the visible celebration preview.
5. Report checks actually performed and any verification limits. Keep CNAME, `.nojekyll`, canonical URLs, JSON-LD, crawler files, font files and asset provenance intact.

## Change boundaries

Keep each change within its requested feature. Installation and splash work must preserve the page layout, copy, background scene, motion controls and existing navigation. Compare the final diff with the last accepted revision; describe verification limits accurately. Repository notes belong in technical documentation, not in visitor-facing copy. Use direct descriptions of behavior and implementation rather than conversation excerpts or production-process commentary.

## Meteors and supplied résumés

- Occasional single meteors complement the default circuit field. Reflections use bounded local CSS overlays on nearby panels; cached rects are refreshed at most 10Hz only during a meteor. Pause, hidden tabs, resize and celebration clear the light; reduced motion disables it. Keep it subtle and preserve the separate day-256 scene.
- `assets/resumes/` contains the four original PDFs supplied by the owner on 2026-11-20. Keep their bytes unchanged. Both routes have direct view/download links without JavaScript. Light/ATS is the résumé style, not a website theme switch. Preserve the `#resume` anchor and quick navigation entry.

## Project card presentation

Screenshot images are edge-to-edge inside each project card, without an image border or shadow. Inversion filters also invert those decorations, producing an unwanted pale halo. Keep capture captions in normal document flow below the image, with inherited Persian typography/direction. At mobile widths, place the detail action and secondary note on separate rows; keep descriptions at 16px and isolate English project headings from the RTL context.

## Bilingual search and service routes

- Read `docs/SEO.md`. `seo.mjs` owns homepage metadata and stable Person/WebSite IDs. Keep the owner's `#me` ID stable across languages and pages. Structured data must describe visible facts; do not invent ratings, customers, prices, office addresses or rich-result eligibility.
- Edit service copy in `content/services.mjs`, the template in `scripts/service-pages.mjs`, and styles in `services.css`. Build commits ten generated service HTML pages plus both homes and the eighteen-URL sitemap. Do not hand-edit generated service outputs. Keep paired routes self-canonical with reciprocal hreflang and x-default. Do not stamp a fake current lastmod date on every build.
- Homepage services links use `data-href-en` / `data-href-fa`; both the static builder and runtime localizer handle them. Homepage language switches update title, description, social metadata, JSON-LD and service hrefs. Keep in-progress tool and form input. At initial load, respect the explicit URL, including English `/`, rather than changing the route from stored preference. Service pages use ordinary native language links and work without JavaScript.
- The navigation services link complements the homepage `#services` section; the lab remains reachable at `#lab` and in the command menu. Preserve the approved homepage background, meteors, real captures, no-halo card styles and original supplied résumés.
- Run `npm run build`, `npm test`, `node --check app.js` and `git diff --check`. `tests/seo.test.mjs` covers all eighteen routes, unique metadata, local links, reciprocal language paths, sitemap coverage and honest schema. Review mobile and desktop service pages, contact links, native details, and homepage language changes in the browser. Search Console verification and search rankings need the owner's real account data; do not imply they have been performed.

## Personal monogram

- The angular ivory/lime ME monogram in `assets/logo.svg` is the owner's personal logo. Use it for homepage/service headers and footers and the envelope demo seal. Preserve the existing dark site identity. Do not restore the old text-based `m.` / `me.` marks.
- `assets/favicon.svg`, `assets/favicon-32.png` and `assets/apple-touch-icon.png` use the same geometry on charcoal. `assets/logo.png` is the transparent raster export. Keep logo proportions and explicit image dimensions; surrounding home links carry localized accessible names, so the duplicate image is decorative. Rebuild all language routes after template changes.

## Installed app launch

- Keep `site.webmanifest` identity (`id` and `start_url` are `/`), charcoal theme/background and separate `any` / safe-zone `maskable` PNG icons. Export those from the existing logo geometry with `scripts/export-app-icons.py`.
- Shared launch head/body come from `scripts/pwa-shell.mjs`; homepage markers are regenerated by the build and service templates use the same functions. Keep `pwa.js` independent from app modules and preserve the early 1.8-second dismissal fallback.
- Show the brief intro only in standalone mode on first ordinary navigation per tab session. Skip reload/history/browser tabs, honor reduced motion and saved motion pause, and let input dismiss immediately. Never add a fake loading percentage, forced delay for external resources, backend or offline claim. Native Android splash composition still requires real-device verification.
- `docs/LAUNCH.md` records the accepted behavior, source map, regression cause and verification requirements. The launch release preserves the appearance of `748db7a`; `d47f179` is the corrected splash reference. Later work should compare against the latest accepted revision rather than discarding subsequent authorized changes.
- Never set a root `html` background or global color-scheme for the splash: an opaque root stops body-background propagation and hides the negative-z-index circuit scene behind the body. Scope launch styling to `.app-launch` and its descendants; leave `app.js`, `style.css` and page content intact during splash-only work. After rebuilding, verify that removing only the launch blocks from all twelve pages recovers the pre-change markup, and inspect the actual animated background in both languages at mobile and desktop widths.

## Profile text and glass panels

- Read `docs/PROFILE_TEXT.md` before changing the generator. `content/profile.mjs` owns localized copy and SEO; `scripts/profile-pages.mjs` generates both profile routes, the homepage feature and retired-route redirects. Keep eighteen indexable routes in the sitemap, including both profile pages. Preserve prior service and homepage metadata.
- The profile generator is the only retained feature from the former playground. Do not restore the skills map, circuit game, project builder, request simulator or light signature without an explicit scope change. Keep their code and entry points removed. Retired `/playground/` routes redirect to the profile tool and remain `noindex`.
- `profile-core.mjs` owns Unicode alphabets, bounded effects, Persian joining, frames, custom mixes and real ASCII. Validate assigned Unicode code points, deduplicate actual outputs and do not advertise an invariant result count for every input. Keep alphabet exceptions for script, italic, Gothic and double-struck letters; naive arithmetic produces unassigned characters.
- Preserve Persian joining and ZWNJ. Tatweel must be inserted only at valid joins. Presentation forms must normalize back to the same base text. Never imitate Persian font variety by breaking words into isolated letters or replacing them with unrelated letters.
- User text is rendered with `textContent` or form values. Favorites persist style IDs only; the language-switch draft is session-scoped and consumed on entry. Preserve name, filters and custom-combination input when switching language. Keep clipboard failure usable, output batches bounded and mobile output contained within cards.
- Glass styling belongs on panels. Preserve the transparent root, existing circuit scene and meteors, real project captures, celebration behavior and launch isolation. Use the profile discovery card in the existing reflection system.


## Image processing workbench

- Read `docs/IMAGE_TOOLS.md`. Edit `content/image.mjs`, `scripts/image-pages.mjs`,
  `image.css`, `image.js`, `image-engine.mjs` and `image-core.mjs`. Rebuild both
  generated image routes and the eighteen-URL sitemap. The image tool is a separate
  authorized feature; the five rejected playground features remain retired.
- Keep all image processing local. Do not introduce uploads, persistent image
  storage, accounts, credentials, external codecs, API keys or a server.
- Inspect container headers before decoding. Reject unsupported/animated images,
  bound input bytes/pixels/batch count, process sequentially, close bitmaps and
  revoke object URLs. Preserve EXIF orientation on input without copying camera
  metadata into newly encoded files. Never execute SVG or user file contents.
- A target is a maximum actual byte size, not an estimate or a guaranteed exact
  size. Honor quality bounds and the explicit dimension-reduction toggle. PNG
  quality is not adjustable; never silently substitute a browser's fallback MIME.
  Show unreachable targets and larger exports honestly. Never claim lossless
  resizing, recovered detail from upscaling or universal competitor superiority.
- Geometry is crop, then quarter-turn rotation, then flips in output coordinates.
  Pointer crop has numeric equivalents. With aspect lock, width and height are a
  bounding box; stretching requires explicitly disabling the lock. Clear stale
  results whenever settings change. Mobile processing/cancel controls stay reachable.
- Language changes preserve files/settings/results in memory and update the page
  metadata. User filenames are textContent; ZIP paths and download names are
  sanitized, UTF-8 and collision-safe. Do not put filenames or file data in URLs,
  localStorage, sessionStorage, HTML strings or structured data.
- Check geometry, target feasibility/cancellation, actual browser MIME and pixels,
  transparency, EXIF orientation, file picker validation, multiple images, ZIP
  extraction, both locales and mobile overflow. Preserve original portraits,
  background code, launch assets and supplied résumés byte-for-byte.

- Image import compatibility: own the selected bytes before clearing the picker;
  retain the owned File for previews, reprocessing and locale switches. Retry an
  image element when createImageBitmap rejects, not only when it is missing.
  Keep fallback object URLs until the decoded source is closed. Queue identifiers
  must not require crypto.randomUUID. Advance the controller and module cache
  versions together for decoding fixes; do not label unrelated import failures
  as damaged images. See `tests/image-decode.test.mjs`.

- For Android providers, start reads for the selected batch inside the change
  event before metadata getters, UI mutation or awaiting another file. Validate
  actual bytes/progress, then decode owned files sequentially. Keep the native
  input enabled while reading. Preserve the separate unfiltered device-file
  picker as well as the image/* picker; both must use the same header checks.


## Homepage tool cards

The profile-text and image-tool discovery sections share `.tools-discovery-grid`
in `index.html`. Keep their existing anchors, copy, links, dark glass styling and
meteor reflections. Place this pair after contact, with image tools before profile text;
keep both cards inside the same grid. `profile.css` lays the pair out in equal desktop columns and
stacks them at 850px and below. Each card uses a single internal column at full
desktop size so its description and preview fit without squeezing. Rebuild the
Persian homepage after edits; do not move this layout onto the standalone tools.

## Date and calendar workbench

Read `docs/DATE_TOOLS.md` before modifying date tools. Preserve `#date-tools`
above `#lab` as a linked discovery card only. Keep input controls and `date.js`
on the internal tool pages; the homepage loads only `date-discovery.css`. Preserve
the scoped dark presentation, both languages and the original
Programmer’s Day behavior. Native calendar conversion and inverse conversion
must share the explicit Persian/Gregorian/civil-Hijri method; do not label
calculated Hijri as official Iran lunar dates. Validate real dates, keep civil
day arithmetic independent of DST and make today’s zone visible. Age uses the
birth calendar and a user-selected leap-birthday policy, including Esfand 30
rolling into the following Persian year. Keep the branded analog clock, matching
digital time and three dark face styles on the internal page. Use the original
`assets/logo.svg` inside the dial. Do not restore occasion lists, official holiday
flags or a year-specific events database; the calculated calendar stays usable
without annual event updates. Preserve the separate Programmer’s Day countdown.
Keep input local, session drafts limited to language navigation, output safe,
clipboard fallbacks usable, calendar exports honest and clock timers paused in
hidden tabs. Rebuild all eighteen routes; run date boundary and SEO checks.
