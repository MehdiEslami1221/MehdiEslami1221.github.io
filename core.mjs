// Pure browser/Node utilities. No requests, user tracking or third-party runtime.
// Native local dates follow the visitor's device zone, including DST changes.
// Day 256 is Gregorian; neither the UI language nor an IP address selects a zone.
export function programmerDayStart(year) {
  return new Date(year, 0, 256).getTime();
}
export function programmerDayState(now = Date.now()) {
  const year = new Date(now).getFullYear();
  const today = programmerDayStart(year);
  // The following local midnight may be 23 or 25 hours away in a DST zone.
  const end = new Date(year, 0, 257).getTime();
  const active = now >= today && now < end;
  const target = now >= end ? programmerDayStart(year + 1) : today;
  const seconds = Math.max(0, Math.ceil((target - now) / 1000));
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
  const localDate = new Date(target);
  const calendarDate = (date) =>
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const date = calendarDate(localDate);
  const next = calendarDate(
    new Date(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate() + 1,
    ),
  );
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
