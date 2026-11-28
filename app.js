import {
  programmerDayState,
  calendarEvent,
  contrastRatio,
  textStats,
  stockMovement,
  planMeteor,
  meteorPose,
  meteorReflection,
} from "./core.mjs?v=20261128-architecture1";
import { HOME_SEO, SITE_URL, homeSchema } from "./seo.mjs?v=20261123-copy1";
import { quotes } from "./content/quotes.mjs?v=20261124-quotes1";
import { createQuoteRotation, QUOTE_INTERVAL } from "./quote-rotation.mjs?v=20261124-ring1";
import { createBlogSection } from "./blog.js?v=20261127-space1";
import { createArchitectureScene, drawArchitectureScene } from "./architecture-scene.mjs?v=20261128-architecture1";
("use strict");
const $ = (selector) => document.querySelector(selector);
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const save = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};
let lang = document.documentElement.lang;
const blogSection = createBlogSection($("#blog"), () => lang);
const tr = (en, fa) => (lang === "fa" ? fa : en);
function message(selector, en, fa) {
  const el = $(selector);
  el.dataset.en = en;
  el.dataset.fa = fa;
  el.textContent = tr(en, fa);
}
let paused = reduced.matches;
function syncMotionPreference() {
  document.body.classList.toggle("motion-paused", paused);
}
syncMotionPreference();

const form = $("#project-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  const contact = String(data.get("contact")).trim();
  const details = String(data.get("details")).trim();
  if (!name || !contact || details.length < 10) {
    $("#handoff").hidden = false;
    message(
      "#form-status",
      "Please enter your name, contact details and at least 10 characters about the project.",
      "نام و راه تماس خود را وارد کنید. توضیحات پروژه هم باید دست‌کم ۱۰ حرف یا نشانه داشته باشد.",
    );
    return;
  }
  const brief = [
    tr(
      "Project inquiry from mehdieslami.ir",
      "درخواست پروژه از mehdieslami.ir",
    ),
    `${tr("Name", "نام")}: ${name}`,
    `${tr("Contact", "اطلاعات تماس")}: ${contact}`,
    `${tr("Project", "پروژه")}: ${form.elements.type.selectedOptions[0].textContent}`,
    "",
    details,
  ].join("\n");
  const channel = event.submitter?.value || "telegram";
  const url =
    channel === "email"
      ? `mailto:P30lod@gmail.com?subject=${encodeURIComponent("Project inquiry — " + name)}&body=${encodeURIComponent(brief)}`
      : `https://t.me/Mr_MehdiEslami?text=${encodeURIComponent(brief)}`;
  $("#brief").value = brief;
  $("#handoff-link").href = url;
  $("#handoff").hidden = false;
  message(
    "#form-status",
    "Your brief is ready. Press send in Telegram or your email app to finish. If the app did not open, use the link below or copy the text.",
    "متن پیام آماده شد. برای ارسال درخواست، آن را در تلگرام یا ایمیل بفرستید. اگر برنامه باز نشد، از لینک پایین یا گزینهٔ کپی متن استفاده کنید.",
  );
  if (channel === "email") window.location.href = url;
  else window.open(url, "_blank", "noopener,noreferrer");
});
$("#copy-brief").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#brief").value);
    message(
      "#form-status",
      "Copied. Paste the brief into your message or email.",
      "متن کپی شد. می‌توانید آن را در پیام یا ایمیل خود جای‌گذاری کنید.",
    );
  } catch {
    $("#brief").focus();
    $("#brief").select();
    message(
      "#form-status",
      "Text selected. Use your device’s copy command.",
      "متن انتخاب شد. از گزینهٔ کپی دستگاه خود استفاده کنید.",
    );
  }
});

// All entries are shown before the cycle repeats. Hover/focus never stop rotation.
let quoteIndex = 0;
let quoteRingAnimation;
const quoteRing = $("#quote-ring-fill");
function animateQuoteRing(fraction, running) {
  quoteRingAnimation?.cancel();
  const offset = String((1 - fraction) * 100);
  quoteRing.style.strokeDashoffset = offset;
  if (running && !reduced.matches && typeof quoteRing.animate === "function") {
    // Let the browser interpolate every frame; the text clock never drives the ring.
    quoteRingAnimation = quoteRing.animate(
      [{ strokeDashoffset: offset }, { strokeDashoffset: "100" }],
      { duration: fraction * QUOTE_INTERVAL, easing: "linear", fill: "forwards" },
    );
  }
}
const quoteRotation = createQuoteRotation({
  count: quotes.length,
  onChange(index) {
    quoteIndex = index;
    renderCurrentQuote();
    const body = $(".quote-body");
    body.classList.remove("changing");
    if (!reduced.matches) {
      void body.offsetWidth;
      body.classList.add("changing");
    }
  },
  onTick(fraction, seconds) {
    const counter = $("#quote-countdown");
    const text = new Intl.NumberFormat(lang).format(seconds);
    if (counter.textContent !== text) counter.textContent = text;
    if (reduced.matches || typeof quoteRing.animate !== "function")
      quoteRing.style.strokeDashoffset = String((1 - seconds / (QUOTE_INTERVAL / 1000)) * 100);
  },
  onState: animateQuoteRing,
});
$("#quote-next").addEventListener("click", () => quoteRotation.next());
if (!document.hidden) quoteRotation.start();

// Ordinary code architecture and the retained Programmer's Day circuit/space scene.
// Cap pixel density, connections and frame rate; stop all timers when the tab is hidden.
const canvas = $("#network");
const ctx = canvas.getContext("2d");
let width = 0,
  height = 0,
  nodes = [],
  paths = [],
  raf = 0,
  last = 0,
  time = 0;
