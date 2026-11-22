import {
  SITE_URL,
  homePath,
  servicePath,
  personSchema,
  websiteSchema,
} from "../seo.mjs";
import { imagePath, IMAGE_SEO } from "../content/image.mjs";
import { profilePath } from "../content/profile.mjs";
import { services } from "../content/services.mjs";
import { escapeHTML as e } from "./service-pages.mjs";
import { launchHead, launchBody } from "./pwa-shell.mjs";
export function homeImage() {
  const s = (en, fa) =>
    `<span data-en="${e(en)}" data-fa="${e(fa)}">${e(en)}</span>`;
  return `<section class="section wrap" id="image-tools" aria-labelledby="image-discovery-heading"><div class="section-heading"><div><p class="eyebrow">${s("IMAGE TOOLS", "ابزارهای عکس")}</p><h2 id="image-discovery-heading">${s("Compress and resize your photos.", "کاهش حجم و تغییر اندازهٔ عکس.")}</h2></div></div><a class="profile-discovery image-discovery" href="${imagePath("en")}" data-href-en="${imagePath("en")}" data-href-fa="${imagePath("fa")}"><div><h3>${s("Image compressor & resizer", "کاهش حجم و تغییر اندازهٔ عکس")}</h3><p>${s("Set a maximum file size, change dimensions or convert images to WebP. Check the preview and download your photos individually or in a ZIP file.", "حداکثر حجم و ابعاد عکس را تعیین کنید یا فرمت آن را تغییر دهید. نتیجه را ببینید و عکس‌ها را تکی یا در یک فایل ZIP دانلود کنید.")}</p><span class="profile-open">${s("Edit your images", "ویرایش عکس")}</span></div><div class="image-discovery-art" aria-hidden="true"><span>JPG · PNG · WebP</span><strong>1920 × 1080</strong><span>${s("RESIZE · CROP · CONVERT", "تغییر اندازه · برش · تبدیل فرمت")}</span></div></a></section>`;
}
function markup(lang) {
  const t = (en, fa) => (lang === "fa" ? fa : en);
  const field = (id, en, fa, attrs = "") =>
    `<div class="im-field"><label for="${id}">${t(en, fa)}</label><input id="${id}" ${attrs}></div>`;
  const check = (id, en, fa, checked = false) =>
    `<label class="im-check"><input type="checkbox" id="${id}" ${checked ? "checked" : ""}>${t(en, fa)}</label>`;
  return `<section class="im-studio" id="studio" aria-label="${t("Image studio", "ابزار ویرایش عکس")}">
<div class="im-drop" id="im-drop"><div class="im-drop-icon" aria-hidden="true">▧</div><div><h2>${t("Start with your images", "عکس‌های خود را انتخاب کنید")}</h2><p>${t("Drop files here, paste an image, or choose from your device.", "فایل‌ها را اینجا رها کنید، عکس کپی‌شده را جای‌گذاری کنید یا از دستگاه خود انتخاب کنید.")}</p><p class="im-small">${t("JPG, PNG, WebP · 20 images · 40 MB per file · 24 megapixels", "JPG، PNG، WebP · تا ۲۰ عکس · هر فایل ۴۰ مگابایت · ۲۴ مگاپیکسل")}</p></div><label class="button primary im-file-label" for="im-files">${t("Choose images", "انتخاب عکس‌ها")}<input id="im-files" disabled type="file" accept="image/*" multiple></label><label class="text-link im-file-label" for="im-files-disk">${t("Choose from device files", "انتخاب از فایل‌های دستگاه")}<input id="im-files-disk" type="file" disabled multiple aria-label="${t("Choose from device files", "انتخاب از فایل‌های دستگاه")}"></label><button type="button" class="text-link" id="im-demo" disabled>${t("Try a sample", "آزمایش با عکس نمونه")}</button></div>
<p id="im-status" class="im-status" role="status" aria-live="polite">${t("Your images stay in this browser. Nothing is uploaded.", "عکس‌ها در همین مرورگر پردازش می‌شوند و به سرور ارسال نمی‌شوند.")}</p>
<div class="im-batchbar" id="im-batchbar" hidden><p id="im-total"></p><button type="button" class="text-link" id="im-clear">${t("Remove all", "حذف همه")}</button></div><div id="im-queue" class="im-queue" role="group" aria-label="${t("Your images", "عکس‌های شما")}"></div>
<div class="im-workspace" id="im-workspace" hidden>
<aside class="im-controls"><fieldset id="im-settings"><legend class="sr-only">${t("Selected image settings", "تنظیمات عکس انتخاب‌شده")}</legend><div class="im-control-heading"><h2>${t("Export settings", "تنظیمات خروجی")}</h2><button type="button" id="im-reset" class="text-link">${t("Reset", "بازنشانی")}</button></div>
<label for="im-preset">${t("Preset", "تنظیمات آماده")}</label><select id="im-preset"><option value="custom">${t("Custom settings", "تنظیمات دلخواه")}</option><option value="web">${t("Website · WebP, max 1920 px", "وب‌سایت · WebP، حداکثر ۱۹۲۰ پیکسل")}</option><option value="form">${t("Upload form · JPG, 200 KB target", "فرم اینترنتی · JPG، حجم هدف ۲۰۰ کیلوبایت")}</option><option value="avatar">${t("Profile · square, 512 px", "پروفایل · مربع، ۵۱۲ پیکسل")}</option><option value="lossless">${t("Transparent graphic · PNG", "طرح شفاف · PNG")}</option></select>
<div class="im-two"><div class="im-field"><label for="im-format">${t("Output format", "فرمت خروجی")}</label><select id="im-format"><option value="webp">WebP</option><option value="jpeg">JPG / JPEG</option><option value="png">PNG</option></select></div>${field("im-target", "Maximum size (KB)", "حداکثر حجم (کیلوبایت)", 'type="number" min="0" max="40960" step="1" value="0" inputmode="numeric" aria-describedby="im-target-help"')}</div>
<div class="im-chips" role="group" aria-label="${t("Target presets", "حجم‌های آماده")}">${[100, 200, 500].map((n) => `<button type="button" data-target="${n}">${n} KB</button>`).join("")}<button type="button" data-target="0">${t("No limit", "بدون محدودیت")}</button></div>
<p id="im-target-help" class="im-small">${t("Enter 0 to skip the size limit. Here, 1 KB = 1024 bytes.", "برای حذف محدودیت حجم، صفر وارد کنید. در این ابزار هر کیلوبایت برابر با ۱۰۲۴ بایت است.")}</p>
${check("im-shrink", "Allow smaller dimensions to reach the target", "کاهش ابعاد برای رسیدن به حجم هدف", true)}
<div class="im-range-heading"><label for="im-quality">${t("Quality ceiling", "حداکثر کیفیت")}</label><output id="im-quality-value" for="im-quality">88%</output></div><input id="im-quality" type="range" min="5" max="100" value="88">
<div class="im-range-heading"><label for="im-minQuality">${t("Quality floor", "حداقل کیفیت")}</label><output id="im-minQuality-value" for="im-minQuality">35%</output></div><input id="im-minQuality" type="range" min="5" max="100" value="35"><p id="im-format-help" class="im-small"></p>
<details open><summary>${t("Dimensions & framing", "ابعاد و کادربندی")}</summary><div class="im-two">${field("im-width", "Max width (px)", "حداکثر عرض (پیکسل)", 'type="number" min="0" max="8192" step="1" value="0" inputmode="numeric"')}${field("im-height", "Max height (px)", "حداکثر ارتفاع (پیکسل)", 'type="number" min="0" max="8192" step="1" value="0" inputmode="numeric"')}</div><p class="im-small">${t("Enter 0 to leave that dimension unrestricted. With aspect ratio locked, the image fits within both limits.", "با واردکردن صفر، محدودیت آن بُعد حذف می‌شود. اگر حفظ تناسب فعال باشد، عرض و ارتفاع از مقادیر تعیین‌شده بیشتر نمی‌شوند.")}</p>${check("im-lock", "Keep aspect ratio", "حفظ تناسب ابعاد", true)}${check("im-upscale", "Allow enlarging (does not add detail)", "اجازهٔ بزرگ‌کردن (جزئیات اضافه نمی‌شود)")}
<div class="im-two"><div class="im-field"><label for="im-aspect">${t("Crop ratio", "نسبت برش")}</label><select id="im-aspect"><option value="free">${t("Free / numeric", "آزاد / عددی")}</option><option value="original">${t("Original", "اصلی")}</option><option value="1">1:1</option><option value="1.3333333333">4:3</option><option value="1.7777777778">16:9</option><option value="0.8">4:5</option><option value="0.5625">9:16</option></select></div><button type="button" class="im-mini" id="im-crop-reset">${t("Full image", "کادر کامل")}</button></div>
<p class="im-small">${t("Drag a rectangle on the crop preview, or enter percentages. Crop is applied before rotation.", "روی پیش‌نمایش برش، کادر بکشید یا درصدها را وارد کنید. برش پیش از چرخش انجام می‌شود.")}</p><div class="im-four">${["x", "y", "w", "h"].map((k, i) => field("im-crop-" + k, ["Left %", "Top %", "Width %", "Height %"][i], ["چپ ٪", "بالا ٪", "عرض ٪", "ارتفاع ٪"][i], `type="number" min="${i > 1 ? 1 : 0}" max="100" step="any" value="${i > 1 ? 100 : 0}" inputmode="decimal"`)).join("")}</div>
<div class="im-transform" role="group" aria-label="${t("Rotate and flip", "چرخش و قرینه")}"><button type="button" id="im-rotate-left">${t("Rotate −90°", "چرخش ‎−۹۰°")}</button><button type="button" id="im-rotate-right">${t("Rotate +90°", "چرخش ‎+۹۰°")}</button><button type="button" id="im-flipX" aria-pressed="false">${t("Flip horizontal", "قرینهٔ افقی")}</button><button type="button" id="im-flipY" aria-pressed="false">${t("Flip vertical", "قرینهٔ عمودی")}</button></div><p id="im-rotation" class="im-small"></p></details>
<details><summary>${t("Transparency & file name", "شفافیت و نام فایل")}</summary>${check("im-flatten", "Replace transparent pixels with a color", "جایگزینی بخش شفاف با رنگ")}<div class="im-two">${field("im-background", "Background color", "رنگ زمینه", 'type="color" value="#ffffff"')}${field("im-suffix", "Text added to file name", "عبارت افزوده به نام فایل", 'type="text" maxlength="30" value="-optimized" dir="auto"')}</div><p class="im-small">${t("JPG always uses a solid background. PNG and WebP can retain transparency. Camera metadata is not copied into exports.", "JPG همیشه زمینهٔ یکدست دارد. PNG و WebP می‌توانند شفافیت را حفظ کنند. اطلاعات دوربین در خروجی کپی نمی‌شوند.")}</p></details>
<button type="button" class="im-apply" id="im-apply">${t("Apply these settings to all images", "اعمال این تنظیمات روی همهٔ عکس‌ها")}</button><p class="im-small">${t("Includes crop, rotation and dimensions. Existing results will need processing again.", "شامل برش، چرخش و ابعاد؛ نتیجه‌های قبلی باید دوباره پردازش شوند.")}</p></fieldset></aside>
<div class="im-editor"><div class="im-editor-heading"><div><p class="eyebrow">${t("SELECTED IMAGE", "عکس انتخاب‌شده")}</p><h2 id="im-name"></h2></div><button type="button" class="text-link" id="im-remove">${t("Remove", "حذف")}</button></div>
<details class="im-crop-panel" open><summary>${t("Crop preview", "پیش‌نمایش برش")}</summary><div class="im-crop-stage" id="im-crop-stage"><img id="im-crop-image" alt="${t("Original image for cropping", "عکس اصلی برای برش")}" draggable="false"><div id="im-crop-box" aria-hidden="true"></div></div></details>
<div class="im-preview-heading"><h3>${t("Compare the result", "مقایسهٔ نتیجه")}</h3><span id="im-dirty"></span></div><div class="im-compare" id="im-compare" dir="ltr"><img id="im-before" alt="${t("Before compression, with the same crop and geometry", "پیش از فشرده‌سازی با همین برش و ابعاد")}" draggable="false"><img id="im-after" alt="${t("Processed output", "خروجی پردازش‌شده")}" draggable="false" hidden><span class="im-compare-tag im-tag-before">${t("Before", "قبل")}</span><span class="im-compare-tag im-tag-after" id="im-after-tag" hidden>${t("After", "بعد")}</span><div class="im-divider" id="im-divider" hidden></div><p id="im-preview-empty">${t("Process the image to compare quality.", "عکس را پردازش کنید تا کیفیت را مقایسه کنید.")}</p></div>
<div class="im-preview-tools"><label for="im-split">${t("Before / after slider", "مقایسهٔ قبل و بعد")}<input id="im-split" type="range" min="0" max="100" value="50" disabled></label><button type="button" class="text-link" id="im-full" disabled>${t("View full-resolution output", "مشاهدهٔ خروجی با وضوح کامل")}</button></div>
<div class="im-metrics"><div><span>${t("Original file", "فایل اصلی")}</span><strong id="im-original-size">—</strong><small id="im-original-dimensions"></small></div><div><span>${t("Output file", "فایل خروجی")}</span><strong id="im-output-size">—</strong><small id="im-output-dimensions"></small></div><div><span>${t("Size change", "تغییر حجم")}</span><strong id="im-saving">—</strong><small id="im-output-quality"></small></div></div><p id="im-result-status" class="im-result-status" role="status"></p>
<div class="im-run"><button type="button" class="button primary" id="im-process">${t("Process this image", "پردازش این عکس")}</button><button type="button" class="button secondary" id="im-download" disabled>${t("Download image", "دریافت عکس")}</button></div></div></div>
<div class="im-batch-actions" id="im-batch-actions" hidden><div><h2>${t("Process and download all images", "پردازش و دانلود گروهی")}</h2><p id="im-batch-summary"></p></div><div class="im-run"><button type="button" class="button secondary" id="im-process-all">${t("Process all images", "پردازش همهٔ عکس‌ها")}</button><button type="button" class="button primary" id="im-zip" disabled>${t("Download ready files · ZIP", "دریافت فایل‌های آماده · ZIP")}</button><button type="button" class="text-link" id="im-cancel" hidden>${t("Cancel processing", "توقف پردازش")}</button></div><progress id="im-progress" max="1" value="0" hidden aria-label="${t("Batch processing progress", "پیشرفت پردازش گروهی")}"></progress></div>
<div class="im-mobilebar" id="im-mobilebar" hidden><a href="#im-settings">${t("Settings", "تنظیمات")}</a><button type="button" class="button primary" id="im-mobile-process">${t("Process", "پردازش")}</button><button type="button" class="button secondary" id="im-mobile-download" disabled>${t("Download", "دریافت")}</button></div><dialog id="im-viewer"><div class="im-viewer-head"><h2>${t("Full-resolution output", "خروجی با وضوح کامل")}</h2><button type="button" id="im-close" class="button secondary">${t("Close", "بستن")}</button></div><p class="im-small">${t("Scroll to inspect the actual pixels.", "برای بررسی پیکسل‌های واقعی، تصویر را پیمایش کنید.")}</p><div class="im-viewer-scroll"><img id="im-full-image" alt="${t("Full-resolution processed image", "عکس پردازش‌شده با وضوح کامل")}"></div></dialog></section>`;
}
export function renderImagePage(lang) {
  const t = (en, fa) => (lang === "fa" ? fa : en),
    meta = IMAGE_SEO[lang],
    path = imagePath(lang),
    other = lang === "fa" ? "en" : "fa";
  const faq = [
    [
      t(
        "How do I reduce a photo to 200 KB?",
        "چطور حجم عکس را به کمتر از ۲۰۰ کیلوبایت برسانم؟",
      ),
      t(
        "Choose an image, set 200 KB as the target and process it. The tool searches for a quality level between your floor and ceiling. If needed, it reduces dimensions only when you allow it. The result shows the real byte size and whether the target was reached.",
        "عکس را انتخاب کنید، حداکثر حجم را ۲۰۰ کیلوبایت قرار دهید و «پردازش این عکس» را بزنید. کیفیت در بازه‌ای که مشخص کرده‌اید تنظیم می‌شود. اگر کاهش کیفیت کافی نباشد، ابعاد فقط با اجازهٔ شما کوچک‌تر می‌شوند. حجم نهایی و رسیدن یا نرسیدن به حد تعیین‌شده را در نتیجه می‌بینید.",
      ),
    ],
    [
      t("Which format should I choose?", "کدام فرمت مناسب‌تر است؟"),
      t(
        "WebP is useful for website photos and supports transparency. JPEG has broad compatibility but replaces transparency with your background color. PNG is lossless for the resulting pixels and suits graphics, but its file size cannot be controlled by a quality slider. Resizing or cropping still changes pixels.",
        "برای عکس‌های وب‌سایت می‌توانید از WebP استفاده کنید. JPG در بیشتر برنامه‌ها و سامانه‌ها پذیرفته می‌شود، اما پس‌زمینهٔ شفاف را با رنگ انتخابی شما پر می‌کند. PNG برای لوگو، اسکرین‌شات و تصویر شفاف مناسب است و تنظیم کیفیت ندارد. فشرده‌سازی PNG بدون افت است؛ بااین‌حال، تغییر ابعاد یا برش، خود تصویر را تغییر می‌دهد.",
      ),
    ],
    [
      t("Are images uploaded or stored?", "آیا عکس‌ها آپلود یا ذخیره می‌شوند؟"),
      t(
        "Processing happens in this tab using your browser. Files are not sent to a server, and the tool does not save images in browser storage. Removing an image or closing the tab clears the working session. Download any results you want to keep.",
        "عکس‌ها در همین صفحه پردازش می‌شوند و به سرور فرستاده نمی‌شوند. ابزار هم نسخه‌ای از آن‌ها را برای مراجعهٔ بعدی ذخیره نمی‌کند. قبل از حذف عکس یا بستن صفحه، خروجی‌های موردنیازتان را دانلود کنید.",
      ),
    ],
    [
      t(
        "Can I use exact dimensions and a target size together?",
        "آیا می‌توان ابعاد دقیق و حجم هدف را هم‌زمان انتخاب کرد؟",
      ),
      t(
        "Yes. Turn off automatic dimension reduction to keep your chosen size. Aspect lock fits the image within the width and height limits; turn it off only if you want stretching. The size limit may be too low for your chosen minimum quality. If so, the result shows that the target was not reached.",
        "بله. برای ثابت‌ماندن ابعاد خروجی، گزینهٔ کاهش ابعاد برای رسیدن به حجم هدف را خاموش کنید. با فعال‌بودن حفظ تناسب، عرض و ارتفاع واردشده حداکثر اندازه‌اند؛ غیرفعال‌کردن آن ممکن است تصویر را کشیده یا فشرده کند. اگر با حداقل کیفیت انتخابی نتوان به حجم موردنظر رسید، در نتیجه به شما اطلاع داده می‌شود.",
      ),
    ],
    [
      t(
        "What are the limits? What happens to metadata?",
        "چه عکس‌هایی پذیرفته می‌شوند و اطلاعات دوربین چه می‌شود؟",
      ),
      t(
        "Up to 20 still JPEG, PNG or WebP images, 40 MB per file, 100 MB total and 24 megapixels per image. Output is bounded to 8192 px per side and 24 megapixels. Animated images, SVG, HEIC and AVIF are not accepted. Export creates a new still image without copying EXIF or GPS metadata. Camera orientation is applied during decoding. Color rendering can vary by browser; this is a screen-image tool, not a print color workflow.",
        "می‌توانید تا ۲۰ عکس ثابت JPG، PNG یا WebP انتخاب کنید؛ حداکثر ۴۰ مگابایت برای هر فایل، ۱۰۰ مگابایت در مجموع و ۲۴ مگاپیکسل برای هر عکس. هر ضلع خروجی حداکثر ۸۱۹۲ پیکسل است و مجموع پیکسل‌ها هم از ۲۴ مگاپیکسل بیشتر نمی‌شود. تصاویر متحرک و فرمت‌های SVG، HEIC و AVIF پذیرفته نمی‌شوند. جهت عکس هنگام بازشدن اصلاح می‌شود، اما اطلاعات دوربین و موقعیت مکانی به خروجی منتقل نمی‌شوند. رنگ‌ها ممکن است در مرورگرهای مختلف کمی تفاوت داشته باشند؛ این ابزار برای تنظیم تخصصی رنگ چاپ نیست.",
      ),
    ],
  ];
  const graph = [
    websiteSchema(),
    personSchema(lang),
    {
      "@type": "WebPage",
      "@id": SITE_URL + path + "#page",
      url: SITE_URL + path,
      name: meta.title,
      description: meta.description,
      inLanguage: lang,
      isPartOf: { "@id": SITE_URL + "/#website" },
      mainEntity: { "@id": SITE_URL + path + "#tool" },
    },
    {
      "@type": "WebApplication",
      "@id": SITE_URL + path + "#tool",
      name: t("Image compressor and resizer", "کاهش حجم و تغییر اندازهٔ عکس"),
      description: meta.description,
      url: SITE_URL + path,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web browser",
      isAccessibleForFree: true,
      inLanguage: lang,
      author: { "@id": SITE_URL + "/#me" },
      featureList: t(
        "Target file size, resize, crop, rotate, JPEG PNG WebP conversion, comparison, batch ZIP",
        "حجم هدف، تغییر ابعاد، برش، چرخش، تبدیل JPEG PNG WebP، مقایسه و دریافت گروهی ZIP",
      ),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("Home", "خانه"),
          item: SITE_URL + homePath(lang),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("Image tools", "ابزار عکس"),
          item: SITE_URL + path,
        },
      ],
    },
  ];
  return `<!doctype html><html lang="${lang}" dir="${lang === "fa" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#080a09"><title>${e(meta.title)}</title><meta name="description" content="${e(meta.description)}"><meta name="author" content="Mehdi Eslami"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${SITE_URL + path}">${["en", "fa", "x-default"].map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL + imagePath(l === "fa" ? "fa" : "en")}">`).join("")}
