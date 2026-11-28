# Programmer’s Day time chip

The ordinary `#day` card uses the portfolio’s charcoal/lime glass identity. A small decorative processor marked 256 / 2⁸ sits beside the heading on desktop and above it on mobile. Four tabular-number cells show days, hours, minutes and seconds. The existing device-zone/date/source/calendar actions remain available. Text uses the established bilingual labels and supplied Persian typography.

## Modes and source

Edit `index.html`, `style.css`, `app.js` and the pure date engine in `core.mjs`. Build generates `fa/index.html`; never edit that route directly. Ordinary styles are scoped to `body:not(.celebrating)`. The normal title, processor and circuit are hidden in celebration mode; its original heading, banner, palette and grid remain. The shared wrapper uses `display: contents` in that mode to preserve the existing layout.

`programmerDayState(now)` still owns the local Gregorian day-256 target, full holiday, leap years and next occurrence. Its new `progress` field is the clamped elapsed fraction from the previous local Programmer’s Day to the target. During the actual holiday it is one. Once that holiday ends, the next annual cycle begins; January 1 does not reset it. No fixed 365-day millisecond constant or interface-based zone is used.

The circuit is a real progressbar with localized percentage and accessible value text. Its fill comes from `state.progress`. A separate small decorative packet travels on the rail; it is not the progress value. The circuit starts hidden until the existing day clock supplies a valid value. Preview changes only appearance: it cannot change target, time units, progress or calendar export.

## Motion and reflected light

The chip pins and small circuit packet use CSS stroke-dashoffset animation. Changed digits alone receive a short 180ms opacity/translation animation in ordinary mode. Keep OS reduced motion and hidden-tab suspension; the timer still updates real values when resumed. Do not add a clock or requestAnimationFrame loop for this card. The existing `.day-card` registration supplies one `.meteor-reflection` overlay; keep it above the decorative surfaces and noninteractive.

## Validation

Run `npm run build`, `npm test`, `node --check app.js` and `git diff --check`. Date tests cover six device zones, leap/DST boundaries, the full holiday, annual rollover, the cycle midpoint and no January 1 reset. Inspect ordinary/preview in both languages at desktop and 360px; check readable units, progress values, preview restoration and calendar labels. Keep all other homepage sections, tools, background, launch files, logo and supplied résumé bytes intact.
