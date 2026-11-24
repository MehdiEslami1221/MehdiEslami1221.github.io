export const QUOTE_INTERVAL = 10_000;

// A monotonic deadline keeps the text, countdown and progress on one clock.
export function createQuoteRotation({
  count,
  onChange,
  onTick,
  now = () => performance.now(),
  setTimer = setTimeout,
  clearTimer = clearTimeout,
}) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError("quote count");
  let index = 0, running = false, remaining = QUOTE_INTERVAL, deadline = 0, timer;
  const report = () => onTick(remaining / QUOTE_INTERVAL, Math.ceil(remaining / 1000));
  function next() {
    index = (index + 1) % count;
    remaining = QUOTE_INTERVAL;
    deadline = now() + remaining;
    onChange(index);
    report();
  }
  function tick() {
    if (!running) return;
    remaining = Math.max(0, deadline - now());
    if (remaining === 0) next();
    else report();
    timer = setTimer(tick, Math.min(100, remaining));
  }
  return {
    next,
    refresh: report,
    start() {
      if (running) return;
      running = true;
      deadline = now() + remaining;
      tick();
    },
    stop() {
      if (!running) return;
      remaining = Math.max(0, deadline - now());
      running = false;
      clearTimer(timer);
      report();
    },
  };
}
