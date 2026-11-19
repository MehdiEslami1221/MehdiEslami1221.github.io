import {
  programmerDayState,
  calendarEvent,
  contrastRatio,
  textStats,
  stockMovement,
} from "./core.mjs";
("use strict");
const $ = (selector) => document.querySelector(selector);
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const getSaved = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};
let lang = document.documentElement.lang;
const tr = (en, fa) => (lang === "fa" ? fa : en);
function message(selector, en, fa) {
  const el = $(selector);
  el.dataset.en = en;
  el.dataset.fa = fa;
  el.textContent = tr(en, fa);
}
let paused = reduced.matches || getSaved("portfolio-motion") === "paused";
function motionLabel() {
  const button = $("#motion");
  button.textContent = paused
    ? tr("Resume motion", "ادامهٔ حرکت‌ها")
    : tr("Pause motion", "توقف حرکت‌ها");
  button.setAttribute("aria-pressed", String(paused));
  document.body.classList.toggle("motion-paused", paused);
}
motionLabel();

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
      "اسم، راه تماس و حداقل ۱۰ حرف دربارهٔ پروژه‌ات بنویس.",
    );
    return;
  }
  const brief = [
    tr(
      "Project inquiry from mehdieslami.ir",
      "درخواست پروژه از mehdieslami.ir",
    ),
    `${tr("Name", "نام")}: ${name}`,
    `${tr("Contact", "راه تماس")}: ${contact}`,
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
    "متنت آماده‌ست؛ توی تلگرام یا برنامهٔ ایمیل ارسالش کن. اگر باز نشد، از لینک پایین یا دکمهٔ کپی استفاده کن.",
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
      "کپی شد؛ حالا توی پیامت بچسبونش.",
    );
  } catch {
    $("#brief").focus();
    $("#brief").select();
    message(
      "#form-status",
      "Text selected. Use your device’s copy command.",
      "متن انتخاب شد؛ با گزینهٔ کپی دستگاهت بردارش.",
    );
  }
});

// Source links stay with each quotation. Rotation never repeats the current entry.
const quotes = [
  {
    text: "Simplicity does not precede complexity, but follows it.",
    author: "Alan Perlis",
    fa: "سادگی قبل از پیچیدگی نمی‌آد؛ بعد از اون به دست می‌آد.",
    faAuthor: "آلن پرلیس",
    source: "https://www.cs.yale.edu/homes/perlis-alan/quotes.html",
  },
  {
    text: "The tools we use have a profound (and devious!) influence on our thinking habits, and, therefore, on our thinking abilities.",
    author: "Edsger W. Dijkstra",
    fa: "ابزارهایی که استفاده می‌کنیم، عادت‌های فکری و در نتیجه توانایی فکرکردنمون رو عمیقاً تغییر می‌دن.",
    faAuthor: "ادسخر دایکسترا",
    source: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html",
  },
  {
    text: "Premature optimization is the root of all evil.",
    author: "Donald Knuth",
    fa: "بهینه‌سازی زودهنگام، ریشهٔ بسیاری از دردسرهاست.",
    faAuthor: "دونالد کنوت",
    source:
      "https://web.stanford.edu/class/archive/cs/cs107/cs107.1224/lectures/16/16-Optimization.html",
  },
];
let quoteIndex = 0;
let quotePaused = paused;
let quoteVisible = false;
let quoteTimer = 0;
let quoteHovered = false;
let quoteFocused = false;
const quoteSection = $(".quote-section");
function quoteLabel() {
  $("#quote-pause").textContent = quotePaused
    ? tr("Resume rotation", "ادامهٔ جمله‌ها")
    : tr("Pause rotation", "توقف جمله‌ها");
  $("#quote-pause").setAttribute("aria-pressed", String(quotePaused));
}
function scheduleQuote() {
  clearTimeout(quoteTimer);
  if (
    quotePaused ||
    !quoteVisible ||
    document.hidden ||
    quoteHovered ||
    quoteFocused
  )
    return;
  quoteTimer = setTimeout(() => {
    nextQuote();
  }, 14000);
}
function nextQuote() {
  quoteIndex =
    (quoteIndex + 1 + Math.floor(Math.random() * (quotes.length - 1))) %
    quotes.length;
  const quote = quotes[quoteIndex];
  $("#quote-text").textContent = tr(quote.text, quote.fa);
  $("#quote-author").textContent = tr(quote.author, quote.faAuthor);
  $("#quote-source").href = quote.source;
  $("#quote-index").textContent =
    `${String(quoteIndex + 1).padStart(2, "0")} / 03`;
  const body = $(".quote-body");
  body.classList.remove("changing");
  // Restart only the short transition; keep the quote area height stable.
  void body.offsetWidth;
  body.classList.add("changing");
  scheduleQuote();
}
$("#quote-next").addEventListener("click", nextQuote);
$("#quote-pause").addEventListener("click", () => {
  quotePaused = !quotePaused;
  quoteLabel();
  scheduleQuote();
});
quoteSection.addEventListener("mouseenter", () => {
  quoteHovered = true;
  scheduleQuote();
});
quoteSection.addEventListener("mouseleave", () => {
  quoteHovered = false;
  scheduleQuote();
});
quoteSection.addEventListener("focusin", () => {
  quoteFocused = true;
  scheduleQuote();
});
quoteSection.addEventListener("focusout", (event) => {
  quoteFocused = quoteSection.contains(event.relatedTarget);
  scheduleQuote();
});
if ("IntersectionObserver" in window) {
  new IntersectionObserver(
    (entries) => {
      quoteVisible = entries[0].isIntersecting;
      scheduleQuote();
    },
    { threshold: 0.2 },
  ).observe(quoteSection);
} else {
  quoteVisible = true;
  scheduleQuote();
}
quoteLabel();

