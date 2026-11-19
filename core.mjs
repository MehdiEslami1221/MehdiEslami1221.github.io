// Pure browser/Node utilities. No requests, user tracking or third-party runtime.
const TEHRAN = "Asia/Tehran";
export function programmerDayStart(year) {
  const utcDay = new Date(Date.UTC(year, 0, 256));
  const wall = Date.UTC(year, utcDay.getUTCMonth(), utcDay.getUTCDate());
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TEHRAN,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(wall));
  const p = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const local = Date.UTC(
    +p.year,
    +p.month - 1,
    +p.day,
    +p.hour,
    +p.minute,
    +p.second,
  );
  return wall - (local - wall);
}
export function programmerDayState(now = Date.now()) {
  const year = +new Intl.DateTimeFormat("en", {
    timeZone: TEHRAN,
    year: "numeric",
  }).format(new Date(now));
  const today = programmerDayStart(year),
    end = today + 86400000;
  const active = now >= today && now < end;
  const target = now >= end ? programmerDayStart(year + 1) : today;
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  return {
    active,
    target,
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}
export function contrastRatio(fg, bg) {
  const luminance = (hex) => {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error("Invalid colour");
    const c = hex
      .slice(1)
      .match(/../g)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const a = luminance(fg),
    b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
export function textStats(text, locale = "en") {
  const words =
    typeof Intl.Segmenter === "function"
      ? [
          ...new Intl.Segmenter(locale, { granularity: "word" }).segment(text),
        ].filter((x) => x.isWordLike).length
      : (text.trim().match(/\S+/gu) || []).length;
  return {
    words,
    characters: [...text].length,
    minutes: Math.ceil(words / 200),
  };
}
export function stockMovement(stock, quantity, direction) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("positive");
  if (direction === "out" && quantity > stock) throw new Error("insufficient");
  return stock + (direction === "in" ? quantity : -quantity);
}
export function calendarEvent(target) {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: TEHRAN,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(target))
    .replaceAll("-", "");
  const next = new Date(
    Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8) + 1),
  )
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mehdi Eslami//Programmers Day//EN",
    "BEGIN:VEVENT",
    `UID:programmers-day-${date}@mehdieslami.ir`,
    `DTSTAMP:${new Date(target)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    `DTSTART;VALUE=DATE:${date}`,
    `DTEND;VALUE=DATE:${next}`,
    "SUMMARY:Programmer's Day",
    "DESCRIPTION:The 256th day of the year.",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