const pointer = { x: -1000, y: -1000 };
const tokens = ["{ }", "</>", "01", "=>", "API", "λ"];
let architectureScene;
function resize() {
  if (!ctx) return;
  const bounds = canvas.parentElement.getBoundingClientRect();
  width = bounds.width;
  height = bounds.height;
  const density = Math.min(
    window.devicePixelRatio || 1,
    width < 700 ? 1.25 : 1.5,
  );
  clearMeteor();
  canvas.width = Math.round(width * density);
  canvas.height = Math.round(height * density);
  ctx.setTransform(density, 0, 0, density, 0, 0);
  architectureScene = createArchitectureScene(width, height);
  lastLightMeasure = -1;
  const count = width < 700 ? 23 : 46;
  nodes = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: i % 7 === 0 ? 2 : 1,
    phase: Math.random() * 6.28,
  }));
  paths = [];
  nodes.forEach((node, i) => {
    const nearest = nodes
      .map((n, j) => ({ j, d: Math.hypot(n.x - node.x, n.y - node.y) }))
      .filter((n) => n.j > i && n.d < Math.max(180, width * 0.18))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    nearest.forEach((n) =>
      paths.push({
        a: i,
        b: n.j,
        phase: Math.random(),
        speed: 0.035 + Math.random() * 0.035,
      }),
    );
  });
  draw();
}
// Draw a short distance along an existing connection, so packets follow its bends.
function pointOnTrace(points, progress) {
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let distance =
    Math.max(0, Math.min(1, progress)) * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const ratio = lengths[i] ? distance / lengths[i] : 0;
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * ratio,
        y: points[i].y + (points[i + 1].y - points[i].y) * ratio,
      };
    }
    distance -= lengths[i];
  }
  return points[0];
}
const fieldPointer = { x: 0, y: 0 };
function drawLivingField() {
  const mobile = width < 700;
  const hasPointer = !paused && pointer.x >= 0;
  const targetX = hasPointer ? (pointer.x / width - 0.5) * 16 : 0;
  const targetY = hasPointer ? (pointer.y / height - 0.5) * 12 : 0;
  if (paused) {
    fieldPointer.x = 0;
    fieldPointer.y = 0;
  } else {
    fieldPointer.x += (targetX - fieldPointer.x) * 0.045;
    fieldPointer.y += (targetY - fieldPointer.y) * 0.045;
  }
  ctx.save();
  // Two slow pools of light give the flat circuit field a little depth.
  for (const [x, y, rgb, phase] of [
    [width * 0.2, height * 0.35, "94,170,105", 0],
    [width * 0.8, height * 0.65, "54,126,142", 2],
  ]) {
    const gx = x + Math.sin(time * 0.09 + phase) * width * 0.06,
      gy = y + Math.cos(time * 0.08 + phase) * height * 0.05;
    const glow = ctx.createRadialGradient(
      gx,
      gy,
      0,
      gx,
      gy,
      Math.max(width, height) * 0.48,
    );
    glow.addColorStop(0, `rgba(${rgb},.065)`);
    glow.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }
  const drifting = nodes.map((n) => ({
    x: n.x + Math.sin(time * 0.19 + n.phase) * 8 + fieldPointer.x,
    y: n.y + Math.cos(time * 0.15 + n.phase) * 7 + fieldPointer.y,
  }));
  paths.forEach((path, i) => {
    const a = drifting[path.a],
      b = drifting[path.b];
    const points = [
      a,
      { x: a.x + (b.x - a.x) * 0.34, y: a.y },
      { x: a.x + (b.x - a.x) * 0.66, y: b.y },
      b,
    ];
    const distance = hasPointer
      ? Math.hypot((a.x + b.x) / 2 - pointer.x, (a.y + b.y) / 2 - pointer.y)
      : 1000;
    const focus = Math.max(0, 1 - distance / 250);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = `rgba(151,202,117,${0.09 + focus * 0.17})`;
    ctx.stroke();
    if (i % (mobile ? 3 : 2) !== 0) return;
    const progress = (time * path.speed + path.phase) % 1;
    const head = pointOnTrace(points, progress),
      tail = pointOnTrace(points, Math.max(0, progress - 0.13));
    if (Math.hypot(head.x - tail.x, head.y - tail.y) > 0.1) {
      const trail = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      trail.addColorStop(0, "rgba(188,243,106,0)");
      trail.addColorStop(1, `rgba(188,243,106,${0.5 + focus * 0.2})`);
      ctx.strokeStyle = trail;
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(188,243,106,.08)";
    ctx.beginPath();
    ctx.arc(head.x, head.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(216,255,167,${0.6 + focus * 0.2})`;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 1.3, 0, Math.PI * 2);
    ctx.fill();
  });
  drifting.forEach((node, i) => {
    const breath = 0.23 + (Math.sin(time * 0.6 + nodes[i].phase) + 1) * 0.09;
    ctx.fillStyle = `rgba(176,224,137,${breath})`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodes[i].r, 0, Math.PI * 2);
    ctx.fill();
    if (i % 8 === 0) {
      const pulse = (time * 0.13 + nodes[i].phase / 6.28) % 1;
      ctx.strokeStyle = `rgba(188,243,106,${(1 - pulse) * 0.16})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4 + pulse * 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(158,193,143,.24)";
      ctx.fillText(tokens[(i / 8) % tokens.length], node.x + 12, node.y - 10);
    }
  });
  // A small orbit, rather than a full-screen effect, keeps the text readable.
  const cx = width * (mobile ? 0.7 : 0.77) + fieldPointer.x * 1.5,
    cy = height * 0.44 + fieldPointer.y * 1.5;
  const rx = mobile ? 105 : Math.min(width * 0.15, 230),
    ry = rx * 0.4,
    angle = -0.45;
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = "rgba(142,196,148,.12)";
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(93,162,169,.10)";
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * 0.76, ry * 1.35, 0.4, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 2; i++) {
    const phase = time * 0.14 + i * Math.PI;
    const x = Math.cos(phase) * rx,
      y = Math.sin(phase) * ry;
    ctx.fillStyle = i ? "rgba(109,200,208,.55)" : "rgba(188,243,106,.65)";
    ctx.beginPath();
    ctx.arc(x, y, i ? 1.7 : 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
// Include asynchronously rendered cards; one overlay per outer panel.
const panelSelector = ".project, .service-tile, .blog-post-card, .day-card, .lab-surface, .resume-card, #project-form, .profile-discovery, .date-discovery, .quote-panel, .portrait-frame";
const reflectivePanels = [];
function registerPanels(scope = document) {
  const candidates = [...scope.querySelectorAll(panelSelector)];
  if (scope instanceof Element && scope.matches(panelSelector)) candidates.push(scope);
  for (const element of candidates) {
    if (element.classList.contains("meteor-reactive")) continue;
    element.classList.add("meteor-reactive");
    const light = document.createElement("span");
    light.className = "meteor-reflection";
    light.setAttribute("aria-hidden", "true");
    element.append(light);
    reflectivePanels.push({ element, light, rect: null });
  }
}
registerPanels();
const panelObserver = new MutationObserver(records => {
  for (const record of records) for (const node of record.addedNodes)
    if (node instanceof Element && !node.classList.contains("meteor-reflection")) registerPanels(node);
  for (let i = reflectivePanels.length - 1; i >= 0; i--)
    if (!reflectivePanels[i].element.isConnected) reflectivePanels.splice(i, 1);
});
panelObserver.observe(document.querySelector("main"), { childList: true, subtree: true });
let activeMeteor = null,
  nextMeteorAt = 7 + Math.random() * 4,
  lastLightMeasure = -1;
function clearMeteor() {
  activeMeteor = null;
  nextMeteorAt = time + 7 + Math.random() * 4;
  reflectivePanels.forEach(({ light }) => {
    light.style.opacity = "0";
  });
}
function drawMeteor() {
  if (paused || reduced.matches || document.hidden) {
    clearMeteor();
    return null;
  }
  if (!activeMeteor && time >= nextMeteorAt) {
    activeMeteor = { ...planMeteor(width, height), started: time };
    nextMeteorAt = time + activeMeteor.duration + activeMeteor.gap;
    lastLightMeasure = -1;
  }
  if (!activeMeteor) return null;
  const pose = meteorPose(activeMeteor, time - activeMeteor.started);
  if (!pose) {
    activeMeteor = null;
    reflectivePanels.forEach(({ light }) => {
      light.style.opacity = "0";
    });
    return null;
  }
  const { x, y, tailX, tailY, alpha } = pose;
  ctx.save();
  const trail = ctx.createLinearGradient(tailX, tailY, x, y);
  trail.addColorStop(0, "rgba(120,220,150,0)");
  trail.addColorStop(0.75, `rgba(173,240,121,${alpha * 0.55})`);
  trail.addColorStop(1, `rgba(225,255,200,${alpha})`);
  ctx.strokeStyle = trail;
  ctx.lineWidth = 1.7;
  ctx.lineCap = "round";
  ctx.shadowColor = "#bcf36a";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = `rgba(228,255,210,${alpha})`;
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Tiny pieces travel behind the same head; each can illuminate a nearby edge.
  const lights = [{ ...pose, rgb: "188,243,106" }];
  for (let i = 1; i <= 5; i++) {
    const fragment = meteorPose(activeMeteor, time - activeMeteor.started - i * .045);
    if (!fragment) continue;
    fragment.y += Math.sin(i * 6.7) * i * 2;
    fragment.alpha *= .45;
    ctx.fillStyle = `rgba(204,246,171,${fragment.alpha})`;
    ctx.fillRect(fragment.x, fragment.y, 1.4, 1.4);
    lights.push({ ...fragment, rgb: "188,243,106" });
  }
  return lights;
}
function updateReflections(lights) {
  if (paused || reduced.matches || document.hidden || !lights.length) {
    reflectivePanels.forEach(({ light }) => light.style.opacity = "0");
    return;
  }
  // Rectangles track scrolling and newly mounted cards, at most ten times/second.
  if (lastLightMeasure < 0 || time - lastLightMeasure >= .1) {
    reflectivePanels.forEach(panel => panel.rect = panel.element.getBoundingClientRect());
    lastLightMeasure = time;
  }
  for (const { element, light, rect } of reflectivePanels) {
    if (!rect || !rect.width || !rect.height || rect.bottom < 0 || rect.top > height || element.hidden) {
      light.style.opacity = "0"; continue;
    }
    let strongest = { strength: 0, x: 0, y: 0, rgb: "188,243,106" };
    for (const source of lights) {
      const reflection = meteorReflection(rect, source, width < 700 ? 210 : 310);
      if (reflection.strength > strongest.strength) strongest = { ...reflection, rgb: source.rgb };
    }
    light.style.setProperty("--light-x", `${strongest.x.toFixed(1)}px`);
    light.style.setProperty("--light-y", `${strongest.y.toFixed(1)}px`);
    light.style.setProperty("--light-rgb", strongest.rgb);
    light.style.opacity = Math.min(1, strongest.strength * 1.5).toFixed(3);
  }
}
// The portal is a design motif, not a claim of an observed astrophysical wormhole.
function drawSpaceScene(celebration) {
  const lights = [];
  const colors = celebration ? ["119,219,247", "193,166,255", "245,203,124"] : ["117,205,197", "188,243,106"];
  const mobile = width < 700;
  // A deterministic star field avoids allocations or flicker on each frame.
  for (let i = 0; i < (mobile ? 48 : 105); i++) {
    const x = ((i * 127.31 + 39) % 997) / 997 * width;
    const y = ((i * 73.77 + 17) % 991) / 991 * height;
    const twinkle = .16 + (Math.sin(time * .7 + i * 2.3) + 1) * .11;
    ctx.fillStyle = `rgba(199,225,221,${twinkle})`;
    ctx.beginPath(); ctx.arc(x,y,i % 13 === 0 ? 1.3 : .65,0,Math.PI*2); ctx.fill();
    if(i % 19 === 0) {
      ctx.strokeStyle = `rgba(186,227,217,${twinkle*.6})`;
      ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.moveTo(x,y-3);ctx.lineTo(x,y+3);ctx.stroke();
    }
  }
  for(let portal = 0; portal < (mobile ? 1 : 2); portal++) {
    const cx = width * (portal ? .83 : .18), cy = height*(portal ? .65 : .32);
    const radius = mobile ? 68 : Math.min(width*.075,115);
    const rgb = colors[portal % colors.length];
    ctx.save();ctx.translate(cx,cy);ctx.rotate(portal ? .6 : -.5);
    const glow=ctx.createRadialGradient(0,0,0,0,0,radius*2.1);
    glow.addColorStop(0,`rgba(${rgb},.015)`);glow.addColorStop(.45,`rgba(${rgb},.05)`);glow.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle=glow;ctx.fillRect(-radius*2.2,-radius*2.2,radius*4.4,radius*4.4);
    for(let ring=0;ring<10;ring++) {
      const phase=(ring/10+time*.035)%1, scale=.15+phase*.85;
      ctx.strokeStyle=`rgba(${rgb},${Math.sin(phase*Math.PI)*.15})`;ctx.lineWidth=.65;
      ctx.beginPath();ctx.ellipse(0,0,radius*scale,radius*scale*.48,0,0,Math.PI*2);ctx.stroke();
    }
    const angle=time*.24+portal*2;
    const px=Math.cos(angle)*radius,py=Math.sin(angle)*radius*.48;
    ctx.fillStyle=`rgba(${rgb},.65)`;ctx.beginPath();ctx.arc(px,py,1.6,0,Math.PI*2);ctx.fill();
    ctx.font="9px monospace";ctx.fillStyle=`rgba(${rgb},.27)`;ctx.fillText(portal ? "0x100" : "{ universe }",-radius*.6,radius*.8);
    ctx.restore();
    const rot=portal ? .6 : -.5;
    lights.push({ x: cx+px*Math.cos(rot)-py*Math.sin(rot), y: cy+px*Math.sin(rot)+py*Math.cos(rot), alpha: .2, rgb });
  }
  if(celebration && !paused) {
    // Three staggered, soft bursts. No full-screen flashes or unbounded particles.
    for(let burst=0;burst<3;burst++) {
      const phase=(time*.16+burst/3)%1;
      const cx=width*(.18+burst*.32),cy=height*(.24+(burst%2)*.22);
      const rgb=colors[burst];
      const count=mobile?16:30;
      for(let j=0;j<count;j++) {
        const angle=j/count*Math.PI*2+burst;
        const speed=35+(j%4)*13;
        const x=cx+Math.cos(angle)*speed*phase*2.2;
        const y=cy+Math.sin(angle)*speed*phase*2.2+55*phase*phase;
        const alpha=Math.sin(phase*Math.PI)*.65;
        ctx.strokeStyle=`rgba(${rgb},${alpha})`;ctx.lineWidth=j%4===0?1.8:1;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(angle)*5*(1-phase),y-Math.sin(angle)*5*(1-phase));ctx.stroke();
        if(j%6===0) lights.push({x,y,alpha:alpha*.7,rgb});
      }
    }
    ctx.font="11px monospace";
    for(let i=0;i<(mobile?9:18);i++) {
      ctx.fillStyle=`rgba(${colors[i%3]},.32)`;
      ctx.fillText(["256","</>","{ }","✦"][i%4],(i*137.3)%width,((i*81+time*(7+i%4))%(height+40))-20);
    }
  }
  return lights;
}

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  const celebration = document.body.classList.contains("celebrating");
  let lights;
  if (celebration) {
    drawLivingField();
    lights = drawSpaceScene(true);
  } else {
    lights = drawArchitectureScene(ctx, architectureScene, time, pointer, paused);
  }
  const meteor = drawMeteor();
  if (meteor) lights.push(...meteor);
  updateReflections(lights);
}

function frame(timestamp) {
  raf = 0;
  if (paused || document.hidden || !ctx) return;
  const interval = width < 700 ? 1000 / 24 : 1000 / 30;
  if (timestamp - last >= interval) {
    time += Math.min((timestamp - last) / 1000, 0.1);
    draw();
    last = timestamp;
  }
  raf = requestAnimationFrame(frame);
}
function start() {
  if (!raf && !paused && !document.hidden && ctx) {
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
}
function stop() {
  clearMeteor();
  cancelAnimationFrame(raf);
  raf = 0;
  draw();
}
window.addEventListener(
  "pointermove",
  (event) => {
    if (event.pointerType === "mouse") {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }
  },
  { passive: true },
);
document.addEventListener("pointerleave", () => {
  pointer.x = -1000;
  pointer.y = -1000;
});
document.addEventListener("visibilitychange", () => {
  document.hidden ? stop() : start();
  document.hidden ? quoteRotation.stop() : quoteRotation.start();
});
reduced.addEventListener("change", (event) => {
  paused = event.matches;
  syncMotionPreference();
  quoteRotation.refresh();
  paused ? stop() : start();
});
let resizeTimer;
window.addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  },
  { passive: true },
);
resize();
start();

