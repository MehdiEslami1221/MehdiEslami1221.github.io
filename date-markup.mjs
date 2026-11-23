// Static, bilingual UI shared by the homepage and the dedicated tool pages.
const paths = {
  calendar:
    "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Zm3 10h2m4 0h2m-8 4h2",
  cake: "M4 13h16v8H4Zm-1 4c3 3 3-3 6 0s3-3 6 0 3-3 6 0M8 13V9h8v4M12 9V5m0-3c-3 3 3 3 0 0",
  distance: "M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4",
  shift: "M12 4v16m-5-5 5 5 5-5M4 4h16",
  clock: "M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  copy: "M8 8h12v13H8ZM4 16H2V2h12v2",
  download: "M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4",
  check: "m5 12 4 4L20 5",
};
export const dateIcon = (name) =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(
    paths[name] || paths.calendar
  )
    .split("~")
    .map((d) => `<path d="${d}"/>`)
    .join("")}</svg>`;
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
export function renderDateWorkbench(lang = "en") {
  const s = (en, fa) =>
    `<span data-en="${esc(en)}" data-fa="${esc(fa)}">${esc(lang === "fa" ? fa : en)}</span>`;
  const options = () =>
    [
      ["persian", "Persian (Solar Hijri)", "شمسی"],
      ["gregory", "Gregorian", "میلادی"],
      ["islamic-civil", "Hijri (calculated)", "قمری محاسباتی"],
    ]
      .map(
        ([value, en, fa]) =>
          `<option value="${value}" data-en="${en}" data-fa="${fa}">${lang === "fa" ? fa : en}</option>`,
      )
      .join("");
  const dateInput = (id, en, fa) =>
    `<fieldset class="dt-date-input" data-date-group="${id}"><legend>${s(en, fa)}</legend><div class="dt-date-fields"><div><label for="dt-${id}-calendar">${s("Calendar", "تقویم")}</label><select id="dt-${id}-calendar">${options()}</select></div><div><label for="dt-${id}-year">${s("Year", "سال")}</label><input id="dt-${id}-year" type="text" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="1405" aria-describedby="dt-range-note"></div><div><label for="dt-${id}-month">${s("Month", "ماه")}</label><select id="dt-${id}-month"></select></div><div><label for="dt-${id}-day">${s("Day", "روز")}</label><input id="dt-${id}-day" type="text" inputmode="numeric" maxlength="2" autocomplete="off" placeholder="1"></div></div></fieldset>`;
  const btn = (id, en, fa, icon = "calendar", className = "secondary") =>
    `<button type="button" class="button ${className}" id="dt-${id}">${dateIcon(icon)}${s(en, fa)}</button>`;
  return `<div class="date-workbench" data-date-tools><fieldset class="dt-pending" disabled>
<div class="dt-topbar"><div class="dt-clock">${dateIcon("clock")}<time id="dt-clock" dir="ltr" aria-live="off">—:—</time><span id="dt-today-label"></span></div><label class="dt-zone-label" for="dt-zone">${s("Today’s time zone", "منطقهٔ زمانی امروز")}<select id="dt-zone"><option value="Asia/Tehran" data-en="Tehran" data-fa="تهران">${lang === "fa" ? "تهران" : "Tehran"}</option><option value="device" data-en="My device" data-fa="دستگاه من">${lang === "fa" ? "دستگاه من" : "My device"}</option><option value="UTC">UTC</option></select></label></div>
<div class="dt-tabs" role="tablist" aria-label="${lang === "fa" ? "ابزارهای تاریخ" : "Date tools"}" data-aria-en="Date tools" data-aria-fa="ابزارهای تاریخ">${[
    ["convert", "Convert", "تبدیل تاریخ", "calendar"],
    ["age", "Age & birthday", "سن و تولد", "cake"],
    ["distance", "Date difference", "فاصلهٔ دو تاریخ", "distance"],
    ["shift", "Add / subtract", "جمع و تفریق تاریخ", "shift"],
    ["calendar", "Monthly calendar", "تقویم و مناسبت‌ها", "calendar"],
  ]
    .map(
      ([id, en, fa, icon], i) =>
        `<button type="button" role="tab" id="dt-tab-${id}" aria-selected="${i === 0}" aria-controls="dt-panel-${id}" tabindex="${i === 0 ? 0 : -1}" data-date-tab="${id}">${dateIcon(icon)}${s(en, fa)}</button>`,
    )
    .join("")}</div>
