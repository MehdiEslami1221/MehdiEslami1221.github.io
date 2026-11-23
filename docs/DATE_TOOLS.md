# Date conversion and calendar tools

The homepage `#date-tools` section sits between Programmer’s Day and `#lab`
(ONLINE TOOLS). Keep the original lab, two discovery cards, anchors, circuit
background, meteors, splash, portrait and résumé downloads intact. The complete
workbench also has bilingual static routes at `/tools/date-converter/` and
`/fa/tools/date-converter/`. No server or external runtime dependency is needed.

## Sources

- `date-core.mjs`: integer civil-day conversion, calendar arithmetic, age,
  next birthday, month grid and one-event iCalendar export.
- `date-events.mjs`: selected recurring observances and year-specific 1405
  Iranian holidays, with source URLs.
- `date-markup.mjs`: shared accessible, localized homepage/standalone controls.
- `date.js`, `date.css`: browser interaction and scoped dark glass presentation.
- `content/date.mjs`, `scripts/date-pages.mjs`: paired metadata, static guide,
  shared shell and honest WebApplication schema.
- `scripts/build.mjs`: regenerates the homepage block, both tool routes, Persian
  homepage and eighteen-URL sitemap. Never hand-edit generated output.
- `tests/date.test.mjs`: civil-date anchors, round trips, invalid dates, age,
  leap-day policies, arithmetic, time zones, events, ICS and home placement.

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

## Occasions and maintenance

The selected list is not a complete historical register. Recurring observances
match month/day; the visible notice explains that. Exact Iranian lunar holiday
positions are reviewed against the published final University of Tehran 1405
calendar and stored only for 1405. Red marks Friday or a reviewed 1405 holiday.
Never repeat year-specific dates in another year or claim future completeness.

Sources: `https://calendar.ut.ac.ir/documents/2139738/7092644/Calendar-1405.pdf`
and the published PDF copy at
`https://www.avazehgostar.com/file/pdf/calendar_1405`. When extending holiday
years, review that year’s final published calendar and add separately keyed data.
Keep the UI’s coverage notice accurate. International observance references also
include `https://www.un.org/en/observances/list-days-weeks`.

## Interaction, privacy and checks

Tabs have keyboard arrow/Home/End navigation, selected states and associated
panels. All input-driven output uses textContent or form values. Clipboard
failure exposes selectable text. A session draft is created only for an explicit
language-link navigation on the standalone tool and consumed on entry. Homepage
language changes preserve input in memory. Birth dates are not sent to a server,
put into URLs, structured data or permanent storage. Pause the clock in hidden
tabs and refresh on return/date rollover. Keep ISO strings isolated in RTL text.

Run the repository build and all tests. Check both languages at 360px and 1280px,
Persian digit entry, source-calendar changes, invalid/future dates, leap-day
birthdays, age on a chosen date, interval swap/inclusive count, negative shifts,
month navigation, event-day selection, copying and calendar download. Verify
input survives language changes and the home block precedes ONLINE TOOLS.
Browser-native calendar support can vary; report actual browser/device checks.
No new search ranking, Search Console submission or competitor-superiority claim
follows from adding these pages.
