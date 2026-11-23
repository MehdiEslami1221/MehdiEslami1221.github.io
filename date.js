import {
  CALENDARS,
  parts,
  toDay,
  todayDay,
  formatDay,
  isoDate,
  integer,
  parseDateText,
  monthLength,
  yearLength,
  isLeap,
  weekday,
  age,
  difference,
  shiftDays,
  addMonths,
  monthGrid,
  calendarFile,
  solarSigns,
  MIN_DAY,
  MAX_DAY,
} from "./date-core.mjs?v=20261123-date1";
const root = document.querySelector("[data-date-tools]");
if (root)
  init().catch(() => {
    const feedback = root.querySelector("#dt-convert-status");
    feedback.textContent =
      document.documentElement.lang === "fa"
        ? "مرورگر نتوانست ابزار تاریخ را آماده کند؛ نسخهٔ به‌روز مرورگر را امتحان کنید."
        : "The date tool could not initialize. Try an updated browser.";
  });
async function init() {
  const { eventsOn, eventsBetween } =
    await import("./date-events.mjs?v=20261123-date1");
  const $ = (id) => root.querySelector("#dt-" + id),
    t = (en, fa) => (document.documentElement.lang === "fa" ? fa : en),
    lang = () => (document.documentElement.lang === "fa" ? "fa" : "en"),
    n = (value) =>
      new Intl.NumberFormat(lang(), { maximumFractionDigits: 0 }).format(value);
  const groupIds = ["convert", "birth", "asof", "start", "end", "base"];
  let selectedDay = null,
    ageResult = null,
    activeTab = "convert",
    lastToday = null,
    lastDistance = false,
    lastShift = false;
  const deviceZone = () =>
      Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    zone = () =>
      $("zone").value === "device" ? deviceZone() : $("zone").value,
    today = () => todayDay(Date.now(), zone());
  const element = (tag, text, className) => {
    const e = document.createElement(tag);
    if (text !== undefined) e.textContent = text;
    if (className) e.className = className;
    return e;
  };
  const isolatedISO = (day) => "\u2066" + isoDate(day) + "\u2069";
  const calendarName = (c) =>
    c === "persian"
      ? t("Persian", "شمسی")
      : c === "gregory"
        ? t("Gregorian", "میلادی")
        : t("Hijri · calculated", "قمری محاسباتی");
  const errorText = (error) =>
    ({
      future: t(
        "The birth date is after the reference date.",
        "تاریخ تولد بعد از تاریخ مبناست.",
      ),
      range: t(
        "Choose a date within Gregorian years 1600–2199.",
        "تاریخی در بازهٔ سال‌های میلادی ۱۶۰۰ تا ۲۱۹۹ انتخاب کنید.",
      ),
      calendar: t(
        "This browser does not support the requested calendar. Try an updated browser.",
        "مرورگر از این تقویم پشتیبانی نمی‌کند؛ نسخهٔ به‌روز مرورگر را امتحان کنید.",
      ),
      paste: t(
        "Enter a year-first date, such as 1405/09/02, in the selected calendar.",
        "تاریخ را با تقویم انتخابی و به شکل سال/ماه/روز، مثل ۱۴۰۵/۰۹/۰۲، وارد کنید.",
      ),
      invalid: t(
        "Check the year, month and day. This date does not exist.",
        "سال، ماه و روز را بررسی کنید؛ این تاریخ در تقویم انتخابی وجود ندارد.",
      ),
    })[error?.message] ||
    t(
      "The date could not be calculated. Check the input.",
      "تاریخ محاسبه نشد؛ ورودی را بررسی کنید.",
    );
  function feedbackError(id, error) {
    $(id).dataset.error = error?.message || "invalid";
    $(id).textContent = errorText(error);
  }
  function clearError(id) {
    delete $(id).dataset.error;
  }
  function group(id) {
    return {
      calendar: $(id + "-calendar").value,
      year: integer($(id + "-year").value),
      month: integer($(id + "-month").value),
      day: integer($(id + "-day").value),
    };
  }
  const read = (id) => {
    const p = group(id);
    return toDay(p.calendar, p);
  };
  function monthOptions(select, calendar, value = select.value || "1") {
    select.replaceChildren();
    const year =
      calendar === "persian" ? 1404 : calendar === "gregory" ? 2025 : 1447;
    for (let month = 1; month <= 12; month++) {
      const day = toDay(calendar, { year, month, day: 1 }),
        label = new Intl.DateTimeFormat(lang(), {
          calendar,
          timeZone: "UTC",
          month: "long",
        }).format(new Date(day * 86400000));
      const o = element("option", label);
      o.value = month;
      select.append(o);
    }
    select.value = value;
  }
  function setDate(id, day, calendar = $(id + "-calendar").value) {
    const p = parts(day, calendar);
    $(id + "-calendar").value = calendar;
    $(id + "-calendar").dataset.previous = calendar;
    monthOptions($(id + "-month"), calendar, String(p.month));
    $(id + "-year").value = p.year;
    $(id + "-day").value = p.day;
  }
  function unit(value, en, fa) {
    const box = element("div", undefined, "dt-stat");
    box.append(element("strong", n(value)), element("span", t(en, fa)));
    return box;
  }
  function human(diff) {
    const quantity = (value, label) =>
      `${n(value)} ${label}${value === 1 ? "" : "s"}`;
    return t(
      `${quantity(diff.years, "year")}, ${quantity(diff.months, "month")}, ${quantity(diff.days, "day")}`,
      `${n(diff.years)} سال، ${n(diff.months)} ماه و ${n(diff.days)} روز`,
    );
  }
  function dateCards(container, day) {
    container.replaceChildren();
    for (const c of CALENDARS) {
      const card = element("article", undefined, "dt-date-card");
      card.append(
        element("h3", calendarName(c)),
        element("strong", formatDay(day, c, lang())),
        element("p", formatDay(day, c, lang(), true)),
      );
      const copy = element("button", t("Copy", "کپی"), "dt-inline-copy");
      copy.type = "button";
      copy.addEventListener("click", () =>
        copyText(formatDay(day, c, lang(), true) + " · " + isoDate(day)),
      );
      card.append(copy);
      container.append(card);
    }
  }
  function eventList(day) {
    $("event-date").textContent =
      formatDay(day, "persian", lang(), true) + " · " + isolatedISO(day);
    const entries = eventsOn(day);
    $("events").replaceChildren();
    if (!entries.length)
      $("events").append(
        element(
          "p",
          t(
            "No occasion is listed for this date in this selection.",
            "در فهرست منتخب، مناسبتی برای این روز ثبت نشده است.",
          ),
        ),
      );
    for (const event of entries) {
      const row = element("div", undefined, "dt-event");
      row.append(element("span", event[lang()]));
      if (event.holiday)
        row.append(
          element("small", t("1405 holiday", "تعطیل ۱۴۰۵"), "dt-holiday-tag"),
        );
      $("events").append(row);
    }
    if (weekday(day) === 5)
      $("events").append(element("p", t("Friday", "جمعه"), "dt-friday"));
  }
  function convert() {
    clearError("convert-status");
    try {
      const day = read("convert");
      selectedDay = day;
      dateCards($("conversions"), day);
      const p = parts(day, $("convert-calendar").value),
        sign = solarSigns[parts(day, "persian").month - 1];
      $("date-facts").replaceChildren(
        element(
          "span",
          t("Year length: ", "تعداد روزهای سال: ") +
            n(yearLength($("convert-calendar").value, p.year)),
        ),
        element(
          "span",
          isLeap($("convert-calendar").value, p.year)
            ? t("Leap year", "سال کبیسه")
            : t("Common year", "سال غیرکبیسه"),
        ),
        element(
          "span",
          sign[0] +
            " " +
            t("Solar month sign: ", "برج ماه شمسی: ") +
            sign[lang() === "fa" ? 2 : 1],
        ),
      );
      $("convert-status").textContent = "";
      $("copy-date").disabled = false;
      $("use-birthday").disabled = false;
      eventList(day);
    } catch (error) {
      selectedDay = null;
      $("conversions").replaceChildren();
      $("date-facts").replaceChildren();
      feedbackError("convert-status", error);
      $("copy-date").disabled = $("use-birthday").disabled = true;
    }
  }
  function calculateAge() {
    clearError("age-status");
    try {
      const birth = read("birth"),
        asOf = $("asof-today").checked ? today() : read("asof"),
        calendar = $("birth-calendar").value;
      ageResult = age(birth, asOf, calendar, $("birthday-policy").value);
      ageResult.calendar = calendar;
      ageResult.birth = birth;
      ageResult.asOf = asOf;
      const r = ageResult,
        box = $("age-result");
      box.replaceChildren();
      box.append(
        element(
          "p",
          t("Age in the birth calendar · ", "سن بر اساس تقویم تولد · ") +
            calendarName(calendar),
          "dt-note",
        ),
      );
      const stats = element("div", undefined, "dt-age-stats");
      stats.append(
        unit(r.years, "Years", "سال"),
        unit(r.months, "Months", "ماه"),
        unit(r.days, "Days", "روز"),
      );
      box.append(stats);
      const total = element("div", undefined, "dt-mini-stats");
      total.append(
        unit(r.totalDays, "Total days", "مجموع روزها"),
        unit(r.weeks, "Full weeks", "هفتهٔ کامل"),
      );
      box.append(total);
      const birthday = element("div", undefined, "dt-next-birthday");
      birthday.append(
        element(
          "h3",
          r.birthdayToday
            ? t("Today is your birthday!", "امروز روز تولد شماست!")
            : t("Your next birthday", "تولد بعدی شما"),
        ),
        element(
          "strong",
          r.birthdayToday
            ? t("Happy birthday!", "تولدتان مبارک!")
            : t(
                `${n(r.untilBirthday)} days to go`,
                `${n(r.untilBirthday)} روز دیگر`,
              ),
        ),
        element(
          "p",
          formatDay(r.nextBirthday, calendar, lang(), true) +
            " · " +
            isolatedISO(r.nextBirthday),
        ),
      );
      box.append(birthday);
      $("age-status").textContent =
        t("Reference date: ", "تاریخ مبنا: ") +
        formatDay(asOf, calendar, lang(), true);
      $("copy-age").disabled = $("birthday-ics").disabled = false;
    } catch (error) {
      ageResult = null;
      $("age-result").replaceChildren();
      feedbackError("age-status", error);
      $("copy-age").disabled = $("birthday-ics").disabled = true;
    }
  }
  function distance() {
    clearError("distance-status");
    try {
      const start = read("start"),
        end = read("end"),
        r = difference(start, end, $("start-calendar").value),
        inclusive = $("inclusive").checked ? 1 : 0;
      const box = $("distance-result");
      box.replaceChildren(element("h3", human(r)));
      const stats = element("div", undefined, "dt-mini-stats");
      stats.append(
        unit(
          r.totalDays + inclusive,
          inclusive ? "Days, including end date" : "Days between dates",
          inclusive ? "روز، با احتساب پایان" : "روز فاصله",
        ),
        unit(
          Math.floor((r.totalDays + inclusive) / 7),
          "Full weeks",
          "هفتهٔ کامل",
        ),
      );
      box.append(
        stats,
        element(
          "p",
          t("Calendar breakdown uses: ", "تفکیک سال و ماه بر اساس: ") +
            calendarName($("start-calendar").value),
          "dt-note",
        ),
      );
      $("distance-status").textContent =
        r.sign < 0
          ? t(
              "The end date is before the start date. The absolute distance is shown.",
              "تاریخ پایان پیش از تاریخ شروع است؛ فاصله به صورت قدرمطلق نمایش داده می‌شود.",
            )
          : t("From ", "از ") +
            isolatedISO(start) +
            t(" to ", " تا ") +
            isolatedISO(end);
      lastDistance = true;
    } catch (error) {
      $("distance-result").replaceChildren();
      feedbackError("distance-status", error);
      lastDistance = false;
    }
  }
  function shift() {
    clearError("shift-status");
    try {
      const base = read("base"),
        count = integer($("shift-number").value),
        unit = $("shift-unit").value,
        calendar = $("base-calendar").value;
      const day = ["months", "years"].includes(unit)
        ? addMonths(base, count * (unit === "years" ? 12 : 1), calendar)
        : shiftDays(base, count * (unit === "weeks" ? 7 : 1));
      dateCards($("shift-result"), day);
      $("shift-status").textContent = formatDay(day, calendar, lang(), true);
      lastShift = true;
    } catch (error) {
      $("shift-result").replaceChildren();
      feedbackError("shift-status", error);
      lastShift = false;
    }
  }
  function renderMonth() {
    clearError("calendar-status");
    try {
      const calendar = $("view-calendar").value,
        year = integer($("view-year").value),
        month = integer($("view-month").value),
        first = calendar === "gregory" ? 1 : 6,
        grid = monthGrid(calendar, year, month, first),
        el = $("month-grid");
      el.replaceChildren();
      $("month-title").textContent = new Intl.DateTimeFormat(lang(), {
        calendar,
        timeZone: "UTC",
        year: "numeric",
        month: "long",
      }).format(new Date(grid.start * 86400000));
      for (let i = 0; i < 7; i++) {
        const label = new Intl.DateTimeFormat(lang(), {
          timeZone: "UTC",
          weekday: "short",
        }).format(new Date((3 + ((first + i) % 7)) * 86400000));
        el.append(element("span", label, "dt-weekday"));
      }
      for (const cell of grid.cells) {
        const button = element("button", n(cell.date.day), "dt-month-day");
        button.type = "button";
        button.disabled = cell.day < MIN_DAY || cell.day > MAX_DAY;
        button.classList.toggle("dt-other-month", !cell.inMonth);
        button.classList.toggle("dt-is-today", cell.day === today());
        const events = eventsOn(cell.day);
        button.classList.toggle(
          "dt-is-holiday",
          weekday(cell.day) === 5 || events.some((e) => e.holiday),
        );
        button.classList.toggle("dt-has-event", !!events.length);
        button.setAttribute(
          "aria-label",
          formatDay(cell.day, calendar, lang(), true) +
            (events.length
              ? " · " + events.map((e) => e[lang()]).join("، ")
              : ""),
        );
        button.addEventListener("click", () => {
          setDate("convert", cell.day, calendar);
          convert();
          tab("convert");
        });
        el.append(button);
      }
      $("month-events").replaceChildren();
      const entries = eventsBetween(grid.start, grid.start + grid.length - 1);
      if (!entries.length)
        $("month-events").append(
          element(
            "p",
            t(
              "No selected occasions in this month.",
              "در این ماه مناسبتی در فهرست منتخب ثبت نشده است.",
            ),
          ),
        );
      for (const item of entries) {
        const row = element("div", undefined, "dt-month-event");
        row.append(
          element("strong", n(parts(item.day, calendar).day)),
          element("span", item.entries.map((e) => e[lang()]).join(" · ")),
        );
        if (item.entries.some((e) => e.holiday))
          row.classList.add("dt-is-holiday");
        $("month-events").append(row);
      }
      $("calendar-status").textContent = "";
    } catch (error) {
      $("month-grid").replaceChildren();
      $("month-events").replaceChildren();
      $("month-title").textContent = "";
      feedbackError("calendar-status", error);
    }
  }
  function tab(id, focus = false) {
    activeTab = id;
    root.querySelectorAll("[data-date-tab]").forEach((button) => {
      const current = button.dataset.dateTab === id;
      button.setAttribute("aria-selected", String(current));
      button.tabIndex = current ? 0 : -1;
      if (current && focus) button.focus();
    });
    root
      .querySelectorAll('[role="tabpanel"]')
      .forEach((panel) => (panel.hidden = panel.id !== "dt-panel-" + id));
  }
  async function copyText(text) {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      $("clipboard-status").textContent = t("Copied.", "کپی شد.");
      $("copy-fallback").hidden = true;
    } catch {
      $("copy-fallback").hidden = false;
      $("copy-fallback").value = text;
      $("copy-fallback").focus();
      $("copy-fallback").select();
      $("clipboard-status").textContent = t(
        "Select and copy the text below.",
        "متن زیر را انتخاب و کپی کنید.",
      );
    }
  }
  function download(text, name, type) {
    const blob = new Blob([text], { type }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  function clock() {
    if (document.hidden) return;
    const now = Date.now();
    $("clock").textContent = new Intl.DateTimeFormat(lang(), {
      timeZone: zone(),
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).format(now);
    const day = today();
    $("today-label").textContent = formatDay(day, "persian", lang(), true);
    if (lastToday !== null && lastToday !== day) {
      if ($("asof-today").checked && ageResult) calculateAge();
      renderMonth();
    }
    lastToday = day;
  }
  function localize() {
    root
      .querySelectorAll("[data-en][data-fa]")
      .forEach((el) => (el.textContent = el.dataset[lang()]));
    root
      .querySelector('[role="tablist"]')
      .setAttribute("aria-label", t("Date tools", "ابزارهای تاریخ"));
    for (const id of groupIds)
      monthOptions($(id + "-month"), $(id + "-calendar").value);
    monthOptions($("view-month"), $("view-calendar").value);
    if (selectedDay !== null) convert();
    if (ageResult) calculateAge();
    if (lastDistance) distance();
    if (lastShift) shift();
    renderMonth();
    clock();
    root.querySelectorAll(".dt-feedback[data-error]").forEach((el) => {
      el.textContent = errorText(new Error(el.dataset.error));
    });
  }
  const initialCalendar = lang() === "fa" ? "persian" : "gregory",
    current = today();
  for (const id of groupIds)
    setDate(
      id,
      id === "end" ? shiftDays(current, 30) : current,
      initialCalendar,
    );
  $("birth-year").value = "";
  $("birth-day").value = "";
  $("copy-age").disabled = $("birthday-ics").disabled = true;
  const view = parts(current, initialCalendar);
  $("view-calendar").value = initialCalendar;
  $("view-year").value = view.year;
  monthOptions($("view-month"), initialCalendar, String(view.month));
  for (const id of groupIds)
    $(id + "-calendar").addEventListener("change", () => {
      const select = $(id + "-calendar"),
        c = select.value,
        previous = select.dataset.previous;
      try {
        const day = toDay(previous, {
          year: integer($(id + "-year").value),
          month: integer($(id + "-month").value),
          day: integer($(id + "-day").value),
        });
        setDate(id, day, c);
      } catch {
        monthOptions($(id + "-month"), c);
        select.dataset.previous = c;
      }
    });
  for (const id of ["convert", "age", "distance", "shift"])
    $(id).addEventListener("click", () =>
      ({ convert, age: calculateAge, distance, shift })[id](),
    );
  for (const id of groupIds) {
    for (const part of ["calendar", "year", "month", "day"]) {
      $(id + "-" + part).addEventListener("change", () => {
        if (id === "convert") convert();
        else if (["birth", "asof"].includes(id) && ageResult) calculateAge();
        else if (["start", "end"].includes(id) && lastDistance) distance();
        else if (id === "base" && lastShift) shift();
      });
    }
  }
  for (const id of ["birthday-policy", "asof-today"])
    $(id).addEventListener("change", () => {
      if (ageResult) calculateAge();
    });
  $("inclusive").addEventListener("change", () => {
    if (lastDistance) distance();
  });
  for (const id of ["shift-unit", "shift-number"])
    $(id).addEventListener("change", () => {
      if (lastShift) shift();
    });
  $("today").addEventListener("click", () => {
    setDate("convert", today());
    convert();
  });
  $("read-paste").addEventListener("click", () => {
    try {
      const p = parseDateText($("paste").value),
        day = toDay($("convert-calendar").value, p);
      setDate("convert", day);
      convert();
    } catch (error) {
      selectedDay = null;
      $("conversions").replaceChildren();
      $("date-facts").replaceChildren();
      $("copy-date").disabled = $("use-birthday").disabled = true;
      feedbackError("convert-status", error);
    }
  });
  $("paste").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      $("read-paste").click();
    }
  });
  $("use-birthday").addEventListener("click", () => {
    if (selectedDay !== null) {
      setDate("birth", selectedDay, $("convert-calendar").value);
      tab("age");
      calculateAge();
    }
  });
  $("asof-today").addEventListener(
    "change",
    () => ($("asof-wrap").hidden = $("asof-today").checked),
  );
  $("swap").addEventListener("click", () => {
    try {
      const a = read("start"),
        b = read("end"),
        ca = $("start-calendar").value,
        cb = $("end-calendar").value;
      setDate("start", b, cb);
      setDate("end", a, ca);
      distance();
    } catch (error) {
      feedbackError("distance-status", error);
    }
  });
  $("copy-date").addEventListener("click", () => {
    if (selectedDay !== null)
      copyText(
        CALENDARS.map(
          (c) =>
            calendarName(c) + ": " + formatDay(selectedDay, c, lang(), true),
        ).join("\n"),
      );
  });
  $("copy-age").addEventListener("click", () => {
    if (ageResult)
      copyText(
        human(ageResult) +
          "\n" +
          t("Total days: ", "مجموع روزها: ") +
          n(ageResult.totalDays) +
          "\n" +
          t("Next birthday: ", "تولد بعدی: ") +
          isoDate(ageResult.nextBirthday),
      );
  });
  $("birthday-ics").addEventListener("click", () => {
    if (ageResult)
      download(
        calendarFile(ageResult.nextBirthday, t("Birthday", "روز تولد")),
        `birthday-${isoDate(ageResult.nextBirthday)}.ics`,
        "text/calendar;charset=utf-8",
      );
  });
  $("month-go").addEventListener("click", renderMonth);
  $("view-calendar").addEventListener("change", () => {
    const p = parts(selectedDay ?? today(), $("view-calendar").value);
    $("view-year").value = p.year;
    monthOptions($("view-month"), $("view-calendar").value, String(p.month));
    renderMonth();
  });
  $("view-month").addEventListener("change", renderMonth);
  for (const [id, delta] of [
    ["prev-month", -1],
    ["next-month", 1],
  ])
    $(id).addEventListener("click", () => {
      try {
        let year = integer($("view-year").value),
          month = integer($("view-month").value) + delta;
        if (month < 1) {
          year--;
          month = 12;
        }
        if (month > 12) {
          year++;
          month = 1;
        }
        const day = toDay($("view-calendar").value, { year, month, day: 1 });
        $("view-year").value = year;
        $("view-month").value = month;
        renderMonth();
      } catch (error) {
        feedbackError("calendar-status", error);
      }
    });
  root.querySelectorAll("[data-date-tab]").forEach((button) => {
    button.addEventListener("click", () => tab(button.dataset.dateTab));
    button.addEventListener("keydown", (event) => {
      const tabs = [...root.querySelectorAll("[data-date-tab]")],
        index = tabs.indexOf(button);
      let next = index;
      if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else if (event.key === "ArrowRight")
        next = (index + (lang() === "fa" ? -1 : 1) + tabs.length) % tabs.length;
      else if (event.key === "ArrowLeft")
        next = (index + (lang() === "fa" ? 1 : -1) + tabs.length) % tabs.length;
      else return;
      event.preventDefault();
      tab(tabs[next].dataset.dateTab, true);
    });
  });
  $("zone").addEventListener("change", () => {
    lastToday = null;
    clock();
    if ($("asof-today").checked && ageResult) calculateAge();
    renderMonth();
  });
  new MutationObserver(localize).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
  let timer = null;
  function manageClock() {
    clearInterval(timer);
    timer = null;
    if (!document.hidden) {
      clock();
      timer = setInterval(clock, 1000);
    }
  }
  document.addEventListener("visibilitychange", manageClock);
  window.addEventListener("pagehide", () => clearInterval(timer));
  window.addEventListener("pageshow", manageClock);
  // Session draft is used only for an explicit language-link navigation on the standalone tool.
  const switcher = document.querySelector(".date-page .service-switch");
  if (switcher) {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("date-tool-draft") || "null",
      );
      sessionStorage.removeItem("date-tool-draft");
      if (saved) {
        for (const [id, value] of Object.entries(saved.values || {})) {
          const el = document.getElementById(id);
          if (!el || !root.contains(el)) continue;
          if (el.type === "checkbox") el.checked = value;
          else {
            el.value = value;
            if (id.endsWith("-calendar") && id !== "dt-view-calendar") {
              const prefix = id.slice(3, -9);
              monthOptions($(prefix + "-month"), value);
              el.dataset.previous = value;
            }
            if (id === "dt-view-calendar") monthOptions($("view-month"), value);
          }
        }
        tab(saved.tab || "convert");
        $("asof-wrap").hidden = $("asof-today").checked;
      }
    } catch {}
    switcher.addEventListener("click", () => {
      try {
        const values = {};
        root
          .querySelectorAll("input,select")
          .forEach(
            (el) =>
              (values[el.id] = el.type === "checkbox" ? el.checked : el.value),
          );
        sessionStorage.setItem(
          "date-tool-draft",
          JSON.stringify({ values, tab: activeTab }),
        );
      } catch {}
    });
  }
  root.querySelector(".dt-pending").disabled = false;
  convert();
  renderMonth();
  manageClock();
  if (activeTab === "age" && $("birth-year").value && $("birth-day").value)
    calculateAge();
  if (activeTab === "distance") distance();
  if (activeTab === "shift") shift();
}