<p id="dt-range-note" class="dt-note">${s("Supported dates: Gregorian years 1600–2199. Persian and Arabic digits are accepted.", "بازهٔ پشتیبانی: سال‌های میلادی ۱۶۰۰ تا ۲۱۹۹؛ اعداد فارسی و عربی هم پذیرفته می‌شوند.")}</p>
<section id="dt-panel-convert" class="dt-panel" role="tabpanel" aria-labelledby="dt-tab-convert">
<div class="dt-converter"><div class="dt-input-side">${dateInput("convert", "Date to convert", "تاریخ موردنظر")}<div class="dt-paste"><label for="dt-paste">${s("Or paste year/month/day", "یا تاریخ را به شکل سال/ماه/روز وارد کنید")}</label><div><input type="text" id="dt-paste" dir="ltr" inputmode="text" placeholder="1405/09/02" autocomplete="off"><button type="button" class="dt-small-button" id="dt-read-paste">${s("Use date", "ثبت تاریخ")}</button></div></div><div class="dt-actions">${btn("convert", "Convert date", "تبدیل تاریخ", "calendar", "primary")}${btn("today", "Today", "امروز", "clock")}</div><p class="dt-feedback" id="dt-convert-status" role="status"></p></div>
<div class="dt-result-side"><div class="dt-date-results" id="dt-conversions"><p class="dt-empty">${s("Choose a date to see all three calendars.", "تاریخ را انتخاب کنید تا هر سه تقویم نمایش داده شوند.")}</p></div><div id="dt-date-facts" class="dt-date-facts"></div><div class="dt-actions">${btn("copy-date", "Copy dates", "کپی تاریخ‌ها", "copy")}${btn("use-birthday", "Calculate age for this date", "محاسبهٔ سن برای این تاریخ", "cake")}</div></div></div>
</section>
<section id="dt-panel-age" class="dt-panel" role="tabpanel" aria-labelledby="dt-tab-age" hidden><div class="dt-converter"><div class="dt-input-side">${dateInput("birth", "Date of birth", "تاریخ تولد")}<label class="dt-check"><input type="checkbox" id="dt-asof-today" checked>${s("Calculate up to today", "محاسبه تا امروز")}</label><div id="dt-asof-wrap" hidden>${dateInput("asof", "Calculate age on", "محاسبهٔ سن در تاریخ")}</div><label for="dt-birthday-policy">${s("Birthday in a year without that day", "تولد در سالی که آن روز را ندارد")}</label><select id="dt-birthday-policy"><option value="last" data-en="Last day of the month" data-fa="آخرین روز ماه">${lang === "fa" ? "آخرین روز ماه" : "Last day of the month"}</option><option value="next" data-en="First day of the next month" data-fa="اول ماه بعد">${lang === "fa" ? "اول ماه بعد" : "First day of the next month"}</option></select><p class="dt-note">${s("For leap-day birthdays, such as 30 Esfand or 29 February.", "برای تولدهایی مثل ۳۰ اسفند یا ۲۹ فوریه در سال غیرکبیسه.")}</p><div class="dt-actions">${btn("age", "Calculate age", "محاسبهٔ سن", "cake", "primary")}</div><p class="dt-feedback" id="dt-age-status" role="status"></p></div><div class="dt-result-side"><div id="dt-age-result" class="dt-age-result"><p class="dt-empty">${s("Enter a birth date to see the result.", "تاریخ تولد را وارد کنید تا نتیجه نمایش داده شود.")}</p></div><div class="dt-actions">${btn("copy-age", "Copy result", "کپی نتیجه", "copy")}${btn("birthday-ics", "Save birthday to calendar", "دریافت فایل تقویم تولد", "download")}</div></div></div></section>
<section id="dt-panel-distance" class="dt-panel" role="tabpanel" aria-labelledby="dt-tab-distance" hidden><div class="dt-two-inputs">${dateInput("start", "Start date", "تاریخ شروع")}${dateInput("end", "End date", "تاریخ پایان")}</div><label class="dt-check"><input type="checkbox" id="dt-inclusive">${s("Include the end date in the day count", "احتساب روز پایان در شمارش روزها")}</label><div class="dt-actions">${btn("distance", "Calculate difference", "محاسبهٔ فاصله", "distance", "primary")}${btn("swap", "Swap dates", "جابه‌جایی تاریخ‌ها", "distance")}</div><p class="dt-feedback" id="dt-distance-status" role="status"></p><div id="dt-distance-result" class="dt-distance-result"></div></section>
<section id="dt-panel-shift" class="dt-panel" role="tabpanel" aria-labelledby="dt-tab-shift" hidden><div class="dt-converter"><div class="dt-input-side">${dateInput("base", "Starting date", "تاریخ مبنا")}<div class="dt-shift-fields"><div><label for="dt-shift-number">${s("Amount (negative to subtract)", "مقدار (برای تفریق، عدد منفی)")}</label><input id="dt-shift-number" type="text" inputmode="numeric" value="30" maxlength="7" dir="ltr"></div><div><label for="dt-shift-unit">${s("Unit", "واحد")}</label><select id="dt-shift-unit">${[
    ["days", "Days", "روز"],
    ["weeks", "Weeks", "هفته"],
    ["months", "Calendar months", "ماه تقویمی"],
    ["years", "Calendar years", "سال تقویمی"],
  ]
    .map(
      ([v, en, fa]) =>
        `<option value="${v}" data-en="${en}" data-fa="${fa}">${lang === "fa" ? fa : en}</option>`,
    )
    .join(
      "",
    )}</select></div></div><p class="dt-note">${s("For month or year shifts, a missing day becomes the last day of that month.", "در جابه‌جایی ماه یا سال، اگر روز موردنظر وجود نداشته باشد، آخرین روز آن ماه در نظر گرفته می‌شود.")}</p>${btn("shift", "Calculate new date", "محاسبهٔ تاریخ جدید", "shift", "primary")}<p class="dt-feedback" id="dt-shift-status" role="status"></p></div><div class="dt-result-side" id="dt-shift-result"></div></div></section>