// Language changes preserve the viewport and all in-progress browser tools.
function localize(scope = document) {
  scope
    .querySelectorAll("[data-en][data-fa]")
    .forEach((el) => (el.textContent = el.dataset[lang]));
  for (const [data, attr] of [
    ["placeholder", "placeholder"],
    ["aria", "aria-label"],
    ["alt", "alt"],
    ["href", "href"],
  ])
    scope
      .querySelectorAll(`[data-${data}-en]`)
      .forEach((el) =>
        el.setAttribute(attr, el.dataset[data + (lang === "fa" ? "Fa" : "En")]),
      );
}
function setLanguage(next, updateHistory = true) {
  const anchor = [...document.querySelectorAll("main > section")].find(
    (el) => el.getBoundingClientRect().bottom > 0,
  );
  const before = anchor?.getBoundingClientRect().top;
  lang = next;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  localize();
  blogSection.render();
  save("portfolio-language", lang);
  const switcher = $(".language-switch");
  switcher.textContent = lang === "fa" ? "EN" : "فارسی";
  switcher.href = lang === "fa" ? "/" : "/fa/";
  switcher.lang = lang === "fa" ? "en" : "fa";
  switcher.hreflang = switcher.lang;
  const path = lang === "fa" ? "/fa/" : "/";
  if (updateHistory) history.pushState(null, "", path + location.hash);
  const { title, description, imageAlt } = HOME_SEO[lang];
  document.title = title;
  $('meta[name="description"]').content = description;
  $('link[rel="canonical"]').href = SITE_URL + path;
  $('meta[property="og:url"]').content = "https://mehdieslami.ir" + path;
  $('meta[property="og:locale"]').content = lang === "fa" ? "fa_IR" : "en_US";
  for (const query of [
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
  ])
    $(query).content = title;
  for (const query of [
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ])
    $(query).content = description;
  $('meta[property="og:locale:alternate"]').content =
    lang === "fa" ? "en_US" : "fa_IR";
  $('meta[property="og:image:alt"]').content = imageAlt;
  $('meta[name="twitter:image:alt"]').content = imageAlt;
  $("#site-schema").textContent = JSON.stringify(homeSchema(lang));
  syncMotionPreference();
  renderCurrentQuote();
  quoteRotation.refresh();
  updateDay();
  filterProjects();
  updateText();
  updateContrast();
  if ($("#project-dialog").open && activeProject) renderProject(activeProject);
  if ($("#command-dialog").open) renderCommands();
  if (anchor && before !== undefined)
    window.scrollBy({
      top: anchor.getBoundingClientRect().top - before,
      behavior: "instant",
    });
}
$(".language-switch").addEventListener("click", (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  setLanguage(lang === "fa" ? "en" : "fa");
});
window.addEventListener("popstate", () => {
  setLanguage(location.pathname.startsWith("/fa") ? "fa" : "en", false);
  syncProjectHash();
});
function renderCurrentQuote() {
  const q = quotes[quoteIndex];
  $("#quote-text").textContent = tr(q.text, q.fa);
  $("#quote-author").textContent = tr(q.author, q.faAuthor);
  $("#quote-avatar").textContent = q.initials;
  $("#quote-source").href = q.source;
  $("#quote-text").lang = lang;
  const number = new Intl.NumberFormat(lang, { minimumIntegerDigits: 2 });
  $("#quote-index").textContent = `${number.format(quoteIndex + 1)} / ${number.format(quotes.length)}`;
}

