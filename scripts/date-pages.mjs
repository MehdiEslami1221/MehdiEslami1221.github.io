import {
  SITE_URL,
  homePath,
  servicePath,
  personSchema,
  websiteSchema,
} from "../seo.mjs";
import { datePath, DATE_SEO } from "../content/date.mjs";
import { profilePath } from "../content/profile.mjs";
import { imagePath } from "../content/image.mjs";
import { services } from "../content/services.mjs";
import { renderDateWorkbench } from "../date-markup.mjs";
import { escapeHTML as e } from "./service-pages.mjs";
import { launchHead, launchBody } from "./pwa-shell.mjs";
export function renderDatePage(lang) {
  const t = (en, fa) => (lang === "fa" ? fa : en),
    meta = DATE_SEO[lang],
    path = datePath(lang),
    other = lang === "fa" ? "en" : "fa";
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
      name: meta.heading,
      description: meta.description,
      url: SITE_URL + path,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web browser",
      isAccessibleForFree: true,
      inLanguage: lang,
      author: { "@id": SITE_URL + "/#me" },
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
          name: t("Date tools", "ابزار تاریخ"),
          item: SITE_URL + path,
        },
      ],
    },
  ];
  return `<!doctype html><html lang="${lang}" dir="${lang === "fa" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#080a09"><title>${e(meta.title)}</title><meta name="description" content="${e(meta.description)}"><meta name="author" content="Mehdi Eslami"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${SITE_URL + path}">${["en", "fa", "x-default"].map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL + datePath(l === "fa" ? "fa" : "en")}">`).join("")}
