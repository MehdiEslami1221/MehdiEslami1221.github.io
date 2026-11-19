import test from "node:test";
import assert from "node:assert/strict";
import {
  programmerDayStart,
  programmerDayState,
  calendarEvent,
  contrastRatio,
  textStats,
  stockMovement,
} from "../core.mjs";
import { readFile, access } from "node:fs/promises";
test("Day 256 accounts for leap years, Tehran midnight and annual rollover", () => {
  assert.equal(
    new Date(programmerDayStart(2027)).toISOString(),
    "2027-09-12T20:30:00.000Z",
  );
  assert.equal(
    new Date(programmerDayStart(2028)).toISOString(),
    "2028-09-11T20:30:00.000Z",
  );
  const start = programmerDayStart(2028);
  assert.equal(programmerDayState(start - 1).active, false);
  assert.equal(programmerDayState(start).active, true);
  assert.equal(programmerDayState(start + 86399999).active, true);
  assert.equal(programmerDayState(start + 86400000).active, false);
  assert.equal(
    programmerDayState(start + 86400000).target,
    programmerDayStart(2029),
  );
  assert.equal(programmerDayState(start - 1000).seconds, 1);
});
test("Calendar uses the holiday date, exclusive end and RFC line breaks", () => {
  const event = calendarEvent(programmerDayStart(2028));
  assert.match(event, /DTSTART;VALUE=DATE:20280912\r\n/);
  assert.match(event, /DTEND;VALUE=DATE:20280913\r\n/);
  assert.match(event, /UID:programmers-day-20280912@mehdieslami.ir/);
});
test("Contrast matches WCAG known endpoints and is symmetric", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
  assert.equal(contrastRatio("#abcdef", "#abcdef"), 1);
  assert.equal(
    contrastRatio("#abcdef", "#123456"),
    contrastRatio("#123456", "#abcdef"),
  );
  assert.throws(() => contrastRatio("red", "#000000"));
});
test("Text tool handles Persian words, emoji code points and empty input", () => {
  assert.deepEqual(textStats(""), { words: 0, characters: 0, minutes: 0 });
  assert.equal(textStats("سلام دنیا", "fa").words, 2);
  assert.equal(textStats("سلام دنیا", "fa").characters, 9);
  assert.equal(textStats("🙂").characters, 1);
  assert.equal(textStats("word ".repeat(201)).minutes, 2);
});
test("Stock demo rejects an overdraw or fractional input without changing balance", () => {
  assert.equal(stockMovement(24, 3, "in"), 27);
  assert.equal(stockMovement(24, 24, "out"), 0);
  assert.throws(() => stockMovement(24, 25, "out"), /insufficient/);
  for (const n of [0, -1, NaN, 1.5, Infinity])
    assert.throws(() => stockMovement(24, n, "in"));
});
test("Both static routes include the real content and language alternatives without JS", async () => {
  const en = await readFile("index.html", "utf8"),
    fa = await readFile("fa/index.html", "utf8");
  assert.match(en, /<html dir="ltr" lang="en">/);
  assert.match(fa, /<html dir="rtl" lang="fa">/);
  assert.match(fa, />سلام، من مهدی‌ام\.</);
  assert.match(
    fa,
    /<link rel="canonical" href="https:\/\/mehdieslami.ir\/fa\/">/,
  );
  for (const html of [en, fa]) {
    for (const anchor of ["work", "about", "contact", "lab", "day"])
      assert.match(html, new RegExp(`id="${anchor}"`));
    for (const project of [
      "dearlater",
      "didgah",
      "gorgan-warehouse",
      "yadban",
      "videofetch",
    ])
      assert.ok(html.includes(`https://github.com/MehdiEslami1221/${project}`));
    assert.match(html, /hreflang="fa"/);
    assert.match(html, /hreflang="en"/);
  }
  for (const asset of ["dearlater", "didgah"])
    await access(`assets/${asset}.webp`);
});
