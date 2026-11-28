# Space background and Programmer’s Day

Updated 27 November 2026. The portfolio is still a static GitHub Pages website. No runtime package, server, image/video download or paid service was added.

## Source and appearance

`app.js` owns one existing fixed 2D canvas (`#network`). The normal scene retains the original living circuit field and lime identity, with bounded twinkling stars, two perspective portal motifs (one on narrow screens), orbiting light points, short meteors and five tiny trailing pieces per meteor. Portals are a fictional design motif, not a claim of an observed astrophysical wormhole. The blog’s background is maintained in its separate repository.

The normal meteor schedule remains occasional; the command menu's meteor preview is available for deterministic visual inspection. At most one meteor is active. Its fragments use the same trajectory and expire with it. No physics engine or collision claims are implied: lighting is a distance-based screen-space response.

## Panel light coverage

The old fixed panel list missed service/date cards and asynchronously loaded blog cards. `registerPanels` now covers project, service, blog, résumé, countdown, quote, contact, portrait and tool discovery panels. A scoped child-list observer registers new cards when the blog feed arrives or language switching rebuilds it. It ignores its own overlays, avoids duplicates and drops disconnected entries. New panel types must be added to `panelSelector`.

Each outer panel gets one decorative, noninteractive, absolutely positioned `.meteor-reflection` overlay; do not add it to form controls or nested text leaves. CSS uses a local radial fill and a masked one-pixel rim. Canvas light sources (meteor head, fragments, orbital highlights and celebration particles) use viewport coordinates and the existing `meteorReflection` distance helper. The strongest nearby source controls position, color and intensity; far-away cards remain dark. Never make all cards flash uniformly.

Panel rectangles are refreshed at most 10 Hz, tracking scrolling within 100 ms. Frames only use cached measurements. Hidden tabs, reduced motion and pause clear the light. Dynamic blog registration must not destroy links, native text direction or language switching.

## Day 256

The existing `programmerDayState` remains the authority: the visitor’s device zone, 256th Gregorian day, leap years, whole-day celebration and annual rollover. The preview toggles only the scene; it never changes the countdown or calendar date. On the actual day the same scene starts automatically.

`body.celebrating` uses a scoped midnight palette: cyan, violet and warm gold, opaque-enough dark card surfaces, readable muted text, dark input backgrounds and high-contrast primary-button text (including hover). A bilingual normal-flow celebration badge spans both countdown columns. Do not put the event badge over form controls or change unrelated tool pages.

The celebration retains the base circuit/star field and adds three staggered low-intensity bursts plus bounded falling code symbols. Burst positions are deterministic and particles are reused analytically; no growing particle collection or bright full-screen flash is allowed. Nearby burst fragments also feed the panel-light system. Turning the preview off restores normal colors immediately.

The ordinary countdown now uses the time-chip presentation described in [COUNTDOWN.md](COUNTDOWN.md). It shares the existing panel reflection; normal-only styling must not override the accepted celebration scene.

## Motion and checks

Keep the existing 24 fps narrow-screen/30 fps desktop cap, bounded device pixel ratio and hidden-tab suspension. Reduced motion shows a static scene and hides reflections; no animation-pause buttons are added. Keep print output static.

Run `npm run build`, `npm test`, `node --check app.js` and `git diff --check`. Rebuild `fa/index.html`; never hand-edit it. Advance the homepage style/controller URL versions together. Inspect normal and celebration scenes in both languages, asynchronous blog cards, project filters, light proximity during scrolling, readable countdown/actions, 360px layout and OS reduced motion. Original supplied portraits, logos, résumés, launch behavior, public anchors, metadata and the native date engine remain unchanged.
