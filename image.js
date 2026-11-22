import {
  defaults,
  LIMITS,
  clamp,
  normalizeCrop,
  fileName,
  zipFiles,
} from "./image-core.mjs?v=20261122-image1";
import {
  decodeFile,
  optimize,
  previewBlob,
} from "./image-engine.mjs?v=20261122-image1";
let lang = document.documentElement.lang,
  items = [],
  selected = null,
  busy = false,
  controller = null,
  source = null,
  sourceId = null,
  viewToken = 0,
  loading = false,
  selecting = false;
const $ = (id) => document.getElementById("im-" + id),
  t = (en, fa) => (lang === "fa" ? fa : en),
  active = () => items.find((i) => i.id === selected),
  url = (blob) => URL.createObjectURL(blob),
  revoke = (value) => {
    if (value) URL.revokeObjectURL(value);
  };
const bytes = (n) =>
  new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(n / 1024) +
  " KB";
const errors = {
  unsupported: [
    "Use a still JPG, PNG or WebP image.",
    "یک عکس ثابت JPG، PNG یا WebP انتخاب کنید.",
  ],
  animated: [
    "Animated images are not supported. Choose a still image.",
    "تصویر متحرک پشتیبانی نمی‌شود؛ یک عکس ثابت انتخاب کنید.",
  ],
  pixels: [
    "Image exceeds the 24-megapixel processing limit.",
    "عکس از محدودهٔ پردازش ۲۴ مگاپیکسل بزرگ‌تر است.",
  ],
  fileSize: [
    "Each file must be under 40 MB.",
    "حجم هر فایل باید کمتر از ۴۰ مگابایت باشد.",
  ],
  decode: [
    "This image could not be opened. It may be damaged.",
    "این عکس باز نشد؛ ممکن است فایل آسیب دیده باشد.",
  ],
  encode: [
    "The browser could not export this image. Try smaller dimensions.",
    "مرورگر نتوانست خروجی بسازد؛ ابعاد کوچک‌تر را امتحان کنید.",
  ],
  format: [
    "This browser cannot export that format. Choose PNG or JPEG.",
    "مرورگر از خروجی این فرمت پشتیبانی نمی‌کند؛ PNG یا JPEG را انتخاب کنید.",
  ],
};
const errorText = (error) => {
  const pair = errors[error?.message || error] || errors.decode;
  return t(...pair);
};
function status(en, fa) {
  $("status").textContent = t(en, fa);
}
function invalidate(item) {
  if (!item) return;
  revoke(item.output?.url);
  item.output = null;
  item.error = null;
}
function node(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function renderQueue() {
  const queue = $("queue");
  queue.replaceChildren();
  for (const item of items) {
    const b = node("button", undefined, "im-queue-item");
    b.type = "button";
    b.disabled = busy || loading || selecting;
    b.setAttribute("aria-pressed", String(item.id === selected));
    b.addEventListener("click", () => {
      readControls();
      select(item.id);
    });
    const picture = node("img");
    picture.src = item.thumb;
    picture.alt = "";
    picture.width = 64;
    picture.height = 56;
    b.append(picture);
    const info = node("span");
    info.append(
      node("strong", item.file.name),
      node(
        "small",
        item.output
          ? bytes(item.output.blob.size) + " · " + t("Ready", "آماده")
          : item.error
            ? errorText(item.error)
            : t("Not processed", "پردازش‌نشده"),
      ),
    );
    b.append(info);
    queue.append(b);
  }
  const ready = items.filter((i) => i.output).length,
    total = items.reduce((s, i) => s + i.file.size, 0),
    out = items.reduce((s, i) => s + (i.output?.blob.size || 0), 0);
  $("mobilebar").hidden = !items.length;
  $("batchbar").hidden = !items.length;
  $("batch-actions").hidden = !items.length;
  $("workspace").hidden = !items.length;
  $("total").textContent = t(
    `${items.length} images · ${bytes(total)} original`,
    `${items.length} عکس · حجم اصلی ${bytes(total)}`,
  );
  $("batch-summary").textContent = t(
    `${ready} of ${items.length} ready${ready ? " · " + bytes(out) + " output" : ""}`,
    `${ready} از ${items.length} عکس آماده${ready ? " · حجم خروجی " + bytes(out) : ""}`,
  );
  $("zip").disabled = busy || !ready;
  $("clear").disabled = busy || loading || selecting;
  $("demo").disabled = busy || loading || selecting;
  $("files").disabled = busy || loading || selecting;
  $("process-all").disabled = busy || loading || selecting;
}
function readControls() {
  const item = active();
  if (!item) return;
  const o = item.options,
    previous = JSON.stringify(item.options);
  for (const key of ["format", "suffix", "background"]) o[key] = $(key).value;
  for (const key of ["quality", "minQuality", "target", "width", "height"])
    o[key] = clamp(
      $(key).value,
      0,
      key === "target"
        ? 40960
        : key === "width" || key === "height"
          ? 8192
          : 100,
    );
  for (const key of ["shrink", "lock", "upscale", "flatten"])
    o[key] = $(key).checked;
  o.crop = normalizeCrop(
    Object.fromEntries(
      ["x", "y", "w", "h"].map((k) => [k, Number($("crop-" + k).value)]),
    ),
  );
  if (o.minQuality > o.quality) o.minQuality = o.quality;
  if (previous === JSON.stringify(o)) return;
  invalidate(item);
  $("preset").value = "custom";
  syncControls();
  refreshPreview();
  renderQueue();
}
function syncControls() {
  const item = active();
  if (!item) return;
  const o = item.options;
  o.crop = normalizeCrop(o.crop);
  for (const key of [
    "format",
    "suffix",
    "background",
    "quality",
    "minQuality",
    "target",
    "width",
    "height",
  ])
    $(key).value = o[key];
  for (const key of ["shrink", "lock", "upscale", "flatten"])
    $(key).checked = o[key];
  for (const key of ["x", "y", "w", "h"]) $("crop-" + key).value = o.crop[key];
  for (const key of ["quality", "minQuality"]) {
    $(key + "-value").textContent = o[key] + "%";
    $(key).disabled = o.format === "png";
  }
  $("flatten").disabled = o.format === "jpeg";
  $("format-help").textContent =
    o.format === "png"
      ? t(
          "PNG is lossless for exported pixels; quality sliders do not apply. A target may require smaller dimensions.",
          "PNG پیکسل‌های خروجی را بدون افت فشرده‌سازی ذخیره می‌کند؛ اسلایدر کیفیت اثری ندارد. رسیدن به حجم هدف ممکن است به ابعاد کوچک‌تر نیاز داشته باشد.",
        )
      : t(
          "With a size target, quality is chosen between the floor and ceiling. Without one, the ceiling is used.",
          "با حجم هدف، کیفیت بین حداقل و حداکثر انتخاب می‌شود؛ بدون حجم هدف، حداکثر کیفیت اعمال می‌شود.",
        );
  $("flipX").setAttribute("aria-pressed", String(o.flipX));
  $("flipY").setAttribute("aria-pressed", String(o.flipY));
  $("rotation").textContent = t("Rotation: ", "چرخش: ") + o.rotation + "°";
  paintCrop();
  renderResult();
}
function paintCrop() {
  const c = active()?.options.crop;
  if (!c) return;
  const b = $("crop-box");
  b.style.left = c.x + "%";
  b.style.top = c.y + "%";
  b.style.width = c.w + "%";
  b.style.height = c.h + "%";
}
let cropUrl = null,
  beforeUrl = null;
async function select(id) {
  if (busy || loading || selecting) return;
  selected = id;
  const item = active();
  if (!item) return;
  selecting = true;
  previewToken++;
  const token = ++viewToken;
  renderQueue();
  $("name").textContent = item.file.name;
  $("settings").disabled = true;
  $("process").disabled = true;
  $("mobile-process").disabled = true;
  $("remove").disabled = true;
  try {
    if (sourceId !== id) {
      source?.close?.();
      source = null;
      sourceId = null;
      source = await decodeFile(item.file);
      sourceId = id;
    }
    if (token !== viewToken) return;
    revoke(cropUrl);
    cropUrl = url(
      await previewBlob(source, { ...defaults(), width: 1000, height: 1000 }),
    );
    $("crop-image").src = cropUrl;
    $("aspect").value = "free";
    syncControls();
    await refreshPreview();
  } catch (error) {
    item.error = error.message;
    $("result-status").textContent = errorText(error);
  } finally {
    selecting = false;
    if (token === viewToken) {
      $("settings").disabled = false;
      $("process").disabled = sourceId !== selected;
      $("mobile-process").disabled = sourceId !== selected;
      $("remove").disabled = false;
      renderQueue();
    }
  }
}
let previewToken = 0;
async function refreshPreview() {
  const item = active();
  if (!item || sourceId !== item.id || !source) return;
  const token = ++previewToken;
  paintCrop();
  renderResult();
  try {
    const blob = await previewBlob(source, item.options);
    if (token !== previewToken) return;
    revoke(beforeUrl);
    beforeUrl = url(blob);
    $("before").src = beforeUrl;
  } catch (error) {
    if (token === previewToken)
      $("result-status").textContent = errorText(error);
  }
}
function renderResult() {
  const item = active();
  if (!item) return;
  const o = item.output;
  const has = !!o;
  $("after").hidden = !has;
  $("after-tag").hidden = !has;
  $("divider").hidden = !has;
  $("preview-empty").hidden = has;
  $("split").disabled = !has;
  $("download").disabled = !has || busy;
  $("mobile-download").disabled = !has || busy;
  $("full").disabled = !has || busy;
  $("original-size").textContent = bytes(item.file.size);
  $("original-dimensions").textContent =
    item.width + " × " + item.height + " px";
  $("output-size").textContent = has ? bytes(o.blob.size) : "—";
  $("output-dimensions").textContent = has
    ? `${o.width} × ${o.height} px · ${item.options.format.toUpperCase()}`
    : t("Process to see actual size", "برای مشاهدهٔ حجم واقعی، پردازش کنید");
  $("saving").textContent = has
    ? new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(
        Math.abs(1 - o.blob.size / item.file.size) * 100,
      ) +
      "% " +
      (o.blob.size <= item.file.size
        ? t("smaller", "کمتر")
        : t("larger", "بیشتر"))
    : "—";
  $("output-quality").textContent = has
    ? o.quality === null
      ? t("PNG · lossless encoding", "PNG · فشرده‌سازی بدون افت")
      : t("Quality: ", "کیفیت: ") + Math.round(o.quality * 100) + "%"
    : "";
  $("dirty").textContent = has
    ? t("Ready to download", "آمادهٔ دریافت")
    : t("Settings not processed", "تنظیمات پردازش نشده‌اند");
  $("result-status").classList.toggle("im-warning", has && !o.met);
  $("result-status").textContent = item.error
    ? errorText(item.error)
    : !has
      ? ""
      : !o.met
        ? t(
            "Target not reached at these settings. Lower the quality floor, enable smaller dimensions or increase the target.",
            "با این تنظیمات به حجم هدف نرسید. حداقل کیفیت را کم کنید، کاهش ابعاد را فعال کنید یا حجم هدف را بیشتر کنید.",
          )
        : item.options.target
          ? t(
              "Target reached. Actual size: ",
              "حجم هدف تأمین شد. حجم واقعی: ",
            ) + bytes(o.blob.size)
          : t(
              "Export ready. Check the preview before downloading.",
              "خروجی آماده است؛ پیش از دریافت، پیش‌نمایش را بررسی کنید.",
            );
  if (has) {
    $("after").src = o.url;
    split();
  } else {
    $("after").removeAttribute("src");
  }
}
function split() {
  const n = Number($("split").value);
  $("after").style.clipPath = `inset(0 0 0 ${n}%)`;
  $("divider").style.left = n + "%";
}
async function addFiles(files) {
  if (busy || loading || selecting) return;
  loading = true;
  renderQueue();
  const failures = [];
  let count = 0,
    total = items.reduce((s, i) => s + i.file.size, 0);
  try {
    for (const file of files) {
      if (items.length >= LIMITS.files) {
        failures.push(t("20-image limit reached.", "محدودیت ۲۰ عکس تکمیل شد."));
        break;
      }
      if (total + file.size > LIMITS.totalBytes) {
        failures.push(
          t("The batch exceeds 100 MB.", "حجم مجموع از ۱۰۰ مگابایت بیشتر است."),
        );
        break;
      }
      let bitmap = null;
      try {
        bitmap = await decodeFile(file);
        const thumb = url(
          await previewBlob(
            bitmap,
            { ...defaults(), width: 160, height: 120 },
            160,
          ),
        );
        items.push({
          id: crypto.randomUUID(),
          file,
          width: bitmap.width,
          height: bitmap.height,
          thumb,
          options: defaults(),
          output: null,
          error: null,
        });
        count++;
        total += file.size;
      } catch (error) {
        failures.push(file.name + ": " + errorText(error));
      } finally {
        bitmap?.close?.();
      }
      renderQueue();
    }
  } finally {
    loading = false;
    renderQueue();
  }
  $("status").textContent =
    (count ? t(`${count} image(s) added. `, `${count} عکس افزوده شد. `) : "") +
    failures.join(" ");
  if (!selected && items.length) await select(items[0].id);
}
function setBusy(value) {
  busy = value;
  $("settings").disabled = value;
  $("process").disabled = value;
  $("mobile-process").disabled = false;
  $("mobile-process").textContent = value
    ? t("Stop", "توقف")
    : t("Process", "پردازش");
  $("remove").disabled = value;
  $("cancel").hidden = !value;
  $("progress").hidden = !value;
  renderQueue();
  renderResult();
}
async function processItems(list) {
  if (busy || loading || selecting || !list.length) return;
  const current = active();
  if (current && !$("settings").reportValidity()) return;
  readControls();
  controller = new AbortController();
  setBusy(true);
  $("progress").max = list.length;
  $("progress").value = 0;
  let done = 0;
  try {
    for (const item of list) {
      if (controller.signal.aborted) break;
      invalidate(item);
      let bitmap = null;
      try {
        status(
          `Processing ${done + 1} of ${list.length}: ${item.file.name}`,
          `پردازش ${done + 1} از ${list.length}: ${item.file.name}`,
        );
        bitmap = await decodeFile(item.file);
        const result = await optimize(bitmap, item.options, {
          signal: controller.signal,
          onProgress: (attempt) => {
            $("dirty").textContent =
              t("Encoding attempt ", "مرحلهٔ فشرده‌سازی ") + attempt;
          },
        });
        item.output = { ...result, url: url(result.blob) };
        done++;
      } catch (error) {
        if (error.name === "AbortError") break;
        item.error = errors[error.message] ? error.message : "encode";
        done++;
      } finally {
        bitmap?.close?.();
        $("progress").value = done;
        renderQueue();
        if (item.id === selected) renderResult();
      }
    }
  } finally {
    const stopped = controller.signal.aborted;
    setBusy(false);
    status(
      stopped
        ? `Stopped. ${done} file(s) completed.`
        : `Finished. ${done} file(s) processed.`,
      stopped
        ? `متوقف شد؛ ${done} فایل تکمیل شد.`
        : `پردازش ${done} فایل پایان یافت.`,
    );
    controller = null;
  }
}
function download(blob, name) {
  const link = node("a");
  const u = url(blob);
  link.href = u;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => revoke(u), 60000);
}
function removeAll() {
  if (busy || loading || selecting) return;
  viewToken++;
  previewToken++;
  items.forEach((item) => {
    revoke(item.thumb);
    invalidate(item);
  });
  items = [];
  selected = null;
  source?.close?.();
  source = null;
  sourceId = null;
  revoke(cropUrl);
  revoke(beforeUrl);
  cropUrl = null;
  beforeUrl = null;
  for (const key of ["crop-image", "before", "after"])
    $(key).removeAttribute("src");
  renderQueue();
  status("Images removed from this session.", "عکس‌ها از این جلسه حذف شدند.");
}
function applyAspect() {
  const item = active();
  if (!item) return;
  const value = $("aspect").value;
  if (value === "free") return;
  const ratio = value === "original" ? item.width / item.height : Number(value),
    relative = ratio / (item.width / item.height);
  const w = Math.min(100, 100 * relative),
    h = Math.min(100, 100 / relative);
  item.options.crop = { x: (100 - w) / 2, y: (100 - h) / 2, w, h };
  invalidate(item);
  syncControls();
  refreshPreview();
  renderQueue();
}
function bind() {
  $("files").addEventListener("change", async (event) => {
    await addFiles([...event.target.files]);
    event.target.value = "";
  });
  const drop = $("drop");
  for (const name of ["dragenter", "dragover"])
    drop.addEventListener(name, (event) => {
      event.preventDefault();
      drop.classList.add("im-drag");
    });
  for (const name of ["dragleave", "drop"])
    drop.addEventListener(name, (event) => {
      event.preventDefault();
      drop.classList.remove("im-drag");
    });
  drop.addEventListener("drop", (event) =>
    addFiles([...event.dataTransfer.files]),
  );
  for (const key of [
    "format",
    "target",
    "width",
    "height",
    "suffix",
    "background",
    "shrink",
    "lock",
    "upscale",
    "flatten",
    "quality",
    "minQuality",
    ...["x", "y", "w", "h"].map((k) => "crop-" + k),
  ]) {
    $(key).addEventListener("change", readControls);
    $(key).addEventListener("input", () => {
      invalidate(active());
      renderResult();
      renderQueue();
    });
  }
  for (const key of ["quality", "minQuality"])
    $(key).addEventListener("input", () => {
      $(key + "-value").textContent = $(key).value + "%";
    });
  for (const b of document.querySelectorAll("[data-target]"))
    b.addEventListener("click", () => {
      $("target").value = b.dataset.target;
      readControls();
    });
  $("preset").addEventListener("change", () => {
    const item = active();
    if (!item) return;
    const value = $("preset").value;
    if (value === "custom") return;
    const o = defaults();
    if (value === "web") o.width = o.height = 1920;
    if (value === "form") {
      o.format = "jpeg";
      o.target = 200;
    }
    if (value === "avatar") {
      o.width = o.height = 512;
      const r = item.width / item.height,
        w = Math.min(100, 100 / r),
        h = Math.min(100, 100 * r);
      o.crop = { x: (100 - w) / 2, y: (100 - h) / 2, w, h };
    }
    if (value === "lossless") o.format = "png";
    item.options = o;
    invalidate(item);
    syncControls();
    refreshPreview();
    renderQueue();
  });
  $("reset").addEventListener("click", () => {
    active().options = defaults();
    invalidate(active());
    $("preset").value = "custom";
    $("aspect").value = "free";
    syncControls();
    refreshPreview();
    renderQueue();
  });
  $("aspect").addEventListener("change", applyAspect);
  $("crop-reset").addEventListener("click", () => {
    active().options.crop = defaults().crop;
    $("aspect").value = "free";
    invalidate(active());
    syncControls();
    refreshPreview();
    renderQueue();
  });
  for (const [key, amount] of [
    ["rotate-left", 270],
    ["rotate-right", 90],
  ])
    $(key).addEventListener("click", () => {
      const i = active();
      i.options.rotation = (i.options.rotation + amount) % 360;
      invalidate(i);
      syncControls();
      refreshPreview();
      renderQueue();
    });
  for (const key of ["flipX", "flipY"])
    $(key).addEventListener("click", () => {
      const i = active();
      i.options[key] = !i.options[key];
      invalidate(i);
      syncControls();
      refreshPreview();
      renderQueue();
    });
  $("apply").addEventListener("click", () => {
    readControls();
    const options = active().options;
    for (const item of items) {
      item.options = structuredClone(options);
      invalidate(item);
    }
    renderQueue();
    renderResult();
    status(
      "Settings applied to every image. Process them to create new outputs.",
      "تنظیمات روی همهٔ عکس‌ها اعمال شد؛ برای ساخت خروجی جدید، پردازش را بزنید.",
    );
  });
  $("process").addEventListener("click", () => processItems([active()]));
  $("mobile-process").addEventListener("click", () =>
    busy ? controller?.abort() : processItems([active()]),
  );
  $("process-all").addEventListener("click", () => processItems([...items]));
  $("cancel").addEventListener("click", () => controller?.abort());
  const getImage = () => {
    const i = active();
    if (i?.output)
      download(
        i.output.blob,
        fileName(i.file.name, i.options.format, i.options.suffix),
      );
  };
  $("download").addEventListener("click", getImage);
  $("mobile-download").addEventListener("click", getImage);
  $("zip").addEventListener("click", async () => {
    if (busy || loading || selecting) return;
    const files = items
      .filter((i) => i.output)
      .map((i) => ({
        name: fileName(i.file.name, i.options.format, i.options.suffix),
        blob: i.output.blob,
      }));
    if (!files.length) return;
    $("zip").disabled = true;
    try {
      download(await zipFiles(files), "images-optimized.zip");
      status(
        `${files.length} ready file(s) included in the ZIP.`,
        `${files.length} فایل آماده در ZIP قرار گرفت.`,
      );
    } catch {
      status(
        "The ZIP could not be created. Download images individually.",
        "ساخت ZIP انجام نشد؛ عکس‌ها را جداگانه دریافت کنید.",
      );
    } finally {
      renderQueue();
    }
  });
  $("clear").addEventListener("click", removeAll);
  $("remove").addEventListener("click", async () => {
    const item = active();
    revoke(item.thumb);
    invalidate(item);
    items = items.filter((i) => i !== item);
    selected = null;
    source?.close?.();
    source = null;
    sourceId = null;
    if (items.length) await select(items[0].id);
    else removeAll();
    renderQueue();
  });
  $("split").addEventListener("input", split);
  $("full").addEventListener("click", () => {
    if (active()?.output) {
      $("full-image").src = active().output.url;
      $("viewer").showModal();
    }
  });
  $("close").addEventListener("click", () => $("viewer").close());
  $("viewer").addEventListener("close", () =>
    $("full-image").removeAttribute("src"),
  );
  $("demo").addEventListener("click", async () => {
    try {
      const response = await fetch("/assets/portrait.webp");
      if (!response.ok) throw new Error();
      await addFiles([
        new File(
          [await response.blob()],
          t("sample-portrait.webp", "نمونه-پرتره.webp"),
          { type: "image/webp" },
        ),
      ]);
    } catch {
      status(
        "Sample could not be loaded. Choose an image from your device.",
        "عکس نمونه بارگذاری نشد؛ از دستگاه خود عکس انتخاب کنید.",
      );
    }
  });
  let drag = null;
  const stage = $("crop-stage");
  const point = (event) => {
    const r = stage.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - r.left) / r.width) * 100, 0, 100),
      y: clamp(((event.clientY - r.top) / r.height) * 100, 0, 100),
    };
  };
  stage.addEventListener("pointerdown", (event) => {
    if (busy || !active() || event.button !== 0) return;
    event.preventDefault();
    stage.setPointerCapture(event.pointerId);
    drag = point(event);
  });
  stage.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const p = point(event),
      item = active();
    item.options.crop = normalizeCrop({
      x: Math.min(drag.x, p.x),
      y: Math.min(drag.y, p.y),
      w: Math.abs(p.x - drag.x),
      h: Math.abs(p.y - drag.y),
    });
    paintCrop();
  });
  const endDrag = () => {
    if (!drag) return;
    drag = null;
    $("aspect").value = "free";
    invalidate(active());
    syncControls();
    refreshPreview();
    renderQueue();
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
}
document.addEventListener("paste", (event) => {
  if (/INPUT|TEXTAREA/.test(event.target.tagName) || busy) return;
  const files = [...event.clipboardData.files];
  if (files.length) {
    event.preventDefault();
    addFiles(files);
  }
});
// Retain the working files in memory while switching the static locale shell.
async function changeLanguage(href, push = true) {
  if (busy || loading || selecting) return;
  readControls();
  loading = true;
  renderQueue();
  $("settings").disabled = true;
  try {
    const response = await fetch(href);
    if (!response.ok) throw new Error();
    const doc = new DOMParser().parseFromString(
      await response.text(),
      "text/html",
    );
    if (!doc.querySelector(".image-main")) throw new Error();
    viewToken++;
    previewToken++;
    for (const selector of [
      "a.skip",
      "main.image-main",
      "header.service-header",
      "footer.service-footer",
    ])
      document.querySelector(selector).replaceWith(doc.querySelector(selector));
    for (const selector of [
      "title",
      'meta[name="description"]',
      'link[rel="canonical"]',
      'script[type="application/ld+json"]',
      ...[
        "og:title",
        "og:description",
        "og:url",
        "og:locale",
        "og:locale:alternate",
      ].map((key) => `meta[property="${key}"]`),
      ...["twitter:title", "twitter:description"].map(
        (key) => `meta[name="${key}"]`,
      ),
    ])
      document.head
        .querySelector(selector)
        .replaceWith(doc.head.querySelector(selector));
    lang = doc.documentElement.lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = doc.documentElement.dir;
    if (push) history.pushState({}, "", href);
    loading = false;
    bind();
    renderQueue();
    if (selected) await select(selected);
  } catch {
    status(
      "Language could not be loaded. Your images are still here.",
      "زبان صفحه بارگذاری نشد؛ عکس‌های شما همچنان در دسترس‌اند.",
    );
  } finally {
    loading = false;
    $("settings").disabled = false;
    renderQueue();
  }
}
document.addEventListener("click", (event) => {
  const link = event.target.closest("#im-language");
  if (link) {
    event.preventDefault();
    changeLanguage(link.href);
  }
});
window.addEventListener("popstate", () => changeLanguage(location.href, false));
bind();
renderQueue();

document.addEventListener("dragover", (event) => {
  if ([...event.dataTransfer.types].includes("Files")) event.preventDefault();
});
document.addEventListener("drop", (event) => {
  if ([...event.dataTransfer.types].includes("Files")) event.preventDefault();
});
