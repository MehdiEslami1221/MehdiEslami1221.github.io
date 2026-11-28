// The ordinary homepage scene. The existing controller owns time, canvas and motion.
const LIME = "188,243,106";
const TEAL = "91,160,164";
const CODE = ["</>", "{ }", "0101", "=>", "async ()", "[ data ]", "return;", "0x100"];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function route(points) {
  let length = 0;
  const stops = points.map((point, index) => {
    if (index) length += Math.hypot(point.x - points[index - 1].x, point.y - points[index - 1].y);
    return length;
  });
  return { points, stops, length };
}

function pointAt(trace, distance) {
  const d = clamp(distance, 0, trace.length);
  for (let i = 1; i < trace.points.length; i++) {
    if (d <= trace.stops[i]) {
      const amount = (d - trace.stops[i - 1]) / (trace.stops[i] - trace.stops[i - 1] || 1);
      return {
        x: trace.points[i - 1].x + (trace.points[i].x - trace.points[i - 1].x) * amount,
        y: trace.points[i - 1].y + (trace.points[i].y - trace.points[i - 1].y) * amount,
      };
    }
  }
  return trace.points.at(-1);
}

function strokeTrace(ctx, trace) {
  ctx.beginPath();
  trace.points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
  ctx.stroke();
}

// Build a bounded diagram only on resize. Every fork shares a real junction.
export function createArchitectureScene(width, height) {
  const mobile = width < 700;
  const circuits = [];
  const rows = mobile ? [.26, .74] : [.19, .49, .81];
  for (let side = 0; side < 2; side++) {
    const x = (fraction) => side ? width * (1 - fraction) : width * fraction;
    rows.forEach((row, index) => {
      const y = height * row;
      const span = Math.min(height * .09, mobile ? 64 : 92);
      const junction = { x: x(mobile ? .17 : .20), y };
      const trunk = route([
        { x: x(-.025), y: y - span },
        { x: x(.065), y: y - span },
        { x: x(.12), y },
        junction,
      ]);
      const branches = [-1, 1].map((direction) => route([
        junction,
        { x: x(mobile ? .24 : .27), y },
        { x: x(mobile ? .29 : .31), y: y + direction * span * .65 },
        { x: x(mobile ? .37 : .40), y: y + direction * span * .65 },
      ]));
      circuits.push({
        trunk, branches, junction,
        phase: index * 3.6 + side * 5.1,
        period: 16 + index * 2 + side,
        speed: Math.max(mobile ? 29 : 43, (trunk.length + Math.max(...branches.map(b => b.length)) + 26) / ((16 + index * 2 + side) * .72)),
        rgb: (side + index) % 3 === 2 ? TEAL : LIME,
      });
    });
  }
  return { width, height, mobile, circuits, offset: { x: 0, y: 0 } };
}

