# Maintaining Mehdi Eslami’s portfolio

This is the owner's bilingual portfolio at https://mehdieslami.ir on GitHub Pages. Read README.md first. Preserve the current dark charcoal / lime identity, supplied portrait, circuit background, and both languages unless the owner explicitly changes them. Do not introduce a required server, API key, paid service, third-party analytics or backend for these portfolio features.

## Content and languages

- `index.html` is canonical source; static English is under `/`. Each localized text leaf has `data-en` and `data-fa`. Attribute translations use `data-placeholder-*`, `data-aria-*` and `data-alt-*`.
- Persian must be formal, fluent and natural, as requested by the owner on 2026-11-21. Use standard written Persian and respectful plural address (شما / کنید), concise labels such as “درخواست همکاری” and “مشاهدهٔ نمونه‌کارها”, and concrete explanations of the work. Avoid slang, literal translations, vague slogans, inflated claims, ornate prose and repeated marketing formulas. Keep that voice consistent in metadata, service pages, project details, dialogs, tool feedback and form messages. Use the supplied IRANSansX files in Persian and preserve their owner-supplied licensing status.
- Run `npm run build` after changes to HTML, translations or metadata. It creates the static `/fa/` route and the bilingual sitemap. Do not edit `fa/index.html` directly. When adding a new translatable attribute, update both the build script and the runtime localizer.
- Runtime messages and project stories are in `app.js`. Keep English/Persian messages paired. Preserve form and lab input while switching languages; update existing status messages too.
- Preserve public anchors `#work`, `#services`, `#about`, `#contact`, `#day` and `#lab`, and deep links `#project-dearlater`, `#project-didgah`, `#project-warehouse`, `#project-yadban` and `#project-videofetch`.

## Presentation and navigation

The home sequence is introduction/portrait, technology strip, work, services, Programmer's Day, lab, about/skills, sourced quotes, résumé downloads, contact, footer. Cards retain repository links and a separate detail button. The last unfiltered card is wide; filtering uses regular cards. Do not nest buttons in anchors.

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

## متن آماده برای دفعهٔ بعد

> می‌خوام سایت شخصی مهدی اسلامی رو به‌روز کنم. درخواست من «[تغییر]» است. اول README.md و AGENTS.md نسخهٔ فعلی رو بخون. ظاهر فعلی، فارسی رسمی و روان و نسخهٔ انگلیسی رو حفظ کن و قابلیت‌ها همچنان بدون سرور روی GitHub Pages اجرا بشن. بعد از تغییر، خروجی فارسی رو دوباره بساز و نمایش موبایل، دسکتاپ و مسیر مرتبط رو بررسی کن. آخرش بگو چی تغییر کرد و چی واقعاً تست شد.

## Meteors and supplied résumés

- Occasional single meteors complement the default circuit field. Reflections use bounded local CSS overlays on nearby panels; cached rects are refreshed at most 10Hz only during a meteor. Pause, hidden tabs, resize and celebration clear the light; reduced motion disables it. Keep it subtle and preserve the separate day-256 scene.
- `assets/resumes/` contains the four original PDFs supplied by the owner on 2026-11-20. Keep their bytes unchanged. Both routes have direct view/download links without JavaScript. Light/ATS is the résumé style, not a website theme switch. Preserve the `#resume` anchor and quick navigation entry.

## Project card presentation

Screenshot images are edge-to-edge inside each project card, without an image border or shadow. Inversion filters also invert those decorations, producing an unwanted pale halo. Keep capture captions in normal document flow below the image, with inherited Persian typography/direction. At mobile widths, place the detail action and secondary note on separate rows; keep descriptions at 16px and isolate English project headings from the RTL context.

## Bilingual search and service routes

- Read `docs/SEO.md`. `seo.mjs` owns homepage metadata and stable Person/WebSite IDs. Keep the owner's `#me` ID stable across languages and pages. Structured data must describe visible facts; do not invent ratings, customers, prices, office addresses or rich-result eligibility.
- Edit service copy in `content/services.mjs`, the template in `scripts/service-pages.mjs`, and styles in `services.css`. Build commits ten generated service HTML pages plus both homes and the twelve-URL sitemap. Do not hand-edit generated service outputs. Keep paired routes self-canonical with reciprocal hreflang and x-default. Do not stamp a fake current lastmod date on every build.
- Homepage services links use `data-href-en` / `data-href-fa`; both the static builder and runtime localizer handle them. Homepage language switches update title, description, social metadata, JSON-LD and service hrefs. Keep in-progress tool and form input. At initial load, respect the explicit URL, including English `/`, rather than changing the route from stored preference. Service pages use ordinary native language links and work without JavaScript.
- The navigation services link complements the homepage `#services` section; the lab remains reachable at `#lab` and in the command menu. Preserve the approved homepage background, meteors, real captures, no-halo card styles and original supplied résumés.
- Run `npm run build`, `npm test`, `node --check app.js` and `git diff --check`. `tests/seo.test.mjs` covers all twelve routes, unique metadata, local links, reciprocal language paths, sitemap coverage and honest schema. Review mobile and desktop service pages, contact links, native details, and homepage language changes in the browser. Search Console verification and search rankings need the owner's real account data; do not imply they have been performed.

## Personal monogram

- The angular ivory/lime ME monogram in `assets/logo.svg` is the owner's personal logo. Use it for homepage/service headers and footers and the envelope demo seal. Preserve the existing dark site identity. Do not restore the old text-based `m.` / `me.` marks.
- `assets/favicon.svg`, `assets/favicon-32.png` and `assets/apple-touch-icon.png` use the same geometry on charcoal. `assets/logo.png` is the transparent raster export. Keep logo proportions and explicit image dimensions; surrounding home links carry localized accessible names, so the duplicate image is decorative. Rebuild all language routes after template changes.