<meta property="og:type" content="website"><meta property="og:site_name" content="Mehdi Eslami"><meta property="og:title" content="${e(meta.title)}"><meta property="og:description" content="${e(meta.description)}"><meta property="og:url" content="${SITE_URL + path}"><meta property="og:locale" content="${lang === "fa" ? "fa_IR" : "en_US"}"><meta property="og:locale:alternate" content="${lang === "fa" ? "en_US" : "fa_IR"}"><meta property="og:image" content="${SITE_URL}/assets/social-cover.webp"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(meta.title)}"><meta name="twitter:description" content="${e(meta.description)}"><meta name="twitter:image" content="${SITE_URL}/assets/social-cover.webp"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"><link rel="preload" as="font" type="font/woff2" crossorigin href="${lang === "fa" ? "/assets/fonts/IRANSansX-Regular.woff2" : "/assets/vazirmatn.woff2"}"><link rel="stylesheet" href="/style.css?v=20261122-studio1"><link rel="stylesheet" href="/services.css?v=20261122-studio1"><link rel="stylesheet" href="/image.css?v=20261123-image3">${launchHead()}<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c")}</script><script src="/image.js?v=20261123-copy1" type="module"></script></head>
<body class="service-page image-page">${launchBody(lang)}<a class="skip" href="#main">${t("Skip to content", "رفتن به محتوای صفحه")}</a><div class="service-ambient" aria-hidden="true"></div><header class="service-header wrap"><a class="service-brand" href="${homePath(lang)}" aria-label="${t("Mehdi Eslami homepage", "صفحهٔ اصلی مهدی اسلامی")}"><span class="brand-icon"><img src="/assets/logo.svg" width="56" height="42" alt=""></span><span>${t("Mehdi Eslami", "مهدی اسلامی")}</span></a><nav aria-label="${t("Main navigation", "منوی اصلی")}"><a href="${homePath(lang)}#work">${t("Work", "نمونه‌کارها")}</a><a href="${profilePath(lang)}">${t("Profile text", "متن‌ساز پروفایل")}</a><a href="${servicePath(lang)}">${t("Services", "خدمات")}</a></nav><a class="service-switch" id="im-language" href="${imagePath(other)}" lang="${other}" hreflang="${other}">${other === "fa" ? "فارسی" : "EN"}</a></header>
<main class="wrap image-main" id="main"><div class="service-breadcrumb"><a href="${homePath(lang)}">${t("Home", "خانه")}</a> / <span>${t("Image tools", "ابزار عکس")}</span></div><section class="im-hero"><div><p class="eyebrow">${t("FREE ONLINE IMAGE STUDIO", "ابزار رایگان و آنلاین عکس")}</p><h1>${e(meta.heading)}</h1><p>${e(meta.intro)}</p></div><div class="im-hero-note"><span>JPG / PNG / WebP</span><strong>${t("Processed in your browser.", "پردازش در مرورگر شما.")}</strong><span>${t("No upload · No sign-up · No watermark", "بدون آپلود · بدون ثبت‌نام · بدون واترمارک")}</span></div></section><noscript><p>${t("Enable JavaScript to process images. You can still read the guide below.", "برای پردازش عکس، JavaScript مرورگر را فعال کنید. راهنمای پایین صفحه همچنان قابل مطالعه است.")}</p></noscript>${markup(lang)}
<section class="im-guide"><h2>${t("How to choose your settings", "چه تنظیماتی انتخاب کنم؟")}</h2><p>${t("For a website, try WebP and limit the longest side. For a form, use JPEG and the required KB target. For transparent artwork, start with PNG or WebP. Compare details and edges before downloading; the best settings depend on your image.", "برای عکس‌های سایت، فرمت WebP را امتحان کنید و ابعاد را متناسب با محل نمایش کاهش دهید. برای فرم ثبت‌نام، فرمت و حداکثر حجم خواسته‌شده را انتخاب کنید. اگر پس‌زمینهٔ شفاف لازم دارید، PNG یا WebP مناسب است. پیش از دانلود، جزئیات عکس را در پیش‌نمایش بررسی کنید.")}</p><div class="im-guide-grid">${faq.map(([q, a]) => `<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join("")}</div><h2>${t("More tools and services", "ابزارها و خدمات دیگر")}</h2><p><a href="${profilePath(lang)}">${t("Fancy profile text generator", "فونت و متن‌ساز پروفایل")}</a> · <a href="${homePath(lang)}#lab">${t("JSON, text and contrast tools", "ابزارهای JSON، متن و خوانایی رنگ")}</a></p><div class="service-related-links">${["", ...services.map((s) => s.slug)].map((slug) => `<a href="${servicePath(lang, slug)}">${slug ? e(services.find((s) => s.slug === slug)[lang].name) : t("All services", "همهٔ خدمات")}</a>`).join("")}</div></section></main><footer class="service-footer wrap"><a class="footer-mark" href="${homePath(lang)}" aria-label="${t("Home", "خانه")}"><img src="/assets/logo.svg" width="48" height="36" alt=""></a><span>${t("Mehdi Eslami", "مهدی اسلامی")}</span><a href="${homePath(lang)}#contact">${t("Contact", "تماس")}</a></footer></body></html>`;
}
