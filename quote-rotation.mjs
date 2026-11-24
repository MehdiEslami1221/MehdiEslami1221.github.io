export const QUOTE_INTERVAL = 10_000;

// A monotonic deadline keeps the text, countdown and progress on one clock.
export function createQuoteRotation({
  count,
  onChange,
  onTick,
  onState = () => {},
  now = () => performance.now(),
  setTimer = setTimeout,
  clearTimer = clearTimeout,
}) {
  if (!Number.isInteger(count) || count < 1) throw new RangeError("quote count");
  let index = 0, running = false, remaining = QUOTE_INTERVAL, deadline = 0, timer;
  const report = () => onTick(remaining / QUOTE_INTERVAL, Math.ceil(remaining / 1000));
  const reportState = () => onState(remaining / QUOTE_INTERVAL, running);
  function next() {
    index = (index + 1) % count;
    remaining = QUOTE_INTERVAL;
    deadline = now() + remaining;
    onChange(index);
    report();
    reportState();
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
    refresh() {
      if (running) remaining = Math.max(0, deadline - now());
      report();
      reportState();
    },
    start() {
      if (running) return;
      running = true;
      deadline = now() + remaining;
      reportState();
      tick();
    },
    stop() {
      if (!running) return;
      remaining = Math.max(0, deadline - now());
      running = false;
      clearTimer(timer);
      report();
      reportState();
    },
  };
}