// Day 256 starts at local midnight in the visitor’s device zone.
let previewCelebration = false;
let dayTimer;
function updateDay() {
  const state = programmerDayState();
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  $("#day-zone").textContent = zone;
  document.body.classList.toggle(
    "celebrating",
    state.active || previewCelebration,
  );
  $("#day-date").textContent = new Intl.DateTimeFormat(
    lang === "fa" ? "fa-IR" : "en-GB",
    { timeZone: zone, dateStyle: "full" },
  ).format(new Date(state.target));
  $("#day-message").textContent = state.active
    ? tr(
        "Happy Programmer’s Day. Keep building.",
        "روز برنامه‌نویس مبارک؛ روزی برای گرامی‌داشت خلاقیت و تلاش برنامه‌نویسان.",
      )
    : previewCelebration
      ? tr(
          "A sneak peek. The countdown is still real.",
          "پیش‌نمایش جشن فعال است. شمارش معکوس، زمان واقعی تا روز برنامه‌نویس را نشان می‌دهد.",
        )
      : tr("Until the next day 256", "تا روز برنامه‌نویس بعدی");
  for (const key of ["days", "hours", "minutes", "seconds"]) {
    const element = $("#count-" + key);
    const value = new Intl.NumberFormat(
      lang === "fa" ? "fa" : "en",
      { minimumIntegerDigits: key === "days" ? 1 : 2, useGrouping: false },
    ).format(state[key]);
    if (element.textContent !== value) {
      element.textContent = value;
      if (!reduced.matches && !document.hidden && !document.body.classList.contains("celebrating"))
        element.animate?.([{ opacity: .55, transform: "translateY(3px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 180, easing: "ease-out" });
    }
  }
  const percent = Math.round(state.progress * 1000) / 10;
  const progress = $("#day-cycle-progress");
  const percentText = new Intl.NumberFormat(lang === "fa" ? "fa" : "en", { style: "percent", maximumFractionDigits: 1 }).format(percent / 100);
  $("#day-cycle").hidden = false;
  $("#day-cycle-value").textContent = percentText;
  progress.setAttribute("aria-valuenow", String(percent));
  progress.setAttribute("aria-valuetext", tr(`${percentText} of the annual cycle`, `${percentText} از فاصلهٔ بین دو جشن`));
  $("#day-circuit-progress").style.strokeDashoffset = String(100 - state.progress * 100);
  const preview = $("#celebrate-preview");
  preview.textContent = previewCelebration
    ? tr("End preview", "پایان پیش‌نمایش")
    : tr("Preview the celebration", "پیش‌نمایش جشن");
  preview.setAttribute("aria-pressed", String(previewCelebration));
  draw();
}
function scheduleDay() {
  clearInterval(dayTimer);
  if (!document.hidden) dayTimer = setInterval(updateDay, 1000);
}
$("#celebrate-preview").addEventListener("click", () => {
  previewCelebration = !previewCelebration;
  updateDay();
});
$("#calendar-save").addEventListener("click", () => {
  const blob = new Blob([calendarEvent(programmerDayState().target)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "programmers-day.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateDay();
  scheduleDay();
});

// No remote search: the five source links and their descriptions are in HTML.
let projectFilter = "all";
const categories = {
  dearlater: "web",
  didgah: "web",
  warehouse: "web",
  yadban: "web",
  videofetch: "backend",
};
function filterProjects() {
  const query = $("#project-search").value.trim().toLocaleLowerCase();
  let visible = 0;
  document.querySelectorAll("article.project").forEach((card) => {
    const match =
      (projectFilter === "all" ||
        categories[card.dataset.project] === projectFilter) &&
      (
        card.textContent +
        " " +
        [...card.querySelectorAll("[data-en][data-fa]")]
          .map((el) => el.dataset.en + " " + el.dataset.fa)
          .join(" ")
      )
        .toLocaleLowerCase()
        .includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  $("#project-results").textContent = visible
    ? tr(
        `${visible} ${visible === 1 ? "project" : "projects"} found`,
        `${new Intl.NumberFormat("fa").format(visible)} پروژه یافت شد`,
      )
    : tr(
        "No matches. Try a different word.",
        "پروژه‌ای یافت نشد. نام یا عبارت دیگری را جست‌وجو کنید.",
      );
  $(".projects").classList.toggle(
    "filtered",
    projectFilter !== "all" || !!query,
  );
}
$("#project-search").addEventListener("input", filterProjects);
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    projectFilter = button.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    filterProjects();
  }),
);

// Small tools keep all user content in the current tab.
let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 3500);
}
async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    toast(tr("Copied.", "کپی شد."));
  } catch {
    toast(
      tr(
        "Copy is unavailable here. Select the text and copy it.",
        "کپی خودکار در دسترس نیست. متن را انتخاب و کپی کنید.",
      ),
    );
  }
}
for (const button of document.querySelectorAll("[data-lab]"))
  button.addEventListener("click", () => {
    const id = button.dataset.lab;
    document
      .querySelectorAll("[data-lab]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    document
      .querySelectorAll("[data-lab-panel]")
      .forEach((p) => (p.hidden = p.dataset.labPanel !== id));
  });
function formatJSON(compact) {
  try {
    $("#json-input").value = JSON.stringify(
      JSON.parse($("#json-input").value),
      null,
      compact ? 0 : 2,
    );
    message("#json-status", "Valid JSON.", "ساختار JSON معتبر است.");
    $("#json-status").classList.remove("error");
  } catch {
    message(
      "#json-status",
      "This JSON has a syntax error. Check quotes, commas and brackets.",
      "ساختار JSON معتبر نیست. علامت‌های نقل‌قول، ویرگول‌ها و آکولادها را بررسی کنید.",
    );
    $("#json-status").classList.add("error");
  }
}
$("#json-format").addEventListener("click", () => formatJSON(false));
$("#json-minify").addEventListener("click", () => formatJSON(true));
$("#json-copy").addEventListener("click", () =>
  copyText($("#json-input").value),
);
function updateText() {
  const stats = textStats($("#text-input").value, lang);
  for (const [id, key] of [
    ["word-count", "words"],
    ["char-count", "characters"],
    ["read-time", "minutes"],
  ])
    $("#" + id).textContent = new Intl.NumberFormat(lang).format(stats[key]);
}
$("#text-input").addEventListener("input", updateText);
function updateContrast() {
  const fg = $("#foreground").value,
    bg = $("#background").value,
    ratio = contrastRatio(fg, bg);
  $("#contrast-preview").style.color = fg;
  $("#contrast-preview").style.backgroundColor = bg;
  $("#contrast-result").textContent =
    `${ratio.toFixed(2)}:1 · ` +
    (ratio >= 4.5
      ? tr("Meets WCAG AA for normal text", "معیار WCAG AA برای متن معمولی رعایت شده است")
      : ratio >= 3
        ? tr("AA for large text only", "معیار WCAG AA فقط برای متن درشت رعایت شده است")
        : tr(
            "Below AA. Try more contrast.",
            "معیار WCAG AA رعایت نشده است؛ تفاوت روشنایی متن و زمینه را افزایش دهید.",
          ));
}
$("#foreground").addEventListener("input", updateContrast);
$("#background").addEventListener("input", updateContrast);

// Native dialogs provide Escape, focus trapping and focus restoration.
const projectData = {
  dearlater: {
    name: "DearLater",
    stack: "Next.js · TypeScript · SQLite · Telegram",
    image: "dearlater",
    problem: [
      "Scheduled Telegram messages and sealed letters.",
      "ارسال پیام در زمان تعیین‌شده.",
    ],
    story: [
      "A bilingual app for scheduling Telegram messages and sending sealed letters. The recipient can view the envelope straight away and read the letter once its opening time arrives.",
      "برنامه‌ای دوزبانه برای پیام‌های زمان‌بندی‌شده و نامه‌های سربه‌مهر تلگرام. گیرنده ابتدا پاکت را می‌بیند و متن نامه پس از زمان تعیین‌شده در دسترس او قرار می‌گیرد.",
    ],
    decision: [
      "Opening time is checked on the server in the full app. Demo and live modes stay separate, and unknown delivery outcomes are never silently retried.",
      "در نسخهٔ کامل پروژه، زمان بازشدن نامه در سرور بررسی می‌شود. حالت نمایشی از ارسال واقعی جداست و اگر نتیجهٔ ارسال مشخص نباشد، برنامه آن را خودکار تکرار نمی‌کند.",
    ],
    scope: [
      "A single-owner local edition. A live Telegram session is required for real delivery.",
      "این نسخه روی دستگاه خودتان اجرا می‌شود و برای یک حساب کاربری طراحی شده است. ارسال پیام به اتصال حساب تلگرام نیاز دارد.",
    ],
    repo: "dearlater",
  },
  didgah: {
    name: "Didgah",
    stack: "Next.js · TypeScript · SQLite · PDF",
    image: "didgah",
    problem: [
      "Research questionnaires, response summaries and PDF reports.",
      "جمع‌آوری پاسخ‌ها و تهیهٔ گزارش پژوهشی.",
    ],
    story: [
      "A Persian research survey with 56 questions, a private researcher dashboard, descriptive charts and individual or combined PDF reports.",
      "پرسش‌نامهٔ پژوهشی فارسی با ۵۶ سؤال، پنل پژوهشگر، نمودارهای توصیفی و گزارش PDF برای هر پاسخ‌دهنده یا مجموعهٔ پاسخ‌ها.",
    ],
    decision: [
      "A submission token prevents duplicate responses when a request is retried. Draft recovery helps participants continue unfinished questionnaires.",
      "شناسهٔ ارسال از ثبت دوبارهٔ پاسخ جلوگیری می‌کند. ذخیرهٔ پیش‌نویس نیز به پاسخ‌دهنده امکان می‌دهد تکمیل پرسش‌نامه را بعداً ادامه دهد.",
    ],
    scope: [
      "A fixed research questionnaire, not a general form builder. Reports show descriptive statistics.",
      "این پروژه برای یک پرسش‌نامهٔ مشخص ساخته شده است و ابزار عمومی ساخت فرم نیست. گزارش‌ها، آمار توصیفی پاسخ‌ها را نمایش می‌دهند.",
    ],
    repo: "didgah",
  },
  warehouse: {
    image: "warehouse",
    name: "Gorgan Warehouse",
    stack: "Next.js · TypeScript · SQLite · Inventory",
    problem: [
      "Stock receipts, inventory and staff handovers.",
      "ثبت ورود کالا، کنترل موجودی و پیگیری تحویل.",
    ],
    story: [
      "A Persian warehouse application with stock receipts, departmental handovers, automatic document IDs, movement reports and printable receipts.",
      "سامانه‌ای فارسی برای ثبت ورود و تحویل کالا به واحدها؛ با شماره‌گذاری خودکار اسناد، گزارش گردش کالا و رسید قابل چاپ.",
    ],
    decision: [
      "Document lines and stock movements share one database transaction. An invalid line rolls back the operation; outgoing stock cannot exceed availability.",
      "ردیف‌های سند و تغییر موجودی در یک تراکنش ثبت می‌شوند. اگر یکی از ردیف‌ها خطا داشته باشد، کل عملیات لغو می‌شود. ثبت خروج بیش از موجودی نیز مجاز نیست.",
    ],
    scope: [
      "A local inventory application for one operator.",
      "سامانهٔ محلی مدیریت انبار برای استفادهٔ یک کاربر.",
    ],
    repo: "gorgan-warehouse",
  },
  yadban: {
    image: "yadban",
    name: "Yadban",
    stack: "Next.js · Cloudflare Workers · D1 · Web Push",
    problem: ["Installments, bills and recurring reminders.", "مدیریت موعدها و یادآوری کارهای روزمره."],
    story: [
      "A bilingual personal planner for installments, bills and recurring reminders, with calendar views and Web Push notifications in its full deployment.",
      "برنامه‌ای شخصی و دوزبانه برای اقساط، قبض‌ها و یادآوری‌های تکرارشونده؛ با تقویم و اعلان وب در نسخهٔ کامل پروژه.",
    ],
    decision: [
      "Recurrences, delivery retries and notification deduplication live in the Worker scheduler. The portfolio itself does not run that service.",
      "تکرار موعدها و تلاش دوباره برای ارسال اعلان، در زمان‌بند Worker مدیریت می‌شود. آن سرویس در این سایت شخصی اجرا نمی‌شود.",
    ],
    scope: [
      "Single-owner. Reminder delivery depends on the deployed scheduler and device permissions.",
      "این برنامه برای استفادهٔ شخصی طراحی شده است. برای دریافت یادآوری، سرویس زمان‌بندی باید فعال باشد و دستگاه اجازهٔ نمایش اعلان داشته باشد.",
    ],
    repo: "yadban",
  },
  videofetch: {
    image: "videofetch",
    name: "VideoFetch",
    stack: "Java · Spring Boot · Next.js · yt-dlp · FFmpeg",
    problem: [
      "Video information and download tracking.",
      "دریافت اطلاعات رسانه و مدیریت درخواست‌های دانلود.",
    ],
    story: [
      "A Spring Boot backend and Next.js interface for media metadata and download workflows.",
      "بک‌اند Spring Boot و رابط Next.js برای دریافت اطلاعات رسانه و مدیریت روند دانلود.",
    ],
    decision: [
      "When a platform requires sign-in or blocks a download, the app explains the error. Where supported, it can still retrieve video information using a fallback method.",
      "اگر پلتفرم اجازهٔ دانلود ندهد یا به ورود کاربر نیاز داشته باشد، برنامه دلیل خطا را نمایش می‌دهد. در صورت پشتیبانی، اطلاعات ویدئو از روش جایگزین دریافت می‌شود.",
    ],
    scope: [
      "Platform restrictions still apply. There is no real download service on this portfolio.",
      "محدودیت‌های پلتفرم‌ها همچنان برقرار است. این سایت شخصی سرویس دانلود ارائه نمی‌کند.",
    ],
    repo: "videofetch",
  },
};
let activeProject = null,
  envelopeTimer;
const escapeHTML = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function renderProject(id) {
  const p = projectData[id];
  if (!p) return;
  const phrase = (pair) => escapeHTML(tr(...pair));
  $("#project-content").innerHTML =
    `<h2 id="project-title">${escapeHTML(p.name)}</h2><p class="project-stack" dir="ltr">${p.stack}</p>${p.image ? `<figure class="case-image"><img src="/assets/${p.image}.webp" width="1348" height="${["warehouse", "yadban", "videofetch"].includes(p.image) ? 850 : 925}" data-capture-tone="${p.image === "videofetch" ? "dark" : "light"}" alt="${escapeHTML(tr("Capture of the running project interface", "تصویر رابط واقعی پروژه در حال اجرا"))}"><figcaption>${p.image === "videofetch" ? tr("Interface preview; backend disconnected.", "پیش‌نمایش رابط کاربری؛ بدون اتصال به بک‌اند.") : tr("Project preview with sample data.", "پیش‌نمایش پروژه با اطلاعات نمونه.")}</figcaption></figure>` : ""}<p class="case-lead">${phrase(p.problem)}</p><p>${phrase(p.story)}</p><div class="case-grid"><div><h3>${tr("Implementation", "نکتهٔ فنی")}</h3><p>${phrase(p.decision)}</p></div><div><h3>${tr("Current scope", "محدودهٔ فعلی")}</h3><p>${phrase(p.scope)}</p></div></div>${["dearlater", "didgah", "warehouse"].includes(id) ? `<section class="mini-demo"><h3>${tr("Try a short demo", "نمونهٔ تعاملی")}</h3><p class="small muted">${tr("Browser-only demonstration. It does not send messages or save real project records.", "این نمونه فقط در مرورگر اجرا می‌شود؛ پیامی ارسال نمی‌کند و اطلاعات واقعی پروژه را تغییر نمی‌دهد.")}</p>${demoMarkup(id)}</section>` : ""}<div class="tool-actions"><a class="button primary" href="https://github.com/MehdiEslami1221/${p.repo}" target="_blank" rel="noopener noreferrer">${tr("View source code", "مشاهدهٔ کد پروژه")}</a><button type="button" class="button secondary" id="share-project">${tr("Copy project link", "کپی لینک پروژه")}</button></div>`;
  $("#project-dialog").setAttribute("aria-labelledby", "project-title");
  $("#share-project").addEventListener("click", () =>
    copyText(
      "https://mehdieslami.ir" +
        (lang === "fa" ? "/fa/" : "/") +
        "#project-" +
        id,
    ),
  );
  bindDemo(id);
}
function demoMarkup(id) {
  if (id === "dearlater")
    return `<div class="envelope-demo"><div class="demo-envelope" id="demo-envelope"><div class="demo-flap"></div><div class="demo-letter" id="demo-letter">${tr("This is a sample sealed letter.", "این یک نامهٔ سربه‌مهر نمونه است.")}</div><div class="demo-seal" aria-hidden="true"><img src="/assets/logo.svg" alt="" width="32" height="24"></div></div><button type="button" id="unlock-demo" class="button primary">${tr("Seal a letter for 5 seconds", "مهرکردن نامه برای ۵ ثانیه")}</button><p id="envelope-status" role="status"></p></div>`;
  if (id === "didgah")
    return `<p>${tr("How much does a clear interface help your day?", "یک رابط کاربری قابل‌فهم تا چه اندازه انجام کار را آسان‌تر می‌کند؟")}</p><div class="demo-options">${[0, 1, 2, 3, 4].map((n) => `<button type="button" data-score="${n}" aria-pressed="false">${new Intl.NumberFormat(lang).format(n)}</button>`).join("")}</div><div class="demo-chart" aria-hidden="true">${[0, 1, 2, 3, 4].map((n) => `<i data-bar="${n}" style="--bar:8%"></i>`).join("")}</div><p id="survey-status" role="status">${tr("Choose a score from 0 to 4. This is your selection, not research data.", "امتیازی از ۰ تا ۴ انتخاب کنید. این انتخاب فقط برای نمایش عملکرد نمونه است و دادهٔ پژوهشی محسوب نمی‌شود.")}</p>`;
  return `<div class="stock-demo"><div><span>${tr("Sample stock", "موجودی نمونه")}</span><b id="demo-stock">24</b><span>${tr("notebooks", "دفتر")}</span></div><label>${tr("Quantity", "تعداد")}<input id="stock-quantity" type="number" min="1" max="1000" step="1" value="3"></label></div><div class="tool-actions"><button type="button" id="stock-in" class="button primary">${tr("Receive stock", "ثبت ورود")}</button><button type="button" id="stock-out" class="button secondary">${tr("Hand over stock", "ثبت خروج")}</button><button type="button" id="stock-reset" class="text-link">${tr("Reset example", "شروع دوباره")}</button></div><p id="stock-status" role="status"></p>`;
}
function bindDemo(id) {
  clearInterval(envelopeTimer);
  if (id === "dearlater")
    $("#unlock-demo").addEventListener("click", () => {
      const button = $("#unlock-demo");
      button.disabled = true;
      $("#demo-envelope").classList.remove("opened");
      const until = Date.now() + 5000;
      const tick = () => {
        const left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
        $("#envelope-status").textContent = left
          ? tr(
              `Sealed. Opening in ${left}…`,
              `مهرشده؛ ${new Intl.NumberFormat("fa").format(left)} ثانیه تا بازشدن…`,
            )
          : tr("The letter is ready to open.", "زمان تعیین‌شده به پایان رسید. نامه آمادهٔ مشاهده است.");
        if (!left) {
          clearInterval(envelopeTimer);
          $("#demo-envelope").classList.add("opened");
          button.disabled = false;
          button.textContent = tr("Try again", "تلاش دوباره");
        }
      };
      tick();
      envelopeTimer = setInterval(tick, 200);
    });
  if (id === "didgah")
    document.querySelectorAll("[data-score]").forEach((b) =>
      b.addEventListener("click", () => {
        document
          .querySelectorAll("[data-score]")
          .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        document
          .querySelectorAll("[data-bar]")
          .forEach((x) =>
            x.style.setProperty(
              "--bar",
              x.dataset.bar === b.dataset.score ? "95%" : "8%",
            ),
          );
        $("#survey-status").textContent = tr(
          `You chose ${b.dataset.score} out of 4. Only this tab changes.`,
          `امتیاز انتخاب‌شده: ${new Intl.NumberFormat("fa").format(+b.dataset.score)} از ۴. این انتخاب فقط در همین صفحه نمایش داده می‌شود.`,
        );
      }),
    );
  if (id === "warehouse") {
    let stock = 24;
    const show = () =>
      ($("#demo-stock").textContent = new Intl.NumberFormat(lang).format(
        stock,
      ));
    show();
    for (const direction of ["in", "out"])
      $("#stock-" + direction).addEventListener("click", () => {
        try {
          stock = stockMovement(stock, +$("#stock-quantity").value, direction);
          show();
          $("#stock-status").textContent = tr(
            "Sample movement recorded.",
            "ورود یا خروج کالا در نمونه ثبت شد.",
          );
        } catch (e) {
          $("#stock-status").textContent =
            e.message === "insufficient"
              ? tr(
                  "Not enough stock for this handover.",
                  "برای این خروج، موجودی کافی نیست.",
                )
              : tr(
                  "Enter a positive whole quantity.",
                  "یک عدد صحیح بزرگ‌تر از صفر وارد کنید.",
                );
        }
      });
    $("#stock-reset").addEventListener("click", () => {
      stock = 24;
      show();
      $("#stock-status").textContent = tr(
        "Example reset.",
        "موجودی نمونه به مقدار اولیه بازگشت.",
      );
    });
  }
}
function openProject(id, writeHash = true) {
  if (!projectData[id]) return;
  document.querySelectorAll("dialog[open]").forEach((d) => d.close());
  activeProject = id;
  renderProject(id);
  $("#project-dialog").showModal();
  if (writeHash) history.pushState(null, "", "#project-" + id);
}
function syncProjectHash() {
  const id = location.hash.replace("#project-", "");
  if (projectData[id]) {
    if (!$("#project-dialog").open || activeProject !== id)
      openProject(id, false);
  } else if ($("#project-dialog").open) $("#project-dialog").close();
}
document.addEventListener("click", (e) => {
  const opener = e.target.closest("[data-open-project]");
  if (opener) {
    e.preventDefault();
    openProject(opener.dataset.openProject);
  }
});
document
  .querySelectorAll("[data-close-dialog]")
  .forEach((b) =>
    b.addEventListener("click", () => b.closest("dialog").close()),
  );
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    clearInterval(envelopeTimer);
    if (
      dialog.id === "project-dialog" &&
      !dialog.open &&
      location.hash.startsWith("#project-")
    )
      history.replaceState(null, "", location.pathname + "#work");
  });
});
window.addEventListener("hashchange", syncProjectHash);

