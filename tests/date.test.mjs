import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  toDay,
  parts,
  isoDate,
  isLeap,
  monthLength,
  yearLength,
  weekday,
  age,
  difference,
  addMonths,
  shiftDays,
  monthGrid,
  todayDay,
  calendarFile,
  integer,
  parseDateText,
  CALENDARS,
} from "../date-core.mjs";
import { clockTime } from "../date-clock.mjs";
const date = (year, month, day, calendar = "gregory") =>
  toDay(calendar, { year, month, day });
test("Known Persian/Gregorian dates, leap Esfand and weekdays agree with civil anchors", () => {
  assert.equal(isoDate(date(1368, 9, 2, "persian")), "1989-11-23");
  assert.equal(weekday(date(1989, 11, 23)), 4);
  assert.equal(isoDate(date(1405, 1, 1, "persian")), "2026-03-21");
  assert.equal(isoDate(date(1403, 12, 30, "persian")), "2025-03-20");
  assert.equal(isLeap("persian", 1403), true);
  assert.equal(isLeap("persian", 1404), false);
  assert.equal(monthLength("persian", 1404, 12), 29);
  assert.equal(yearLength("gregory", 2000), 366);
  assert.equal(yearLength("gregory", 1900), 365);
});
test("Round trips across three calendars and years reject invalid dates instead of normalizing", () => {
  for (const cal of CALENDARS)
    for (const y of [1601, 1700, 1900, 1989, 2000, 2025, 2026, 2100, 2198])
      for (const [m, d] of [
        [1, 1],
        [3, 20],
        [3, 21],
        [9, 13],
        [12, 31],
      ]) {
        const ordinal = date(y, m, d);
        assert.equal(toDay(cal, parts(ordinal, cal)), ordinal);
      }
  assert.throws(() => date(1404, 12, 30, "persian"), /invalid/);
  assert.throws(() => date(2025, 2, 29), /invalid/);
  assert.throws(() => date(2024, 4, 31), /invalid/);
  assert.throws(() => date(1500, 1, 1), /range/);
  assert.throws(() => date(2025, 13, 1), /invalid/);
  assert.equal(integer("۱۴۰۵"), 1405);
  assert.equal(integer("١٤٤٨"), 1448);
  assert.deepEqual(parseDateText("۱۳۶۸/۰۹/۰۲"), {
    year: 1368,
    month: 9,
    day: 2,
  });
  assert.throws(() => parseDateText("23/11/1989"), /paste/);
});
test("Age counts completed calendar units, normalizes months and handles birthday boundaries", () => {
  const birth = date(1368, 9, 2, "persian"),
    reference = date(2026, 11, 23);
  let r = age(birth, reference, "persian");
  assert.deepEqual([r.years, r.months, r.days], [37, 0, 0]);
  assert.equal(r.birthdayToday, true);
  assert.equal(r.untilBirthday, 0);
  assert.equal(r.totalDays, 13514);
  r = age(birth, reference - 1, "persian");
  assert.deepEqual([r.years, r.months, r.days], [36, 11, 29]);
  assert.equal(r.untilBirthday, 1);
  assert.ok(r.progress > 0 && r.progress < 1);
  r = age(date(2020, 2, 29), date(2024, 2, 28), "gregory");
  assert.deepEqual([r.years, r.months, r.days], [3, 11, 30]);
  assert.equal(r.untilBirthday, 1);
  const leap = date(2020, 2, 29);
  assert.equal(
    age(leap, date(2023, 2, 28), "gregory", "last").birthdayToday,
    true,
  );
  r = age(leap, date(2023, 2, 28), "gregory", "next");
  assert.equal(r.birthdayToday, false);
  assert.equal(r.years, 2);
  assert.equal(r.untilBirthday, 1);
  assert.equal(
    isoDate(
      age(
        date(1403, 12, 30, "persian"),
        date(1404, 12, 29, "persian"),
        "persian",
        "next",
      ).nextBirthday,
    ),
    "2026-03-21",
  );
  assert.throws(() => age(reference + 1, reference), /future/);
  r = age(
    date(1403, 12, 30, "persian"),
    date(1405, 1, 1, "persian"),
    "persian",
    "next",
  );
  assert.equal(r.birthdayToday, true);
  assert.equal(r.years, 1);
  assert.equal(r.nextAge, 1);
});
test("Date shifting and interval arithmetic preserve civil days and end-of-month rules", () => {
  const jan31 = date(2025, 1, 31);
  assert.equal(isoDate(addMonths(jan31, 1, "gregory")), "2025-02-28");
  assert.equal(isoDate(addMonths(jan31, 1, "gregory", "next")), "2025-03-03");
  assert.equal(
    isoDate(addMonths(date(2024, 2, 29), 12, "gregory")),
    "2025-02-28",
  );
  const from = date(2026, 3, 20),
    to = shiftDays(from, 30);
  assert.equal(to - from, 30);
  assert.equal(difference(to, from, "gregory").sign, -1);
  assert.equal(difference(from, from).totalDays, 0);
  for (const cal of CALENDARS)
    for (let offset = 0; offset < 800; offset += 19) {
      const r = difference(date(2020, 2, 29), date(2020, 2, 29) + offset, cal);
      assert.ok(r.months >= 0 && r.months < 12);
      assert.equal(
        addMonths(date(2020, 2, 29), r.years * 12 + r.months, cal) + r.days,
        date(2020, 2, 29) + offset,
      );
    }
});
test("Today is explicitly zoned and day differences ignore DST hour changes", () => {
  const instant = Date.UTC(2026, 10, 22, 22, 0);
  assert.equal(isoDate(todayDay(instant, "Asia/Tehran")), "2026-11-23");
  assert.equal(isoDate(todayDay(instant, "America/Los_Angeles")), "2026-11-22");
  assert.equal(date(2026, 3, 9) - date(2026, 3, 8), 1);
  assert.equal(date(2026, 11, 2) - date(2026, 11, 1), 1);
});
test("Month grids align Saturday/Sunday correctly across years", () => {
  const g = monthGrid("persian", 1405, 9, 6);
  assert.equal(g.offset, 1);
  assert.equal(g.length, 30);
  assert.equal(g.cells[g.offset].date.day, 1);
  assert.equal(weekday(g.cells[0].day), 6);
  assert.equal(monthGrid("gregory", 2026, 11, 1).offset, 6);
});
test("Birthday ICS is all-day, one event, escaped and UTF-8 line folded", () => {
  const text = calendarFile(
    date(2026, 11, 23),
    "تولد,مهدی; " + "تاریخ ".repeat(30),
    new Date("2026-11-23T00:00:00Z"),
  );
  assert.match(text, /DTSTART;VALUE=DATE:20261123/);
  assert.match(text, /DTEND;VALUE=DATE:20261124/);
  assert.match(text, /\\,/);
  assert.match(text, /\\;/);
  assert.equal((text.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.ok(
    text
      .split("\r\n")
      .every((line) => new TextEncoder().encode(line).length <= 75),
  );
  assert.ok(!text.includes("RRULE"));
});
test("Date tools are above the existing lab in both static homes; existing metadata and tools remain", async () => {
  for (const path of ["index.html", "fa/index.html"]) {
    const html = await readFile(path, "utf8");
    assert.ok(html.indexOf('id="date-tools"') < html.indexOf('id="lab"'));
    assert.match(html, /id="studio"/);
    assert.match(html, /id="image-tools"/);
    assert.match(html, /class="wrap tools-discovery-grid"/);
    assert.match(html, /class="profile-discovery date-discovery"/);
    assert.match(
      html,
      path.startsWith("fa/")
        ? /href="\/fa\/tools\/date-converter\/"/
        : /href="\/tools\/date-converter\/"/,
    );
    assert.doesNotMatch(
      html,
      /data-date-tools|id="dt-panel-age"|src="\/date.js/,
    );
    const tool = await readFile(
      path.startsWith("fa/")
        ? "fa/tools/date-converter/index.html"
        : "tools/date-converter/index.html",
      "utf8",
    );
    assert.match(tool, /data-date-tools/);
    assert.match(tool, /id="dt-panel-age"/);
  }
});

test("Analog and digital clock parts follow six zones, DST, midnight and continuous hand angles", () => {
  const instant = Date.UTC(2026, 10, 23, 0, 0, 0);
  for (const [zone, hour, minute] of [
    ["UTC", 0, 0],
    ["Asia/Tehran", 3, 30],
    ["Europe/Berlin", 1, 0],
    ["America/Los_Angeles", 16, 0],
    ["Asia/Tokyo", 9, 0],
    ["Pacific/Kiritimati", 14, 0],
  ]) {
    const c = clockTime(instant, zone);
    assert.equal(c.hour, hour);
    assert.equal(c.minute, minute);
    assert.equal(c.second, 0);
    assert.equal(c.hourAngle, ((hour % 12) + minute / 60) * 30);
    assert.equal(c.minuteAngle, minute * 6);
  }
  assert.equal(clockTime(Date.UTC(2026, 6, 1, 0), "Europe/Berlin").hour, 2);
  assert.equal(
    clockTime(Date.UTC(2026, 6, 1, 0), "America/Los_Angeles").hour,
    17,
  );
  const before = clockTime(
    Date.UTC(2026, 10, 23, 20, 29, 59, 500),
    "Asia/Tehran",
  );
  assert.equal(before.hour, 23);
  assert.equal(before.minute, 59);
  assert.equal(before.secondAngle, 357);
  const after = clockTime(Date.UTC(2026, 10, 23, 20, 30, 0), "Asia/Tehran");
  assert.equal(after.hour, 0);
  assert.equal(after.hourAngle, 0);
  assert.equal(after.secondAngle, 0);
  assert.ok(
    Math.abs(
      clockTime(Date.UTC(2026, 0, 1, 10, 10, 30), "UTC").hourAngle - 305.25,
    ) < 1e-10,
  );
});
test("Date pages retain the branded clock and calendar without year-specific occasion content", async () => {
  for (const path of [
    "tools/date-converter/index.html",
    "fa/tools/date-converter/index.html",
  ]) {
    const html = await readFile(path, "utf8");
    assert.match(html, /<image href="\/assets\/logo.svg"/);
    assert.match(html, /id="dt-analog"/);
    assert.match(html, /id="dt-month-grid"/);
    assert.doesNotMatch(
      html,
      /dt-month-events|dt-occasions|date-events|تعطیلات|مناسبت|selected occasions|1405 holiday/,
    );
  }
});
