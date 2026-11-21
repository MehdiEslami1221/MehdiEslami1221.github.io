import test from "node:test";
import assert from "node:assert/strict";
import {
  programmerDayStart,
  programmerDayState,
  calendarEvent,
  contrastRatio,
  textStats,
  stockMovement,
  planMeteor,
  meteorPose,
  meteorReflection,
} from "../core.mjs";
import { readFile, access } from "node:fs/promises";
// Run the actual local-Date implementation in different runtime device zones.
// Explicit expectations catch accidental use of UTC, Tehran or the current offset.
import { spawnSync } from "node:child_process";
const coreURL = new URL("../core.mjs", import.meta.url).href;
function inZone(zone) {
  const script = `import {programmerDayStart,programmerDayState,calendarEvent} from ${JSON.stringify(coreURL)};
    const start=programmerDayStart(2027),leap=programmerDayStart(2028),end=new Date(2028,0,257).getTime();
    console.log(JSON.stringify({
      start:new Date(start).toISOString(),
      leapDate:[new Date(leap).getMonth()+1,new Date(leap).getDate()],
      centuryDate:new Date(programmerDayStart(2100)).getDate(),
      before:programmerDayState(leap-1).active,atStart:programmerDayState(leap).active,
      lastMillisecond:programmerDayState(end-1).active,after:programmerDayState(end).active,
      next:programmerDayState(end).target,expectedNext:programmerDayStart(2029),
      oneSecond:programmerDayState(start-1000).seconds,
      winterTarget:programmerDayState(Date.parse('2027-01-15T12:00:00Z')).target,
      sameInstant:programmerDayState(Date.parse('2027-09-12T23:00:00Z')).active,
      event:calendarEvent(leap)
    }));`;
  const child = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", script],
    { env: { ...process.env, TZ: zone }, encoding: "utf8", timeout: 15000 },
  );
  assert.equal(child.status, 0, child.stderr);
  return JSON.parse(child.stdout);
}
test("Local holidays follow six device zones, DST offsets, leap years and rollover", () => {
  const expected = {
    UTC: ["2027-09-13T00:00:00.000Z", false],
    "Asia/Tehran": ["2027-09-12T20:30:00.000Z", true],
    "Europe/Berlin": ["2027-09-12T22:00:00.000Z", true],
    "America/Los_Angeles": ["2027-09-13T07:00:00.000Z", false],
    "Asia/Tokyo": ["2027-09-12T15:00:00.000Z", true],
    "Pacific/Kiritimati": ["2027-09-12T10:00:00.000Z", true],
  };
  for (const [zone, [start, active]] of Object.entries(expected)) {
    const result = inZone(zone);
    assert.equal(result.start, start, zone);
    assert.equal(
      result.winterTarget,
      Date.parse(start),
      zone + " must use the holiday offset, not winter offset",
    );
    assert.equal(result.sameInstant, active, zone);
    assert.deepEqual(result.leapDate, [9, 12], zone);
    assert.equal(result.centuryDate, 13, zone + " 2100 is not a leap year");
    assert.equal(result.before, false, zone);
    assert.equal(result.atStart, true, zone);
    assert.equal(result.lastMillisecond, true, zone);
    assert.equal(result.after, false, zone);
    assert.equal(result.next, result.expectedNext, zone);
    assert.equal(result.oneSecond, 1, zone);
    assert.match(result.event, /DTSTART;VALUE=DATE:20280912\r\n/, zone);
    assert.match(result.event, /DTEND;VALUE=DATE:20280913\r\n/, zone);
  }
});
test("Calendar uses the local all-day date, exclusive end and RFC line breaks", () => {
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
  assert.match(fa, />سلام، من مهدی اسلامی هستم\.</);
  assert.match(
    fa,
    /<link rel="canonical" href="https:\/\/mehdieslami.ir\/fa\/">/,
  );
  for (const html of [en, fa]) {
    for (const anchor of ["work", "about", "contact", "lab", "day", "resume"])
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
  for (const asset of [
    "dearlater",
    "didgah",
    "warehouse",
    "yadban",
    "videofetch",
  ])
    await access(`assets/${asset}.webp`);
});

test("Meteors expire and nearby panels receive bounded, local reflected light", () => {
  const shot = planMeteor(1280, 900, () => 0.5),
    mobile = planMeteor(360, 780, () => 0.5);
  assert.equal(meteorPose(shot, -1), null);
  assert.equal(meteorPose(shot, shot.duration), null);
  assert.equal(meteorPose(shot, 0).alpha, 0);
  assert.ok(mobile.tail < shot.tail);
  assert.ok(mobile.gap > shot.gap);
  const pose = { x: 50, y: 100, alpha: 0.62 };
  const rect = { left: 100, right: 300, top: 50, bottom: 250 };
  const close = meteorReflection(rect, pose);
  const far = meteorReflection(rect, { ...pose, x: -1000 });
  assert.equal(close.x, -50);
  assert.equal(close.y, 50);
  assert.ok(close.strength > 0 && close.strength < 0.62);
  assert.equal(far.strength, 0);
  assert.equal(meteorReflection(rect, { ...pose, x: 150 }).strength, 0.62);
});
test("Four supplied PDFs remain valid downloads in both static languages", async () => {
  for (const lang of ["en", "fa"])
    for (const tone of ["dark", "light"]) {
      const path = `assets/resumes/mehdi-eslami-${lang}-${tone}.pdf`;
      const bytes = await readFile(path);
      assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
      assert.ok(bytes.length > 10000);
      for (const route of ["index.html", "fa/index.html"]) {
        const html = await readFile(route, "utf8");
        assert.ok(
          [...html.matchAll(/<a\b[^>]*>/g)].some(
            ([tag]) =>
              tag.includes(`href="/${path}"`) &&
              /\bdownload(?:\s|>|=)/.test(tag),
          ),
        );
      }
    }
});
