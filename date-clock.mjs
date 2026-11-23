// One instant and one explicit IANA zone drive both the hands and readout.
const formatters = new Map();
export function clockTime(instant, timeZone = "Asia/Tehran") {
  const date = new Date(instant);
  if (!Number.isFinite(date.getTime())) throw new Error("invalid");
  if (!formatters.has(timeZone))
    formatters.set(
      timeZone,
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        numberingSystem: "latn",
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
  const p = Object.fromEntries(
    formatters
      .get(timeZone)
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const hour = Number(p.hour),
    minute = Number(p.minute),
    second = Number(p.second);
  const seconds = second + date.getUTCMilliseconds() / 1000;
  return {
    hour,
    minute,
    second,
    hourAngle: ((hour % 12) + minute / 60 + seconds / 3600) * 30,
    minuteAngle: (minute + seconds / 60) * 6,
    secondAngle: seconds * 6,
  };
}
