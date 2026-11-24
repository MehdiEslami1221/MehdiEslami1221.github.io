import test from "node:test";
import assert from "node:assert/strict";
import { createQuoteRotation, QUOTE_INTERVAL } from "../quote-rotation.mjs";
import { quotes } from "../content/quotes.mjs";

function clock() {
  let time = 0, serial = 0;
  const tasks = new Map(), changes = [], ticks = [], states = [];
  const rotation = createQuoteRotation({
    count: quotes.length,
    now: () => time,
    setTimer: (fn, delay) => {
      const id = ++serial;
      tasks.set(id, { fn, due: time + delay });
      return id;
    },
    clearTimer: id => tasks.delete(id),
    onChange: index => changes.push({ index, time }),
    onTick: (fraction, seconds) => ticks.push({ fraction, seconds }),
    onState: (fraction, running) => states.push({ fraction, running }),
  });
  function advance(ms) {
    const end = time + ms;
    for (;;) {
      const task = [...tasks].filter(([, t]) => t.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
      if (!task) break;
      time = task[1].due;
      tasks.delete(task[0]);
      task[1].fn();
    }
    time = end;
  }
  return { rotation, changes, ticks, states, tasks, advance };
}

test("Quotes advance at 10 seconds with a synchronized progress reset", () => {
  const c = clock();
  assert.equal(QUOTE_INTERVAL, 10_000);
  c.rotation.start();
  c.rotation.start();
  assert.equal(c.tasks.size, 1);
  c.advance(9999);
  assert.equal(c.changes.length, 0);
  assert.equal(c.ticks.at(-1).seconds, 1);
  assert.ok(c.ticks.at(-1).fraction < 0.02);
  c.advance(1);
  assert.deepEqual(c.changes, [{ index: 1, time: 10_000 }]);
  assert.deepEqual(c.ticks.at(-1), { fraction: 1, seconds: 10 });
});

test("Manual next gives the new quote a full interval and does not add a timer", () => {
  const c = clock();
  c.rotation.start();
  c.advance(3250);
  c.rotation.next();
  assert.equal(c.changes.at(-1).index, 1);
  assert.equal(c.tasks.size, 1);
  c.advance(9999);
  assert.equal(c.changes.length, 1);
  c.advance(1);
  assert.deepEqual(c.changes.at(-1), { index: 2, time: 13_250 });
});

test("A hidden tab preserves remaining time and resumes without skipping quotes", () => {
  const c = clock();
  c.rotation.start();
  c.advance(4000);
  c.rotation.stop();
  assert.equal(c.tasks.size, 0);
  c.advance(60_000);
  assert.equal(c.changes.length, 0);
  c.rotation.start();
  c.advance(5999);
  assert.equal(c.changes.length, 0);
  c.advance(1);
  assert.deepEqual(c.changes.at(-1), { index: 1, time: 70_000 });
});

test("The complete quote collection is visited before repeating", () => {
  const c = clock(), seen = [0];
  for (let i = 1; i < quotes.length; i++) {
    c.rotation.next();
    seen.push(c.changes.at(-1).index);
  }
  assert.equal(new Set(seen).size, quotes.length);
  c.rotation.next();
  assert.equal(c.changes.at(-1).index, 0);
  assert.equal(c.tasks.size, 0);
});

test("Ring animation state follows exact remaining time without restarting on text ticks", () => {
  const c = clock();
  c.rotation.start();
  assert.deepEqual(c.states, [{ fraction: 1, running: true }]);
  c.advance(1250);
  assert.equal(c.states.length, 1);
  c.rotation.refresh();
  assert.deepEqual(c.states.at(-1), { fraction: 0.875, running: true });
  c.rotation.stop();
  assert.deepEqual(c.states.at(-1), { fraction: 0.875, running: false });
  c.advance(60_000);
  c.rotation.start();
  assert.deepEqual(c.states.at(-1), { fraction: 0.875, running: true });
  c.advance(8750);
  assert.deepEqual(c.changes.at(-1), { index: 1, time: 70_000 });
  assert.deepEqual(c.states.at(-1), { fraction: 1, running: true });
  c.rotation.next();
  assert.deepEqual(c.states.at(-1), { fraction: 1, running: true });
  assert.equal(c.tasks.size, 1);
});

test("Every bilingual excerpt has a distinct text, author and HTTPS source", () => {
  assert.equal(quotes.length, 18);
  assert.equal(new Set(quotes.map(q => q.text)).size, quotes.length);
  assert.ok(new Set(quotes.map(q => q.author)).size >= 12);
  for (const q of quotes) {
    assert.ok(q.text && q.fa && q.author && q.faAuthor && q.initials);
    assert.equal(new URL(q.source).protocol, "https:");
  }
  assert.ok(quotes.some(q => q.author === "Bill Gates"));
  assert.ok(quotes.some(q => q.author === "Steve Jobs"));
});
