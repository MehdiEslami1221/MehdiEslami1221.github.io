# Date conversion and calendar tools

The homepage `#date-tools` section is a single linked discovery card in the
free-tools area after contact, between the image/profile pair and `#lab`
(ONLINE TOOLS). It contains no input controls or
running date controller. Clicking it opens the localized internal tool page. Keep the original lab, two discovery cards, anchors, circuit
background, meteors, splash, portrait and résumé downloads intact. The complete
workbench lives exclusively at the bilingual static routes at `/tools/date-converter/` and
`/fa/tools/date-converter/`. No server or external runtime dependency is needed.

## Sources

- `date-core.mjs`: integer civil-day conversion, calendar arithmetic, age,
  next birthday, month grid and one-event iCalendar export.
- `date-clock.mjs`: zoned clock parts and continuous SVG hand angles.
- `date-markup.mjs`: localized discovery card and separate accessible standalone controls.
- `date.js`, `date.css`: internal workbench interaction and dark presentation.
- `date-discovery.css`: lightweight homepage card styling; do not load the
  workbench script or stylesheet on the homepage.
- `content/date.mjs`, `scripts/date-pages.mjs`: paired metadata, static guide,
  shared shell and honest WebApplication schema.
- `scripts/build.mjs`: regenerates the homepage block, both tool routes, Persian
  homepage and eighteen-URL sitemap. Never hand-edit generated output.
- `tests/date.test.mjs`: civil-date anchors, round trips, invalid dates, age,
  leap-day policies, arithmetic, time zones, clock angles, ICS and home placement.

## Calculation contract

Gregorian years 1600–2199 are the supported input range. Explicit native Intl
calendars are `persian`, `gregory` and `islamic-civil`; reject silent calendar
fallbacks. Inverse conversion searches those same calendar parts, so conversion
and display share one method. Validate real dates rather than normalizing an
invalid February 29 or Esfand 30. Accept Latin, Persian and Arabic digits.

The Hijri result is a calculated civil calendar, not the official Iranian lunar
calendar. Keep this label and the visible explanation of possible differences
from moon-sighting calendars. Do not derive official religious holidays from
this arithmetic calendar.

Civil dates are integer UTC day numbers, independent of daylight saving. Only
“today” and the clock depend on the visibly selected zone: Tehran by default,
the device zone, or UTC. This is separate from the existing Programmer’s Day
feature, which continues to use the visitor’s device zone. No geolocation is used.

Age counts completed years/months in the birth calendar, with remaining civil
days anchored from the original birth date. Months stay between zero and eleven.
The user can calculate up to today or a chosen reference date. Reject a future
birth relative to that reference. A missing leap birthday follows the selected
last-day or first-next-month policy. Esfand 30 can roll across a Persian year
boundary; keep that case covered. Total days and full weeks are civil-date
counts; do not invent a birth time or show false hour/second precision.

Month/year shifts clamp a missing day to the last day of the destination month,
as described beside the controls. Date intervals show absolute day distance and
state when the end precedes the start. The optional inclusive count adds the end
day only to the day/week total, not to the calendar-unit breakdown.

Birthday export is one all-day event for the displayed next birthday, with an
exclusive next-day end. Do not claim notifications, recurring scheduling or an
external calendar write. Imported files are handled by the visitor’s calendar.

## Branded analog clock and maintenance

The internal page has a live SVG analog clock, matching digital time and a
visible IANA zone. Reuse the original `/assets/logo.svg` as an SVG image inside
the face, never replace the monogram with text or a generated approximation.
The signature, classic and minimal styles stay dark. Only the selected style ID
is stored in localStorage; dates remain session-scoped for locale navigation.

`date-clock.mjs` derives hand angles from the selected zone at the same instant.
Hours include minute/second fractions; minutes include seconds. Do not animate
backwards through a full turn at 59→00. The clock follows device time, not an
external atomic clock. Clock zones include Tehran, device, UTC and several
explicit city choices. The selected zone also determines today and age-to-today.

Hand rendering is bounded to 20fps, stops when offscreen or hidden, and uses
second snapshots with reduced motion. Digital display updates once per second.
Recalculate from the current instant on resume; do not accumulate timer drift.

Occasion lists, official-holiday flags and their year-specific database were
removed. Do not restore annual holiday data or year-limited coverage notices.
The monthly calendar remains purely calculated, with today outlined and each
day selectable for conversion; it needs no yearly event updates. The original
homepage Programmer’s Day countdown is a separate feature and remains intact.

## Interaction, privacy and checks

Tabs have keyboard arrow/Home/End navigation, selected states and associated
panels. All input-driven output uses textContent or form values. Clipboard
failure exposes selectable text. A session draft is created only for an explicit
language-link navigation on the standalone tool and consumed on entry. Homepage
language changes update the card text and destination link. Birth dates are not sent to a server,
put into URLs, structured data or permanent storage. Pause the clock in hidden
tabs and refresh on return/date rollover. Keep ISO strings isolated in RTL text.

Run the repository build and all tests. Check both languages at 360px and 1280px,
Persian digit entry, source-calendar changes, invalid/future dates, leap-day
birthdays, age on a chosen date, interval swap/inclusive count, negative shifts,
month navigation, date selection, copying, clock styles, zones and calendar download. Verify
input survives language changes and the home block precedes ONLINE TOOLS.
Browser-native calendar support can vary; report actual browser/device checks.
No new search ranking, Search Console submission or competitor-superiority claim
follows from adding these pages.
