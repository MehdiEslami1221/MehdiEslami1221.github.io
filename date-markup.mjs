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
export function analogClock() {
  const ticks = Array.from(
    { length: 60 },
    (_, i) =>
      `<line class="dt-tick ${i % 5 === 0 ? "dt-major-tick" : "dt-minor-tick"} ${i % 15 === 0 ? "dt-cardinal-tick" : ""}" x1="150" y1="${i % 15 === 0 ? 19 : i % 5 === 0 ? 20 : 22}" x2="150" y2="${i % 15 === 0 ? 32 : i % 5 === 0 ? 29 : 27}" transform="rotate(${i * 6} 150 150)"/>`,
  ).join("");
  const numerals = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1,
      a = (n * Math.PI) / 6;
    return `<text class="dt-clock-number" x="${(150 + Math.sin(a) * 105).toFixed(2)}" y="${(150 - Math.cos(a) * 105).toFixed(2)}">${n}</text>`;
  }).join("");
  return `<div class="dt-analog" id="dt-analog" data-clock-style="signature" aria-hidden="true"><svg viewBox="0 0 300 300" class="dt-clock-face"><circle class="dt-clock-ring" cx="150" cy="150" r="146"/><circle class="dt-clock-inner" cx="150" cy="150" r="141"/>${ticks}${numerals}<image href="/assets/logo.svg" x="125" y="73" width="50" height="37"/><g id="dt-hour-hand" class="dt-hour-hand"><line x1="150" y1="157" x2="150" y2="83"/></g><g id="dt-minute-hand" class="dt-minute-hand"><line x1="150" y1="160" x2="150" y2="51"/></g><g id="dt-second-hand" class="dt-second-hand"><line x1="150" y1="169" x2="150" y2="37"/></g><circle class="dt-clock-pivot" cx="150" cy="150" r="5"/></svg></div>`;
}
function clockPanel(lang, s) {
  const choices = [
    ["Asia/Tehran", "Tehran", "تهران"],
    ["device", "My device", "دستگاه من"],
    ["UTC", "UTC", "UTC"],
    ["Europe/London", "London", "لندن"],
    ["Europe/Berlin", "Berlin", "برلین"],
    ["America/New_York", "New York", "نیویورک"],
    ["Asia/Dubai", "Dubai", "دبی"],
    ["Asia/Tokyo", "Tokyo", "توکیو"],
  ];
  const styles = [
    ["signature", "Signature", "سبز"],
    ["classic", "Classic", "کلاسیک"],
    ["minimal", "Minimal", "ساده"],
  ];
  return `<section class="dt-clock-panel" aria-labelledby="dt-clock-heading">${analogClock()}<div class="dt-clock-info"><p class="dt-clock-eyebrow">${s("LOCAL TIME", "زمان در منطقهٔ انتخابی")}</p><h2 id="dt-clock-heading">${s("Analog clock", "ساعت آنالوگ")}</h2><time id="dt-clock" dir="ltr" aria-live="off">—:—:—</time><p id="dt-today-label" class="dt-clock-date"></p><p id="dt-clock-zone" class="dt-clock-zone" dir="ltr"></p><label class="dt-zone-label" for="dt-zone">${s("Time zone", "منطقهٔ زمانی")}<select id="dt-zone">${choices.map(([value, en, fa]) => `<option value="${value}" data-en="${en}" data-fa="${fa}">${lang === "fa" ? fa : en}</option>`).join("")}</select></label><div class="dt-clock-styles" role="group" aria-label="${lang === "fa" ? "ظاهر ساعت" : "Clock appearance"}">${styles.map(([id, en, fa], i) => `<button type="button" class="dt-clock-style" data-clock-style="${id}" aria-pressed="${i === 0}"><svg viewBox="0 0 44 44" width="44" height="44" fill="none" aria-hidden="true"><circle cx="22" cy="22" r="18"/><path d="M22 6v3m16 13h-3M22 38v-3M6 22h3M22 22l-8-6m8 6 11-7"/><path class="dt-mini-second" d="M22 22v12"/></svg>${s(en, fa)}</button>`).join("")}</div></div></section>`;
}
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
${clockPanel(lang, s)}
<div class="dt-tabs" role="tablist" aria-label="${lang === "fa" ? "ابزارهای تاریخ" : "Date tools"}" data-aria-en="Date tools" data-aria-fa="ابزارهای تاریخ">${[
    ["convert", "Convert", "تبدیل تاریخ", "calendar"],
    ["age", "Age & birthday", "سن و تولد", "cake"],
    ["distance", "Date difference", "فاصلهٔ دو تاریخ", "distance"],
    ["shift", "Add / subtract", "جمع و تفریق تاریخ", "shift"],
    ["calendar", "Monthly calendar", "تقویم ماهانه", "calendar"],
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
<section id="dt-panel-calendar" class="dt-panel" role="tabpanel" aria-labelledby="dt-tab-calendar" hidden><div class="dt-calendar-toolbar"><div><label for="dt-view-calendar">${s("Calendar", "تقویم")}</label><select id="dt-view-calendar">${options()}</select></div><div><label for="dt-view-year">${s("Year", "سال")}</label><input id="dt-view-year" type="text" inputmode="numeric" maxlength="4"></div><div><label for="dt-view-month">${s("Month", "ماه")}</label><select id="dt-view-month"></select></div><button type="button" class="dt-small-button" id="dt-month-go">${s("Show", "نمایش")}</button></div><div class="dt-calendar-layout"><div><div class="dt-month-heading"><button type="button" id="dt-prev-month" class="dt-small-button">${s("Previous", "ماه قبل")}</button><h3 id="dt-month-title"></h3><button type="button" id="dt-next-month" class="dt-small-button">${s("Next", "ماه بعد")}</button></div><div class="dt-month-grid" id="dt-month-grid"></div><p class="dt-note">${s("Select a day to convert it. The outlined day is today.", "برای تبدیل تاریخ، روز موردنظر را انتخاب کنید. روز جاری با کادر مشخص شده است.")}</p></div></div><p class="dt-feedback" id="dt-calendar-status" role="status"></p></section>
<details class="dt-method"><summary>${s("Calculation method", "روش محاسبه")}</summary><p>${s("Dates are calculated with the browser’s Persian, Gregorian and civil Hijri calendars. Civil Hijri is arithmetic and can differ from the official Iranian lunar calendar or moon sightings. Age uses the birth calendar; total days use civil dates, not elapsed 24-hour blocks. No birth time is assumed.", "تبدیل‌ها با تقویم شمسی، میلادی و قمریِ مدنی مرورگر انجام می‌شوند. قمری مدنی محاسباتی است و ممکن است با تقویم رسمی ایران یا رؤیت هلال تفاوت داشته باشد. سن بر اساس تقویم تولد محاسبه می‌شود؛ مجموع روزها بر پایهٔ تاریخ مدنی است، نه بازه‌های ۲۴ساعته. ساعت تولد فرض نمی‌شود.")}</p><p>${s("Birthday files add a single all-day event when imported into your calendar app.", "نمایش سن صرفاً محاسبهٔ تاریخ است. فایل تولد، یک رویداد تمام‌روز برای ورود به برنامهٔ تقویم ایجاد می‌کند.")}</p></details><p id="dt-clipboard-status" class="dt-feedback" role="status"></p><textarea id="dt-copy-fallback" class="dt-copy-fallback" readonly hidden aria-label="${lang === "fa" ? "متن برای کپی دستی" : "Text for manual copying"}"></textarea>
</fieldset></div>`;
}
export function homeDateSection() {
  const s = (en, fa) => `<span data-en="${en}" data-fa="${fa}">${en}</span>`;
  return `<section class="section wrap date-section" id="date-tools" aria-labelledby="date-tools-heading">
<a class="profile-discovery date-discovery" href="/tools/date-converter/" data-href-en="/tools/date-converter/" data-href-fa="/fa/tools/date-converter/">
<div><p class="eyebrow">${s("DATE & CALENDAR", "تاریخ و تقویم")}</p><h2 id="date-tools-heading">${s("Date converter & age calculator", "تبدیل تاریخ و محاسبهٔ سن")}</h2><p>${s("Convert Persian, Gregorian and calculated Hijri dates, calculate your age and next birthday, or check the time and browse the monthly calendar.", "تاریخ شمسی، میلادی و قمری محاسباتی را تبدیل کنید، سن و زمان باقی‌مانده تا تولد بعدی را ببینید یا ساعت و تقویم ماهانه را ببینید.")}</p><span class="profile-open">${s("Open date tools", "ورود به ابزار تاریخ")} <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></span></div>
<div class="date-discovery-art" aria-hidden="true"><div class="date-discovery-symbol">${dateIcon("calendar")}</div><div class="date-discovery-calendars">${s("Persian", "شمسی")}<span>↔</span>${s("Gregorian", "میلادی")}<span>↔</span>${s("Hijri", "قمری")}</div><div class="date-discovery-features"><span>${dateIcon("cake")}${s("Age & birthday", "سن و تولد")}</span><span>${dateIcon("distance")}${s("Date difference", "فاصلهٔ تاریخ‌ها")}</span></div></div>
</a></section>`;
}