// A circuit field with traveling packets and gentle pointer response.
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
function resize() {
  if (!ctx) return;
  const bounds = canvas.parentElement.getBoundingClientRect();
  width = bounds.width;
  height = bounds.height;
  const density = Math.min(
    window.devicePixelRatio || 1,
    width < 700 ? 1.25 : 1.5,
  );
  canvas.width = Math.round(width * density);
  canvas.height = Math.round(height * density);
  ctx.setTransform(density, 0, 0, density, 0, 0);
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
function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  if (document.body.classList.contains("celebrating")) {
    const colors = ["#bcf36a", "#7de2ff", "#c5a5ff"];
    ctx.font = "12px monospace";
    for (let i = 0; i < (width < 700 ? 14 : 28); i++) {
      ctx.fillStyle = colors[i % 3] + "55";
      ctx.fillText(
        i % 3 === 0 ? "256" : i % 2 ? "01" : "{ }",
        (i * 83.7) % width,
        ((i * 69 + time * (10 + (i % 5) * 2)) % (height + 40)) - 20,
      );
    }
  }
  ctx.lineWidth = 0.7;
  paths.forEach((path, i) => {
    const a = nodes[path.a],
      b = nodes[path.b];
    const distance = Math.hypot(
      (a.x + b.x) / 2 - pointer.x,
      (a.y + b.y) / 2 - pointer.y,
    );
    const active = Math.max(0, 1 - distance / 240);
    ctx.strokeStyle = `rgba(151,202,100,${0.075 + active * 0.14})`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    if (i % 2 === 0) {
      const lengthX = Math.abs(b.x - a.x),
        lengthY = Math.abs(b.y - a.y),
        length = lengthX + lengthY;
      const progress = ((time * path.speed + path.phase) % 1) * length;
      const x =
        progress < lengthX ? a.x + Math.sign(b.x - a.x) * progress : b.x;
      const y =
        progress < lengthX
          ? a.y
          : a.y + Math.sign(b.y - a.y) * (progress - lengthX);
      ctx.fillStyle = `rgba(189,243,106,${0.35 + active * 0.25})`;
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    }
  });
  nodes.forEach((node, i) => {
    const glow = 0.2 + (Math.sin(time * 0.65 + node.phase) + 1) * 0.08;
    ctx.fillStyle = `rgba(172,222,116,${glow})`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
    if (i % 7 === 0) {
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(166,203,126,.18)";
      ctx.fillText(
        tokens[Math.floor(i / 7) % tokens.length],
        node.x + 9,
        node.y - 8,
      );
    }
  });
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
  cancelAnimationFrame(raf);
  raf = 0;
}
$("#motion").addEventListener("click", () => {
  paused = !paused;
  save("portfolio-motion", paused ? "paused" : "playing");
  motionLabel();
  paused ? stop() : start();
});
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
  scheduleQuote();
});
reduced.addEventListener("change", (event) => {
  paused = event.matches;
  quotePaused = event.matches;
  motionLabel();
  quoteLabel();
  scheduleQuote();
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
  save("portfolio-language", lang);
  const switcher = $(".language-switch");
  switcher.textContent = lang === "fa" ? "EN" : "فارسی";
  switcher.href = lang === "fa" ? "/" : "/fa/";
  switcher.lang = lang === "fa" ? "en" : "fa";
  switcher.hreflang = switcher.lang;
  const path = lang === "fa" ? "/fa/" : "/";
  if (updateHistory) history.pushState(null, "", path + location.hash);
  const title = tr(
    "Mehdi Eslami | Java, Spring Boot & Web Developer",
    "مهدی اسلامی | توسعه‌دهندهٔ جاوا، وب و اندروید",
  );
  const description = tr(
    "Mehdi Eslami builds Java and Spring Boot backends, websites and Android apps. Explore his projects and get in touch.",
    "من مهدی اسلامی‌ام؛ بک‌اند جاوا، سایت و اپلیکیشن اندروید می‌سازم. نمونه‌کارهام رو ببین، دموها رو امتحان کن و از پروژه‌ات بگو.",
  );
  document.title = title;
  $('meta[name="description"]').content = description;
  $('link[rel="canonical"]').href = "https://mehdieslami.ir" + path;
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
  motionLabel();
  quoteLabel();
  renderCurrentQuote();
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
  $("#quote-text").lang = lang;
}

// Day 256 is computed per Gregorian year, including leap years, in Tehran time.
let previewCelebration = false;
let dayTimer;
function updateDay() {
  const state = programmerDayState();
  document.body.classList.toggle(
    "celebrating",
    state.active || previewCelebration,
  );
  $("#day-date").textContent = new Intl.DateTimeFormat(
    lang === "fa" ? "fa-IR" : "en-GB",
    { timeZone: "Asia/Tehran", dateStyle: "full" },
  ).format(new Date(state.target));
  $("#day-message").textContent = state.active
    ? tr(
        "Happy Programmer’s Day. Keep building.",
        "روز برنامه‌نویس مبارک؛ به ساختن ادامه بده.",
      )
    : previewCelebration
      ? tr(
          "A sneak peek. The countdown is still real.",
          "این پیش‌نمایش جشنه؛ شمارش معکوس همچنان واقعیه.",
        )
      : tr("Until the next day 256", "تا روز برنامه‌نویس بعدی");
  for (const key of ["days", "hours", "minutes", "seconds"])
    $("#count-" + key).textContent = new Intl.NumberFormat(
      lang === "fa" ? "fa" : "en",
      { minimumIntegerDigits: key === "days" ? 1 : 2, useGrouping: false },
    ).format(state[key]);
  const preview = $("#celebrate-preview");
  preview.textContent = previewCelebration
    ? tr("End preview", "پایان پیش‌نمایش")
    : tr("Preview the celebration", "جشنش رو همین الان ببین");
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
        `${visible} projects to explore`,
        `${new Intl.NumberFormat("fa").format(visible)} پروژه برای دیدن`,
      )
    : tr(
        "No matches. Try a different word.",
        "چیزی پیدا نشد؛ یه کلمهٔ دیگه امتحان کن.",
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
        "اینجا کپی خودکار در دسترس نیست؛ متن رو انتخاب و کپی کن.",
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
    message("#json-status", "Valid JSON. All set.", "JSON درسته؛ آماده‌ست.");
    $("#json-status").classList.remove("error");
  } catch {
    message(
      "#json-status",
      "This JSON has a syntax error. Check quotes, commas and brackets.",
      "این JSON یه ایراد نوشتاری داره؛ کوتیشن‌ها، ویرگول‌ها و پرانتزها رو بررسی کن.",
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
      ? tr("Meets WCAG AA for normal text", "حد AA برای متن معمولی رو داره")
      : ratio >= 3
        ? tr("AA for large text only", "حد AA فقط برای متن درشت")
        : tr(
            "Below AA. Try more contrast.",
            "به حد AA نمی‌رسه؛ اختلاف رنگ رو بیشتر کن.",
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
      "Some messages deserve a better moment.",
      "بعضی حرف‌ها باید سر وقتشون برسن.",
    ],
    story: [
      "A bilingual writing desk for scheduled Telegram messages and sealed letters. The recipient sees the envelope first; the application releases the letter after its opening time.",
      "یه میز نوشتن دوزبانه برای پیام‌های زمان‌دار و نامه‌های سربه‌مهر تلگرام. گیرنده اول پاکت رو می‌بینه و برنامه بعد از زمان تعیین‌شده، متن نامه رو در اختیارش می‌ذاره.",
    ],
    decision: [
      "Opening time is checked on the server in the full app. Demo and live modes stay separate, and unknown delivery outcomes are never silently retried.",
      "در نسخهٔ کامل، زمان بازشدن روی سرور بررسی می‌شه. حالت نمایشی از ارسال واقعی جداست و ارسال با نتیجهٔ نامشخص، خودکار تکرار نمی‌شه.",
    ],
    scope: [
      "A single-owner local edition. A live Telegram session is required for real delivery.",
      "نسخهٔ محلی برای یک صاحب حساب؛ ارسال واقعی به اتصال تلگرام نیاز داره.",
    ],
    repo: "dearlater",
  },
  didgah: {
    name: "Didgah",
    stack: "Next.js · TypeScript · SQLite · PDF",
    image: "didgah",
    problem: [
      "A questionnaire is only useful when its answers become readable.",
      "جواب‌های پرسش‌نامه باید بشه فهمید و بررسی‌شون کرد.",
    ],
    story: [
      "A Persian research survey with 56 questions, a private researcher dashboard, descriptive charts and individual or combined PDF reports.",
      "یه پرسش‌نامهٔ پژوهشی فارسی با ۵۶ سؤال، پنل پژوهشگر، نمودارهای توصیفی و گزارش PDF تکی یا گروهی.",
    ],
    decision: [
      "A submission token prevents duplicate responses when a request is retried. Draft recovery helps participants continue unfinished questionnaires.",
      "شناسهٔ ارسال جلوی ثبت دوبارهٔ پاسخ رو می‌گیره. پیش‌نویس هم ذخیره می‌شه تا پاسخ‌دهنده بتونه پرسش‌نامهٔ نیمه‌کاره رو ادامه بده.",
    ],
    scope: [
      "A fixed research questionnaire, not a general form builder. Reports show descriptive statistics.",
      "این پروژه یه پرسش‌نامهٔ مشخصه، نه فرم‌ساز عمومی؛ گزارش‌ها هم آمار توصیفی رو نشون می‌دن.",
    ],
    repo: "didgah",
  },
  warehouse: {
    name: "Gorgan Warehouse",
    stack: "Next.js · TypeScript · SQLite · Inventory",
    problem: [
      "Know what came in, what went out, and who received it.",
      "چی وارد شد، چی رفت و تحویل چه کسی شد؟",
    ],
    story: [
      "A Persian warehouse application with stock receipts, departmental handovers, automatic document IDs, movement reports and printable receipts.",
      "یه برنامهٔ فارسی برای رسید ورود، تحویل کالا به واحدها، شماره‌گذاری خودکار سندها، گزارش گردش و رسید قابل چاپ.",
    ],
    decision: [
      "Document lines and stock movements share one database transaction. An invalid line rolls back the operation; outgoing stock cannot exceed availability.",
      "ردیف‌های سند و تغییر موجودی توی یک تراکنش ثبت می‌شن. خطای هر ردیف، کل عملیات رو برمی‌گردونه و خروج بیشتر از موجودی مجاز نیست.",
    ],
    scope: [
      "A portfolio project for a single local operator. It does not imply official municipal endorsement.",
      "نمونه‌کار برای یک کاربر محلی؛ این معرفی به معنی تأیید رسمی شهرداری نیست.",
    ],
    repo: "gorgan-warehouse",
  },
  yadban: {
    name: "Yadban",
    stack: "Next.js · Cloudflare Workers · D1 · Web Push",
    problem: ["A little less to remember.", "یه کم سبک‌ترشدنِ فکر."],
    story: [
      "A bilingual personal planner for installments, bills and recurring reminders, with calendar views and Web Push notifications in its full deployment.",
      "یه برنامهٔ شخصی دوزبانه برای قسط‌ها، قبض‌ها و یادآوری‌های تکرارشونده؛ با تقویم و اعلان وب در نسخهٔ کامل.",
    ],
    decision: [
      "Recurrences, delivery retries and notification deduplication live in the Worker scheduler. The portfolio itself does not run that service.",
      "تکرار موعدها و تلاش دوباره برای اعلان، داخل زمان‌بند Worker مدیریت می‌شه؛ خودِ این سایت اون سرویس رو اجرا نمی‌کنه.",
    ],
    scope: [
      "Single-owner. Reminder delivery depends on the deployed scheduler and device permissions.",
      "برای یک صاحب حساب؛ رسیدن اعلان به زمان‌بند فعال و مجوز دستگاه بستگی داره.",
    ],
    repo: "yadban",
  },
  videofetch: {
    name: "VideoFetch",
    stack: "Java · Spring Boot · Next.js · yt-dlp · FFmpeg",
    problem: [
      "Media workflows need honest feedback when platforms say no.",
      "وقتی پلتفرم اجازه نمی‌ده، برنامه باید روشن توضیح بده.",
    ],
    story: [
      "A Spring Boot backend and Next.js interface for media metadata and download workflows.",
      "بک‌اند Spring Boot و رابط Next.js برای دریافت اطلاعات رسانه و مدیریت روند دانلود.",
    ],
    decision: [
      "Metadata fallback and clear failure messages matter when an upstream platform requires sign-in or blocks extraction.",
      "وقتی پلتفرم ورود به حساب می‌خواد یا استخراج رو متوقف می‌کنه، روش جایگزین برای اطلاعات و پیام خطای روشن اهمیت داره.",
    ],
    scope: [
      "Platform restrictions still apply. There is no real download service on this portfolio.",
      "محدودیت‌های پلتفرم‌ها همچنان پابرجاست؛ این سایت سرویس دانلود واقعی نداره.",
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
    `<h2 id="project-title">${escapeHTML(p.name)}</h2><p class="project-stack" dir="ltr">${p.stack}</p>${p.image ? `<figure class="case-image"><img src="/assets/${p.image}.webp" width="1348" height="925" alt="${escapeHTML(tr("Actual app screenshot with synthetic demonstration data", "تصویر اجرای واقعی با اطلاعات ساختگی نمایشی"))}"><figcaption>${tr("Captured from the running app with demo data.", "از اجرای واقعی برنامه با اطلاعات نمونه.")}</figcaption></figure>` : ""}<p class="case-lead">${phrase(p.problem)}</p><p>${phrase(p.story)}</p><div class="case-grid"><div><h3>${tr("A decision that matters", "یه تصمیم مهم")}</h3><p>${phrase(p.decision)}</p></div><div><h3>${tr("Current scope", "محدودهٔ فعلی")}</h3><p>${phrase(p.scope)}</p></div></div>${["dearlater", "didgah", "warehouse"].includes(id) ? `<section class="mini-demo"><h3>${tr("A tiny hands-on version", "یه تجربهٔ کوچیک")}</h3><p class="small muted">${tr("Browser-only demonstration. It does not send messages or save real project records.", "این فقط یه نمایش داخل مرورگره؛ پیامی نمی‌فرسته و رکورد واقعی پروژه رو تغییر نمی‌ده.")}</p>${demoMarkup(id)}</section>` : ""}<div class="tool-actions"><a class="button primary" href="https://github.com/MehdiEslami1221/${p.repo}" target="_blank" rel="noopener noreferrer">${tr("Explore the source", "دیدن کد پروژه")}</a><button type="button" class="button secondary" id="share-project">${tr("Copy project link", "کپی لینک پروژه")}</button></div>`;
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
    return `<div class="envelope-demo"><div class="demo-envelope" id="demo-envelope"><div class="demo-flap"></div><div class="demo-letter" id="demo-letter">${tr("Keep building. Good things take time.", "به ساختن ادامه بده؛ چیزهای خوب زمان می‌برن.")}</div><div class="demo-seal">m.</div></div><button type="button" id="unlock-demo" class="button primary">${tr("Seal a letter for 5 seconds", "یه نامه برای ۵ ثانیه مهر کن")}</button><p id="envelope-status" role="status"></p></div>`;
  if (id === "didgah")
    return `<p>${tr("How much does a clear interface help your day?", "یه رابط کاربری روشن چقدر کارت رو راحت‌تر می‌کنه؟")}</p><div class="demo-options">${[0, 1, 2, 3, 4].map((n) => `<button type="button" data-score="${n}" aria-pressed="false">${new Intl.NumberFormat(lang).format(n)}</button>`).join("")}</div><div class="demo-chart" aria-hidden="true">${[0, 1, 2, 3, 4].map((n) => `<i data-bar="${n}" style="--bar:8%"></i>`).join("")}</div><p id="survey-status" role="status">${tr("Choose a score from 0 to 4. This is your selection, not research data.", "از ۰ تا ۴ انتخاب کن؛ این فقط انتخاب توئه، نه دادهٔ پژوهش.")}</p>`;
  return `<div class="stock-demo"><div><span>${tr("Sample stock", "موجودی نمونه")}</span><b id="demo-stock">24</b><span>${tr("notebooks", "دفتر")}</span></div><label>${tr("Quantity", "تعداد")}<input id="stock-quantity" type="number" min="1" max="1000" step="1" value="3"></label></div><div class="tool-actions"><button type="button" id="stock-in" class="button primary">${tr("Receive stock", "ثبت ورود")}</button><button type="button" id="stock-out" class="button secondary">${tr("Hand over stock", "ثبت خروج")}</button><button type="button" id="stock-reset" class="text-link">${tr("Reset example", "از اول")}</button></div><p id="stock-status" role="status"></p>`;
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
          : tr("Your little letter is ready.", "نامهٔ کوچیکت آماده‌ست.");
        if (!left) {
          clearInterval(envelopeTimer);
          $("#demo-envelope").classList.add("opened");
          button.disabled = false;
          button.textContent = tr("Try again", "یه بار دیگه");
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
          `انتخابت ${new Intl.NumberFormat("fa").format(+b.dataset.score)} از ۴ بود؛ فقط همین صفحه تغییر کرده.`,
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
            "گردش نمونه ثبت شد.",
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
                  "یه تعداد صحیح و بیشتر از صفر وارد کن.",
                );
        }
      });
    $("#stock-reset").addEventListener("click", () => {
      stock = 24;
      show();
      $("#stock-status").textContent = tr(
        "Example reset.",
        "نمونه از اول شروع شد.",
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
$("#overview-open").addEventListener("click", () =>
  $("#overview-dialog").showModal(),
);
$("#print-overview").addEventListener("click", () => window.print());

function commandList() {
  return [
    {
      en: "Explore projects",
      fa: "دیدن پروژه‌ها",
      keys: "work portfolio نمونه کار",
      run: () => jump("#work"),
    },
    {
      en: "Try the browser tools",
      fa: "امتحان ابزارها",
      keys: "lab json text آزمایشگاه",
      run: () => jump("#lab"),
    },
    {
      en: "About Mehdi",
      fa: "دربارهٔ مهدی",
      keys: "about skills درباره",
      run: () => jump("#about"),
    },
    {
      en: "Start a conversation",
      fa: "از پروژه‌ات بگو",
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
    {
      en: "Pause / resume motion",
      fa: "توقف یا ادامهٔ حرکت‌ها",
      keys: "motion animation حرکت انیمیشن",
      run: () => $("#motion").click(),
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
      "چیزی پیدا نشد؛ یه کلمهٔ دیگه امتحان کن.",
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
const initial = location.pathname.startsWith("/fa")
  ? "fa"
  : getSaved("portfolio-language") === "fa"
    ? "fa"
    : "en";
setLanguage(initial, false);
if (initial === "fa" && !location.pathname.startsWith("/fa"))
  history.replaceState(null, "", "/fa/" + location.hash);
updateDay();
scheduleDay();
updateProgress();
syncProjectHash();
