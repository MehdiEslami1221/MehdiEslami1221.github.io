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

// One short shooting star at a time. Coordinates are viewport CSS pixels.
export function planMeteor(width, height, random = Math.random) {
  const mobile = width < 700,
    direction = random() < 0.5 ? -1 : 1;
  return {
    x: width * (direction > 0 ? 0.08 + random() * 0.2 : 0.92 - random() * 0.2),
    y: height * (0.06 + random() * 0.35),
    dx: direction * width * 0.72,
    dy: height * (0.25 + random() * 0.2),
    duration: 2.1 + random() * 0.8,
    tail: mobile ? 90 : 170,
    gap: (mobile ? 22 : 16) + random() * 12,
  };
}
export function meteorPose(shot, age) {
  if (age < 0 || age >= shot.duration) return null;
  const progress = age / shot.duration,
    length = Math.hypot(shot.dx, shot.dy);
  const x = shot.x + shot.dx * progress,
    y = shot.y + shot.dy * progress;
  return {
    x,
    y,
    tailX: x - (shot.dx / length) * shot.tail,
    tailY: y - (shot.dy / length) * shot.tail,
    alpha: Math.min(1, age / 0.3, (shot.duration - age) / 0.5) * 0.62,
  };
}
// Clamp to the nearest point on the panel, so only panels near the light react.
export function meteorReflection(rect, pose, radius = 260) {
  const x = Math.max(rect.left, Math.min(rect.right, pose.x));
  const y = Math.max(rect.top, Math.min(rect.bottom, pose.y));
  const proximity = Math.max(
    0,
    1 - Math.hypot(pose.x - x, pose.y - y) / radius,
  );
  return {
    x: pose.x - rect.left,
    y: pose.y - rect.top,
    strength: proximity * proximity * pose.alpha,
  };
}