function commandList() {
  return [
    {
      en: "Website and software services",
      fa: "خدمات طراحی سایت و برنامه‌نویسی",
      keys: "services website programming سفارش خدمات",
      run: () => jump("#services"),
    },
    {
      en: "Watch a shooting star",
      fa: "نمایش شهاب",
      keys: "meteor shooting star شهاب",
      run: () => {
        if (
          !paused &&
          !reduced.matches &&
          !document.body.classList.contains("celebrating")
        )
          nextMeteorAt = time;
      },
    },
    {
      en: "Download my résumé",
      fa: "دریافت رزومه",
      keys: "resume cv رزومه فارسی انگلیسی",
      run: () => jump("#resume"),
    },
    {
      en: "Explore projects",
      fa: "مشاهدهٔ پروژه‌ها",
      keys: "work portfolio نمونه کار",
      run: () => jump("#work"),
    },
    {
      en: "Try the browser tools",
      fa: "استفاده از ابزارها",
      keys: "lab json text آزمایشگاه",
      run: () => jump("#lab"),
    },
    {
      en: "Make a profile name",
      fa: "ساخت متن پروفایل",
      keys: "profile ascii name fancy متن اسم اسکی پروفایل",
      run: () => location.assign(lang === "fa" ? "/fa/tools/profile-text/" : "/tools/profile-text/"),
    },
    {
      en: "About Mehdi",
      fa: "دربارهٔ مهدی",
      keys: "about skills درباره",
      run: () => jump("#about"),
    },
    {
      en: "Start a conversation",
      fa: "درخواست همکاری",
      keys: "contact email telegram تماس",
      run: () => jump("#contact"),
    },
    {
      en: "Preview Programmer’s Day",
      fa: "پیش‌نمایش جشن روز برنامه‌نویس",
      keys: "celebrate day 256 جشن",
      run: () => {
        previewCelebration = !previewCelebration;
        updateDay();
        jump("#day");
      },
    },
    {
      en: "Switch to Persian",
      fa: "تغییر به انگلیسی",
      keys: "language فارسی english زبان",
      run: () => setLanguage(lang === "fa" ? "en" : "fa"),
    },
    ...Object.entries(projectData).map(([id, p]) => ({
      en: p.name,
      fa: p.name,
      keys: "project پروژه " + p.stack,
      run: () => openProject(id),
    })),
  ];
}
function jump(hash) {
  location.hash = hash;
  document
    .querySelector(hash)
    ?.scrollIntoView({ behavior: paused ? "instant" : "smooth" });
}
function renderCommands() {
  const query = $("#command-input").value.trim().toLocaleLowerCase();
  const list = commandList().filter((c) =>
    (c.en + " " + c.fa + " " + c.keys).toLocaleLowerCase().includes(query),
  );
  const parent = $("#command-results");
  parent.replaceChildren();
  if (!list.length) {
    const p = document.createElement("p");
    p.textContent = tr(
      "No matches. Try another word.",
      "پروژه‌ای یافت نشد. نام یا عبارت دیگری را جست‌وجو کنید.",
    );
    parent.append(p);
  }
  list.forEach((command) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = tr(command.en, command.fa);
    b.addEventListener("click", () => {
      $("#command-dialog").close();
      command.run();
    });
    parent.append(b);
  });
}
function openCommands() {
  $("#command-input").value = "";
  renderCommands();
  $("#command-dialog").showModal();
  $("#command-input").focus();
}
$(".command-trigger").addEventListener("click", openCommands);
$("#command-input").addEventListener("input", renderCommands);
$("#command-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $("#command-results button")?.click();
  }
});
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if ($("#command-dialog").open) $("#command-dialog").close();
    else openCommands();
  }
});