function glow(ctx, x, y, radius, rgb, alpha) {
  const fill = ctx.createRadialGradient(x, y, 0, x, y, radius);
  fill.addColorStop(0, `rgba(${rgb},${alpha})`);
  fill.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = fill;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

// Follow each bend, including when the trail straddles a corner.
function packet(ctx, trace, distance, rgb, opacity) {
  if (distance < 0 || distance > trace.length + 26) return null;
  const head = pointAt(trace, distance);
  const alpha = opacity * Math.min(1, Math.max(0, (trace.length + 26 - distance) / 26));
  for (let i = 6; i > 0; i--) {
    if (distance - (i - 1) * 4 < 0) continue;
    const a = pointAt(trace, distance - i * 4);
    const b = pointAt(trace, distance - (i - 1) * 4);
    ctx.strokeStyle = `rgba(${rgb},${alpha * (1 - i / 7) * .75})`;
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  glow(ctx, head.x, head.y, 14, rgb, alpha * .12);
  ctx.fillStyle = `rgba(${rgb},${alpha})`;
  ctx.beginPath(); ctx.arc(head.x, head.y, 1.6, 0, Math.PI * 2); ctx.fill();
  return { ...head, alpha: alpha * .32, rgb };
}

export function drawArchitectureScene(ctx, scene, time, pointer, staticScene) {
  const { width, height, mobile, circuits, offset } = scene;
  const lights = [];
  const hasPointer = !staticScene && !mobile && pointer.x >= 0;
  const targetX = hasPointer ? clamp(pointer.x / width - .5, -.5, .5) * 18 : 0;
  const targetY = hasPointer ? clamp(pointer.y / height - .5, -.5, .5) * 14 : 0;
  offset.x = staticScene ? 0 : offset.x + (targetX - offset.x) * .045;
  offset.y = staticScene ? 0 : offset.y + (targetY - offset.y) * .045;
  const t = staticScene ? 0 : time;
  ctx.save();
  // Broad, slow illumination stays at the margins, away from the introduction.
  glow(ctx, width * .03, height * (.30 + Math.sin(t * .065) * .04), Math.max(width, height) * .52, LIME, .045);
  glow(ctx, width * .98, height * (.68 + Math.cos(t * .055) * .05), Math.max(width, height) * .48, TEAL, .06);

  // A fine blueprint grid and sparse registration crosses form the furthest layer.
  const grid = mobile ? 52 : 64;
  ctx.save();
  ctx.translate(offset.x * .25, offset.y * .25);
  ctx.lineWidth = .65;
  for (let x = grid / 2; x < width; x += grid) {
    const edge = Math.abs(x / width - .5) * 2;
    ctx.strokeStyle = `rgba(141,179,147,${.012 + edge * .023})`;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    for (let y = grid / 2; y < height; y += grid) {
      ctx.fillStyle = `rgba(155,199,157,${.035 + edge * .07})`;
      ctx.fillRect(x - .65, y - .65, 1.3, 1.3);
      if (Math.round((x + y) / grid) % 4 !== 0) continue;
      ctx.strokeStyle = `rgba(155,199,157,${.025 + edge * .055})`;
      ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x + 3, y);
      ctx.moveTo(x, y - 3); ctx.lineTo(x, y + 3); ctx.stroke();
    }
  }
  ctx.strokeStyle = "rgba(141,179,147,.025)";
  for (let y = grid / 2; y < height; y += grid) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
  ctx.restore();

  // Open component frames occupy a middle depth. They never contain UI controls.
  ctx.save();
  ctx.translate(offset.x * .6, offset.y * .6);
  for (let i = 0; i < (mobile ? 4 : 8); i++) {
    const side = i % 2;
    const x = width * (side ? .79 : .055);
    const y = height * (.08 + Math.floor(i / 2) * (mobile ? .45 : .26));
    const w = Math.min(width * .15, 170), h = Math.min(height * .12, 90);
    const drift = Math.sin(t * .08 + i) * (staticScene ? 0 : 4);
    ctx.strokeStyle = `rgba(${side ? TEAL : LIME},.11)`;
    ctx.lineWidth = .7;
    ctx.beginPath();
    ctx.moveTo(x + w * .35, y + drift); ctx.lineTo(x, y + drift);
    ctx.lineTo(x, y + h + drift); ctx.lineTo(x + w * .66, y + h + drift);
    ctx.moveTo(x + w * .82, y + h + drift); ctx.lineTo(x + w, y + h + drift);
    ctx.lineTo(x + w, y + h * .58 + drift); ctx.stroke();
    ctx.fillStyle = "rgba(156,188,157,.16)";
    ctx.font = "8px monospace";
    ctx.fillText(["01 / UI", "02 / API", "03 / DATA", "04 / BUILD"][Math.floor(i / 2)], x + 8, y + 14 + drift);
    ctx.fillStyle = `rgba(${side ? TEAL : LIME},.09)`;
    ctx.fillRect(x + 9, y + 24 + drift, w * .43, 1);
    ctx.fillRect(x + 9, y + 30 + drift, w * .25, 1);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(offset.x, offset.y);
  ctx.lineCap = "round";
  for (const circuit of circuits) {
    const { trunk, branches, junction, rgb } = circuit;
    const focus = hasPointer ? Math.max(0, 1 - Math.hypot(junction.x - pointer.x, junction.y - pointer.y) / 240) : 0;
    ctx.strokeStyle = `rgba(${rgb},${.10 + focus * .10})`;
    ctx.lineWidth = .75;
    strokeTrace(ctx, trunk);
    for (const branch of branches) strokeTrace(ctx, branch);
    ctx.strokeStyle = `rgba(${rgb},.27)`;
    ctx.strokeRect(junction.x - 3, junction.y - 3, 6, 6);
    for (const branch of branches) {
      const end = branch.points.at(-1);
      ctx.fillStyle = `rgba(${rgb},.22)`;
      ctx.fillRect(end.x - 1.5, end.y - 1.5, 3, 3);
    }
    if (staticScene) continue;
    const cycle = (t + circuit.phase) % circuit.period;
    const distance = cycle * circuit.speed;
    // A shared trunk arrives first; both branches depart from that exact junction.
    const sources = distance <= trunk.length
      ? [packet(ctx, trunk, distance, rgb, .8)]
      : branches.map(branch => packet(ctx, branch, distance - trunk.length, rgb, .65));
    for (const light of sources) if (light) lights.push({ ...light, x: light.x + offset.x, y: light.y + offset.y });
    const arrival = Math.max(0, 1 - Math.abs(distance - trunk.length) / 32);
    if (arrival) {
      ctx.strokeStyle = `rgba(${rgb},${arrival * .36})`;
      const radius = 5 + (1 - arrival) * 9;
      ctx.beginPath(); ctx.arc(junction.x, junction.y, radius, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();

  // Code fades independently with long quiet intervals; no falling-code curtain.
  ctx.save();
  ctx.translate(offset.x * 1.25, offset.y * 1.25);
  ctx.font = `${mobile ? 10 : 11}px monospace`;
  for (let i = 0; i < (mobile ? 6 : 12); i++) {
    const phase = (t * .035 + i * .219) % 1;
    const envelope = staticScene ? .35 : Math.sin(clamp(phase / .74, 0, 1) * Math.PI) ** 2;
    const side = i % 2;
    const x = width * (side ? .82 - (i % 3) * .035 : .04 + (i % 3) * .065);
    const y = height * (.14 + Math.floor(i / 2) * (mobile ? .29 : .15));
    ctx.fillStyle = `rgba(${i % 3 ? LIME : TEAL},${envelope * .28})`;
    ctx.fillText(CODE[i % CODE.length], x + Math.sin(t * .08 + i) * (staticScene ? 0 : 7), y - phase * (staticScene ? 0 : 12));
  }
  ctx.restore();
  ctx.restore();
  return lights;
}