<section id="dt-panel-calendar" class="dt-panel" role="tabpanel" aria-labelledby="dt-tab-calendar" hidden><div class="dt-calendar-toolbar"><div><label for="dt-view-calendar">${s("Calendar", "تقویم")}</label><select id="dt-view-calendar">${options()}</select></div><div><label for="dt-view-year">${s("Year", "سال")}</label><input id="dt-view-year" type="text" inputmode="numeric" maxlength="4"></div><div><label for="dt-view-month">${s("Month", "ماه")}</label><select id="dt-view-month"></select></div><button type="button" class="dt-small-button" id="dt-month-go">${s("Show", "نمایش")}</button></div><div class="dt-calendar-layout"><div><div class="dt-month-heading"><button type="button" id="dt-prev-month" class="dt-small-button">${s("Previous", "ماه قبل")}</button><h3 id="dt-month-title"></h3><button type="button" id="dt-next-month" class="dt-small-button">${s("Next", "ماه بعد")}</button></div><div class="dt-month-grid" id="dt-month-grid"></div><p class="dt-note">${s("Select a day to convert it. Red marks verified 1405 holidays or Friday; a dot marks an occasion.", "برای تبدیل، روز را انتخاب کنید. قرمز نشان‌دهندهٔ جمعه یا تعطیلی تأییدشدهٔ ۱۴۰۵ است؛ نقطه یعنی مناسبت.")}</p></div><div class="dt-month-events"><h3>${s("Selected occasions this month", "مناسبت‌های منتخب این ماه")}</h3><div id="dt-month-events"></div></div></div><p class="dt-feedback" id="dt-calendar-status" role="status"></p></section>
<div class="dt-occasions"><div><h3>${dateIcon("calendar")}${s("Selected date’s occasions", "مناسبت‌های منتخب این روز")}</h3><p id="dt-event-date" class="dt-note"></p></div><div id="dt-events" class="dt-events"></div><p class="dt-note">${s("Selected Iranian and international occasions. Dated Iranian holidays are verified for 1405 only; other years do not have a complete holiday list.", "گزیده‌ای از مناسبت‌های ایران و جهان؛ تعطیلات تاریخ‌دار ایران فقط برای ۱۴۰۵ بررسی شده‌اند. فهرست تعطیلات سال‌های دیگر کامل نیست.")}</p></div>
<details class="dt-method"><summary>${s("Calculation method and sources", "روش محاسبه و منابع")}</summary><p>${s("Fixed occasions are matched by month and day, not a historical yearly register. Dates are calculated with the browser’s Persian, Gregorian and civil Hijri calendars. Civil Hijri is arithmetic and can differ from the official Iranian lunar calendar or moon sightings. Age uses the birth calendar; total days use civil dates, not elapsed 24-hour blocks. No birth time is assumed.", "مناسبت‌های ثابت بر پایهٔ روز و ماه‌اند، نه فهرست تاریخی همان سال. تبدیل‌ها با تقویم شمسی، میلادی و قمریِ مدنی مرورگر انجام می‌شوند. قمری مدنی محاسباتی است و ممکن است با تقویم رسمی ایران یا رؤیت هلال تفاوت داشته باشد. سن بر اساس تقویم تولد محاسبه می‌شود؛ مجموع روزها بر پایهٔ تاریخ مدنی است، نه بازه‌های ۲۴ساعته. ساعت تولد فرض نمی‌شود.")}</p><p>${s("Birthday files add a single all-day event when imported into your calendar app.", "نمایش سن صرفاً محاسبهٔ تاریخ است. فایل تولد، یک رویداد تمام‌روز برای ورود به برنامهٔ تقویم ایجاد می‌کند.")}</p><p><a href="https://calendar.ut.ac.ir/documents/2139738/7092644/Calendar-1405.pdf" target="_blank" rel="noopener">${s("1405 calendar · University of Tehran", "تقویم ۱۴۰۵ · مرکز تقویم دانشگاه تهران")}</a> · <a href="https://www.avazehgostar.com/file/pdf/calendar_1405" target="_blank" rel="noopener">${s("Published PDF copy", "نسخهٔ منتشرشدهٔ PDF")}</a></p></details><p id="dt-clipboard-status" class="dt-feedback" role="status"></p><textarea id="dt-copy-fallback" class="dt-copy-fallback" readonly hidden aria-label="${lang === "fa" ? "متن برای کپی دستی" : "Text for manual copying"}"></textarea>
</fieldset></div>`;
}
export function homeDateSection() {
  return `<section class="section wrap date-section" id="date-tools" aria-labelledby="date-tools-heading"><div class="section-heading"><div><p class="eyebrow"><span data-en="DATE & CALENDAR" data-fa="تاریخ و تقویم">DATE & CALENDAR</span></p><h2 id="date-tools-heading"><span data-en="Convert dates. Count the days." data-fa="تبدیل تاریخ و محاسبهٔ سن">Convert dates. Count the days.</span></h2></div><a class="text-link" href="/tools/date-converter/" data-href-en="/tools/date-converter/" data-href-fa="/fa/tools/date-converter/"><span data-en="Open date tools" data-fa="صفحهٔ ابزار تاریخ">Open date tools</span></a></div><p class="date-intro"><span data-en="Persian, Gregorian and calculated Hijri dates, age, next birthday and a monthly calendar—all in one place." data-fa="تاریخ شمسی، میلادی و قمری محاسباتی، سن، تولد بعدی و تقویم ماهانه؛ همه در یک بخش.">Persian, Gregorian and calculated Hijri dates, age, next birthday and a monthly calendar—all in one place.</span></p>${renderDateWorkbench("en")}<noscript><p><span data-en="Enable JavaScript to use the date tools." data-fa="برای استفاده از ابزار تاریخ، JavaScript مرورگر را فعال کنید.">Enable JavaScript to use the date tools.</span></p></noscript></section>`;
}