// Subtle entrances, bounded pointer tilt, and a scroll marker. Text is always
// visible without JavaScript or when motion is paused.
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("entered");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      "article.project,.day-card,.lab-layout,.about-grid,.contact-grid",
    )
    .forEach((el) => {
      el.classList.add("entrance");
      observer.observe(el);
    });
}
document.querySelectorAll("article.project").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (paused || event.pointerType !== "mouse") return;
    const r = card.getBoundingClientRect();
    card.style.setProperty(
      "--tilt-x",
      `${((event.clientY - r.top) / r.height - 0.5) * -3}deg`,
    );
    card.style.setProperty(
      "--tilt-y",
      `${((event.clientX - r.left) / r.width - 0.5) * 3}deg`,
    );
  });
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
});
let scrollFrame = 0;
function updateProgress() {
  scrollFrame = 0;
  const max = document.documentElement.scrollHeight - innerHeight;
  $(".reading-progress i").style.transform =
    `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress);
  },
  { passive: true },
);
window.addEventListener("resize", updateProgress, { passive: true });
// The explicit URL owns the language; opening an English result stays English.
const initial = location.pathname.startsWith("/fa") ? "fa" : "en";
setLanguage(initial, false);
blogSection.load();
updateDay();
scheduleDay();
updateProgress();
syncProjectHash();