<meta property="og:type" content="website"><meta property="og:site_name" content="Mehdi Eslami"><meta property="og:title" content="${e(meta.title)}"><meta property="og:description" content="${e(meta.description)}"><meta property="og:url" content="${SITE_URL + path}"><meta property="og:locale" content="${lang === "fa" ? "fa_IR" : "en_US"}"><meta property="og:locale:alternate" content="${lang === "fa" ? "en_US" : "fa_IR"}"><meta property="og:image" content="${SITE_URL}/assets/social-cover.webp"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(meta.title)}"><meta name="twitter:description" content="${e(meta.description)}"><meta name="twitter:image" content="${SITE_URL}/assets/social-cover.webp"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"><link rel="preload" as="font" type="font/woff2" crossorigin href="${lang === "fa" ? "/assets/fonts/IRANSansX-Regular.woff2" : "/assets/vazirmatn.woff2"}"><link rel="stylesheet" href="/style.css?v=20261122-studio1"><link rel="stylesheet" href="/services.css?v=20261122-studio1"><link rel="stylesheet" href="/date.css?v=20261123-clock1">${launchHead()}<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c")}</script><script src="/date.js?v=20261123-clock1" type="module"></script></head>
<body class="service-page date-page">${launchBody(lang)}<a class="skip" href="#main">${t("Skip to content", "رفتن به محتوای صفحه")}</a><div class="service-ambient" aria-hidden="true"></div><header class="service-header wrap"><a class="service-brand" href="${homePath(lang)}" aria-label="${t("Mehdi Eslami homepage", "صفحهٔ اصلی مهدی اسلامی")}"><span class="brand-icon"><img src="/assets/logo.svg" width="56" height="42" alt=""></span><span>${t("Mehdi Eslami", "مهدی اسلامی")}</span></a><nav aria-label="${t("Main navigation", "منوی اصلی")}"><a href="${homePath(lang)}#work">${t("Work", "نمونه‌کارها")}</a><a href="${imagePath(lang)}">${t("Image tools", "ابزار عکس")}</a><a href="${servicePath(lang)}">${t("Services", "خدمات")}</a></nav><a class="service-switch" href="${datePath(other)}" lang="${other}" hreflang="${other}">${other === "fa" ? "فارسی" : "EN"}</a></header>
<main class="wrap date-main" id="main"><div class="service-breadcrumb"><a href="${homePath(lang)}">${t("Home", "خانه")}</a> / <span>${t("Date tools", "ابزار تاریخ")}</span></div><section class="date-hero"><p class="eyebrow">${t("DATE & CALENDAR", "تاریخ و تقویم")}</p><h1>${e(meta.heading)}</h1><p>${e(meta.intro)}</p></section><noscript><p>${t("Enable JavaScript to calculate dates. The guide below remains readable.", "برای محاسبهٔ تاریخ، JavaScript مرورگر را فعال کنید. راهنمای پایین صفحه همچنان قابل مطالعه است.")}</p></noscript>${renderDateWorkbench(lang)}
<section class="date-guide"><h2>${t("How to convert a date", "روش تبدیل تاریخ")}</h2><p>${t("Select the source calendar, enter the year, month and day, and choose Convert date. Persian, Gregorian and calculated civil Hijri results appear together, with the weekday. You can also paste a year-first date such as 1405/09/02.", "تقویم مبدأ را انتخاب و سال، ماه و روز را وارد کنید. با زدن «تبدیل تاریخ»، نتیجهٔ شمسی، میلادی و قمری محاسباتی همراه روز هفته نمایش داده می‌شود. ورود تاریخ به شکل سال/ماه/روز، مانند ۱۴۰۵/۰۹/۰۲ هم امکان‌پذیر است.")}</p><h2>${t("Age in years, months and days", "محاسبهٔ سن به سال، ماه و روز")}</h2><p>${t("The age calculator counts completed calendar years and months from your birth date to today or a date you choose. It also shows total days and the next birthday. For a birthday on a leap day, choose the last day of the month or the first day of the following month in non-leap years.", "محاسبه‌گر سن، سال‌ها و ماه‌های کامل را از تاریخ تولد تا امروز یا تاریخ دلخواه شما حساب می‌کند. مجموع روزها و تولد بعدی هم نمایش داده می‌شوند. برای تولد در روز کبیسه، می‌توانید آخرین روز ماه یا اولین روز ماه بعد را در سال غیرکبیسه انتخاب کنید.")}</p><h2>${t("Date difference and the monthly calendar", "فاصلهٔ تاریخ‌ها و تقویم ماهانه")}</h2><p>${t("Compare two dates, add or subtract days, weeks, months or years, and browse the monthly calendar. The calculated Hijri result can differ from moon-sighting calendars.", "فاصلهٔ دو تاریخ را حساب کنید، روز و هفته و ماه و سال به یک تاریخ اضافه یا از آن کم کنید و تقویم ماهانه را ببینید. نتیجهٔ قمریِ محاسباتی ممکن است با تقویم‌های مبتنی بر رؤیت هلال تفاوت داشته باشد.")}</p><p>${t("Calculations run in your browser. Dates are not submitted to a server. A temporary session draft preserves your entries only when you use the language switch on this page.", "محاسبات در مرورگر شما انجام می‌شود و تاریخ‌ها به سرور ارسال نمی‌شوند. هنگام تغییر زبان همین صفحه، ورودی‌ها به‌طور موقت در نشست مرورگر نگه داشته می‌شوند.")}</p><h2>${t("Analog clock and time zones", "ساعت آنالوگ و منطقه‌های زمانی")}</h2><p>${t("The analog hands and digital display show the same time in the zone you choose. Select Tehran, your device zone, UTC or another listed city. Choose the signature, classic or minimal face. The clock follows your device time; it does not contact an atomic time server.", "عقربه‌ها و نمایشگر دیجیتال، ساعت منطقهٔ زمانی انتخابی شما را نشان می‌دهند. تهران، منطقهٔ دستگاه، UTC یا یکی از شهرهای فهرست را انتخاب کنید و ظاهر ساعت را به سبز، کلاسیک یا ساده تغییر دهید. مبنای ساعت، زمان دستگاه شماست.")}</p><h2>${t("More tools and services", "ابزارها و خدمات دیگر")}</h2><p><a href="${profilePath(lang)}">${t("Profile text", "متن‌ساز پروفایل")}</a> · <a href="${imagePath(lang)}">${t("Image compressor and resizer", "کاهش حجم و تغییر اندازهٔ عکس")}</a></p><div class="service-related-links">${["", ...services.map((s) => s.slug)].map((slug) => `<a href="${servicePath(lang, slug)}">${slug ? e(services.find((s) => s.slug === slug)[lang].name) : t("All services", "همهٔ خدمات")}</a>`).join("")}</div></section></main><footer class="service-footer wrap"><a class="footer-mark" href="${homePath(lang)}" aria-label="${t("Home", "خانه")}"><img src="/assets/logo.svg" width="48" height="36" alt=""></a><span>${t("Mehdi Eslami", "مهدی اسلامی")}</span><a href="${homePath(lang)}#contact">${t("Contact", "تماس")}</a></footer></body></html>`;
}
