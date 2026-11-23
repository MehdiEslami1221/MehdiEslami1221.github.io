// Civil dates are integer UTC day numbers; time zones affect only the meaning of today.
export const DAY_MS = 86400000;
export const CALENDARS = ["persian", "gregory", "islamic-civil"];
export const MIN_DAY = Math.floor(Date.UTC(1600, 0, 1) / DAY_MS),
  MAX_DAY = Math.floor(Date.UTC(2199, 11, 31) / DAY_MS);
const SEARCH_MIN = Math.floor(Date.UTC(1580, 0, 1) / DAY_MS),
  SEARCH_MAX = Math.floor(Date.UTC(2221, 0, 1) / DAY_MS);
const formatters = new Map(),
  cache = new Map();
export function latinDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632));
}
export function integer(value) {
  const raw = latinDigits(value).trim();
  if (!/^[-+]?\d+$/.test(raw)) throw new Error("invalid");
  const n = Number(raw);
  if (!Number.isSafeInteger(n)) throw new Error("invalid");
  return n;
}
function formatter(calendar) {
  if (!CALENDARS.includes(calendar)) throw new Error("calendar");
  if (!formatters.has(calendar)) {
    const f = new Intl.DateTimeFormat("en-US", {
      calendar,
      numberingSystem: "latn",
      timeZone: "UTC",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    if (f.resolvedOptions().calendar !== calendar) throw new Error("calendar");
    formatters.set(calendar, f);
  }
  return formatters.get(calendar);
}
export function parts(day, calendar = "gregory") {
  if (!Number.isInteger(day) || day < SEARCH_MIN || day > SEARCH_MAX)
    throw new Error("range");
  const key = calendar + ":" + day;
  if (cache.has(key)) return { ...cache.get(key) };
  const p = Object.fromEntries(
    formatter(calendar)
      .formatToParts(new Date(day * DAY_MS))
      .map((p) => [p.type, p.value]),
  );
  const value = {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
  };
  if (!Object.values(value).every(Number.isInteger))
    throw new Error("calendar");
  if (cache.size > 6000) cache.clear();
  cache.set(key, value);
  return { ...value };
}
const key = (p) => p.year * 372 + p.month * 31 + p.day;
function findDay(calendar, value) {
  const target = {
    year: integer(value.year),
    month: integer(value.month),
    day: integer(value.day),
  };
  if (
    target.month < 1 ||
    target.month > 12 ||
    target.day < 1 ||
    target.day > 31
  )
    throw new Error("invalid");
  let low = SEARCH_MIN,
    high = SEARCH_MAX;
  if (
    key(target) < key(parts(low, calendar)) ||
    key(target) > key(parts(high, calendar))
  )
    throw new Error("range");
  while (low <= high) {
    const mid = Math.floor((low + high) / 2),
      compare = key(parts(mid, calendar)) - key(target);
    if (compare === 0) return mid;
    if (compare < 0) low = mid + 1;
    else high = mid - 1;
  }
  throw new Error("invalid");
}
export function toDay(calendar, value) {
  const day = findDay(calendar, value);
  if (day < MIN_DAY || day > MAX_DAY) throw new Error("range");
  return day;
}
export function monthLength(calendar, year, month) {
  year = integer(year);
  month = integer(month);
  const start = findDay(calendar, { year, month, day: 1 });
  const next = findDay(calendar, {
    year: month === 12 ? year + 1 : year,
    month: month === 12 ? 1 : month + 1,
    day: 1,
  });
  return next - start;
}
export function yearLength(calendar, year) {
  return (
    findDay(calendar, { year: integer(year) + 1, month: 1, day: 1 }) -
    findDay(calendar, { year, month: 1, day: 1 })
  );
}
export function isLeap(calendar, year) {
  return (
    yearLength(calendar, year) === (calendar === "islamic-civil" ? 355 : 366)
  );
}
export function weekday(day) {
  return (((day + 4) % 7) + 7) % 7;
}
export function todayDay(now = Date.now(), timeZone = "Asia/Tehran") {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      calendar: "gregory",
      numberingSystem: "latn",
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
      .formatToParts(new Date(now))
      .map((p) => [p.type, p.value]),
  );
  return Math.floor(
    Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day)) / DAY_MS,
  );
}
export function formatDay(day, calendar, locale = "fa", long = false) {
  if (!long) {
    const p = parts(day, calendar),
      digit = (value, width) =>
        new Intl.NumberFormat(locale, {
          useGrouping: false,
          minimumIntegerDigits: width,
        }).format(value);
    return `${digit(p.year, 4)}/${digit(p.month, 2)}/${digit(p.day, 2)}`;
  }
  if (locale === "fa" && long) {
    const value = new Date(day * DAY_MS),
      p = parts(day, calendar),
      number = (n) =>
        new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(n),
      weekdayName = new Intl.DateTimeFormat("fa-IR", {
        timeZone: "UTC",
        weekday: "long",
      }).format(value),
      monthName = new Intl.DateTimeFormat("fa-IR", {
        calendar,
        timeZone: "UTC",
        month: "long",
      }).format(value);
    return `${weekdayName}، ${number(p.day)} ${monthName} ${number(p.year)}`;
  }
  return new Intl.DateTimeFormat(locale, {
    calendar,
    numberingSystem: locale === "fa" ? "arabext" : "latn",
    timeZone: "UTC",
    ...(long
      ? { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      : { year: "numeric", month: "2-digit", day: "2-digit" }),
  }).format(new Date(day * DAY_MS));
}
export function isoDate(day) {
  const p = parts(day);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}
export function parseDateText(text) {
  const match = latinDigits(text)
    .trim()
    .match(/^(\d{4})\s*[-/.]\s*(\d{1,2})\s*[-/.]\s*(\d{1,2})$/);
  if (!match) throw new Error("paste");
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}
export function addMonths(day, count, calendar = "persian", overflow = "last") {
  count = integer(count);
  if (Math.abs(count) > 7200) throw new Error("range");
  const p = parts(day, calendar),
    index = p.year * 12 + p.month - 1 + count,
    year = Math.floor(index / 12),
    month = (((index % 12) + 12) % 12) + 1,
    len = monthLength(calendar, year, month);
  const result =
    findDay(calendar, { year, month, day: Math.min(p.day, len) }) +
    (overflow === "next" ? Math.max(0, p.day - len) : 0);
  if (result < MIN_DAY || result > MAX_DAY) throw new Error("range");
  return result;
}
export function difference(
  start,
  end,
  calendar = "persian",
  overflow = "last",
) {
  const sign = end < start ? -1 : 1,
    from = Math.min(start, end),
    to = Math.max(start, end),
    a = parts(from, calendar),
    b = parts(to, calendar);
  let totalMonths = (b.year - a.year) * 12 + b.month - a.month;
  while (addMonths(from, totalMonths, calendar, overflow) > to) totalMonths--;
  return {
    sign,
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: to - addMonths(from, totalMonths, calendar, overflow),
    totalDays: to - from,
    weeks: Math.floor((to - from) / 7),
    remainingDays: (to - from) % 7,
  };
}
export function age(birth, asOf, calendar = "persian", overflow = "last") {
  if (birth > asOf) throw new Error("future");
  const result = difference(birth, asOf, calendar, overflow),
    b = parts(birth, calendar),
    now = parts(asOf, calendar);
  const anniversary = (year) => {
    const len = monthLength(calendar, year, b.month);
    return (
      findDay(calendar, { year, month: b.month, day: Math.min(b.day, len) }) +
      (overflow === "next" ? Math.max(0, b.day - len) : 0)
    );
  };
  // An Esfand 30 anniversary can roll into Farvardin of the following year.
  const anniversaries = [now.year - 1, now.year, now.year + 1, now.year + 2]
    .filter((year) => year >= b.year)
    .map((year) => ({ year, day: anniversary(year) }));
  const upcoming = anniversaries.find((entry) => entry.day >= asOf),
    next = upcoming.day,
    previous =
      anniversaries.filter((entry) => entry.day < asOf).at(-1)?.day ?? birth,
    birthdayToday = next === asOf;
  return {
    ...result,
    nextBirthday: next,
    untilBirthday: next - asOf,
    birthdayToday,
    nextAge: upcoming.year - b.year,
    progress: birthdayToday
      ? 0
      : Math.max(0, Math.min(1, (asOf - previous) / (next - previous))),
  };
}
export function shiftDays(day, count) {
  count = integer(count);
  if (Math.abs(count) > 220000) throw new Error("range");
  const value = day + count;
  if (value < MIN_DAY || value > MAX_DAY) throw new Error("range");
  return value;
}
export function monthGrid(calendar, year, month, firstWeekday = 6) {
  const start = toDay(calendar, { year, month, day: 1 }),
    length = monthLength(calendar, year, month),
    offset = (weekday(start) - firstWeekday + 7) % 7;
  return {
    start,
    length,
    offset,
    cells: Array.from(
      { length: Math.ceil((offset + length) / 7) * 7 },
      (_, i) => {
        const day = start + i - offset;
        return {
          day,
          inMonth: i >= offset && i < offset + length,
          date: parts(day, calendar),
        };
      },
    ),
  };
}
export function calendarFile(day, summary, stamp = new Date()) {
  const clean = String(summary)
      .replace(/[\r\n]/g, " ")
      .replaceAll("\\", "\\\\")
      .replaceAll(";", "\\;")
      .replaceAll(",", "\\,")
      .slice(0, 120),
    icsDay = (d) => isoDate(d).replaceAll("-", "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mehdi Eslami//Date tools//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:date-${icsDay(day)}@mehdieslami.ir`,
    `DTSTAMP:${stamp
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    `DTSTART;VALUE=DATE:${icsDay(day)}`,
    `DTEND;VALUE=DATE:${icsDay(day + 1)}`,
    `SUMMARY:${clean}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // RFC 5545: fold by UTF-8 octets without splitting a code point.
  const fold = (line) => {
    const out = [];
    let current = "",
      size = 0;
    for (const c of line) {
      const n = new TextEncoder().encode(c).length;
      if (size + n > 74) {
        out.push(current);
        current = " ";
        size = 1;
      }
      current += c;
      size += n;
    }
    out.push(current);
    return out.join("\r\n");
  };
  return lines.map(fold).join("\r\n") + "\r\n";
}
export const solarSigns = [
  ["♈", "Aries", "حمل"],
  ["♉", "Taurus", "ثور"],
  ["♊", "Gemini", "جوزا"],
  ["♋", "Cancer", "سرطان"],
  ["♌", "Leo", "اسد"],
  ["♍", "Virgo", "سنبله"],
  ["♎", "Libra", "میزان"],
  ["♏", "Scorpio", "عقرب"],
  ["♐", "Sagittarius", "قوس"],
  ["♑", "Capricorn", "جدی"],
  ["♒", "Aquarius", "دلو"],
  ["♓", "Pisces", "حوت"],
];
