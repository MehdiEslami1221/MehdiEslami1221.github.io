import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { launchHead } from '../scripts/pwa-shell.mjs';

const init = launchHead().match(/<script>([\s\S]*?)<\/script>/)[1];
const controller = await readFile(new URL('../pwa.js', import.meta.url), 'utf8');

function environment({ installed = true, navigation = 'navigate', seen = false, reduced = false, blockedStorage = false } = {}) {
  const attributes = new Map(), timers = [], frames = [], events = new Map();
  let removed = false;
  const root = {
    setAttribute: (k, v) => attributes.set(k, v),
    getAttribute: k => attributes.get(k),
    hasAttribute: k => attributes.has(k),
    removeAttribute: k => attributes.delete(k),
  };
  const context = vm.createContext({
    document: { documentElement: root, querySelector: () => ({ remove: () => { removed = true; } }) },
    navigator: {},
    performance: { now: () => 0, getEntriesByType: () => [{ type: navigation }] },
    sessionStorage: {
      getItem: () => { if (blockedStorage) throw Error('Storage unavailable'); return seen ? '1' : null; },
      setItem: () => { if (blockedStorage) throw Error('Storage unavailable'); seen = true; },
    },
    localStorage: { getItem: () => null },
    matchMedia: query => ({ matches: query.includes('standalone') ? installed : reduced }),
    setTimeout: (fn, ms) => timers.push({ fn, ms }),
    requestAnimationFrame: fn => frames.push(fn),
    addEventListener: (key, fn) => events.set(key, fn),
    removeEventListener: key => events.delete(key),
  });
  context.window = context;
  vm.runInContext(init, context);
  return { context, root, timers, frames, events, removed: () => removed,
    controller: () => vm.runInContext(controller, context),
    paint: () => { while (frames.length) frames.shift()(); } };
}

test('Intro skips browser tabs, reloads, history and repeat session navigation', () => {
  for (const options of [{ installed: false }, { navigation: 'reload' }, { navigation: 'back_forward' }, { seen: true }]) {
    const e = environment(options);
    assert.equal(e.root.hasAttribute('data-app-launch'), false);
    e.controller();
    assert.equal(e.removed(), true);
  }
});

test('Fallback removes a stalled launch and a late paint cannot resurrect it', () => {
  const e = environment();
  assert.equal(e.root.hasAttribute('data-app-launch'), true);
  e.controller();
  assert.equal(e.timers[0].ms, 1800);
  e.timers.shift().fn();
  e.paint();
  for (const timer of e.timers) timer.fn();
  assert.equal(e.root.hasAttribute('data-app-launch'), false);
  assert.equal(e.removed(), true);
});

test('Keyboard input skips immediately even when storage is unavailable', () => {
  const e = environment({ blockedStorage: true });
  e.controller();
  e.events.get('keydown')();
  e.paint();
  for (const timer of e.timers) timer.fn();
  assert.equal(e.root.hasAttribute('data-app-launch'), false);
  assert.equal(e.removed(), true);
});

test('Reduced motion adds no minimum display or fade delay', () => {
  const e = environment({ reduced: true });
  e.controller();
  e.paint();
  const transitionTimers = e.timers.slice(1);
  assert.equal(transitionTimers[0].ms, 0);
  transitionTimers[0].fn();
  assert.equal(e.timers.at(-1).ms, 0);
  e.timers.at(-1).fn();
  assert.equal(e.root.hasAttribute('data-app-launch'), false);
});
