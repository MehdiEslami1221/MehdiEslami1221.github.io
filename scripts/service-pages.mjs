import {
  SITE_URL,
  HOME_SEO,
  homePath,
  servicePath,
  personSchema,
  websiteSchema,
} from "../seo.mjs";
import { services } from "../content/services.mjs";
export const escapeHTML = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const e = escapeHTML;
const json = (data) => JSON.stringify(data, null, 2).replaceAll("<", "\\u003c");
export const overviewSEO = {
  en: {
    title: "Web & Software Development Services | Mehdi Eslami",
    description:
      "Explore Mehdi Eslami’s website, custom web app, Java backend and Android development services. See relevant work and define the scope of your next project.",
  },
  fa: {
    title: "خدمات طراحی سایت و برنامه‌نویسی | مهدی اسلامی",
    description:
      "خدمات طراحی سایت و برنامه‌نویسی مهدی اسلامی؛ توسعهٔ سامانه‌های وب، بک‌اند جاوا و اپلیکیشن اندروید، همراه با نمونه‌کارهای مرتبط و راهنمای شروع همکاری.",
  },
};
function graph(lang, service) {
  const path = servicePath(lang, service?.slug),
    url = SITE_URL + path;
  const meta = service ? service[lang] : overviewSEO[lang];
  const names = lang === "fa" ? ["خانه", "خدمات"] : ["Home", "Services"];
  const crumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: names[0],
      item: SITE_URL + homePath(lang),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: names[1],
      item: SITE_URL + servicePath(lang),
    },
  ];
  if (service)
    crumbs.push({
      "@type": "ListItem",
      position: 3,
      name: meta.name,
      item: url,
    });
  const main = service
    ? {
        "@type": "Service",
        "@id": url + "#service",
        url,
        name: meta.name,
        description: meta.intro,
        serviceType: service.en.name,
        provider: { "@id": SITE_URL + "/#me" },
      }
    : {
        "@type": "ItemList",
        "@id": url + "#services",
        name:
          lang === "fa"
            ? "خدمات توسعه نرم‌افزار"
            : "Software development services",
        itemListElement: services.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@id": SITE_URL + servicePath(lang, s.slug) + "#service",
            name: s[lang].name,
            url: SITE_URL + servicePath(lang, s.slug),
          },
        })),
      };
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteSchema(),
      personSchema(lang),
      {
        "@type": service ? "WebPage" : "CollectionPage",
        "@id": url + "#page",
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: lang,
        isPartOf: { "@id": SITE_URL + "/#website" },
        mainEntity: { "@id": main["@id"] },
        breadcrumb: { "@id": url + "#breadcrumb" },
      },
      main,
      {
        "@type": "BreadcrumbList",
        "@id": url + "#breadcrumb",
        itemListElement: crumbs,
      },
    ],
  };
}
export function serviceHead(lang, service) {
  const meta = service ? service[lang] : overviewSEO[lang],
    path = servicePath(lang, service?.slug);
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#080a09">
<title>${e(meta.title)}</title><meta name="description" content="${e(meta.description)}"><meta name="author" content="Mehdi Eslami"><meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${SITE_URL + path}"><link rel="alternate" hreflang="en" href="${SITE_URL + servicePath("en", service?.slug)}"><link rel="alternate" hreflang="fa" href="${SITE_URL + servicePath("fa", service?.slug)}"><link rel="alternate" hreflang="x-default" href="${SITE_URL + servicePath("en", service?.slug)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Mehdi Eslami"><meta property="og:title" content="${e(meta.title)}"><meta property="og:description" content="${e(meta.description)}"><meta property="og:url" content="${SITE_URL + path}"><meta property="og:locale" content="${lang === "fa" ? "fa_IR" : "en_US"}"><meta property="og:locale:alternate" content="${lang === "fa" ? "en_US" : "fa_IR"}"><meta property="og:image" content="${SITE_URL}/assets/social-cover.webp"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${e(HOME_SEO[lang].imageAlt)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(meta.title)}"><meta name="twitter:description" content="${e(meta.description)}"><meta name="twitter:image" content="${SITE_URL}/assets/social-cover.webp"><meta name="twitter:image:alt" content="${e(HOME_SEO[lang].imageAlt)}">
<link rel="preload" as="font" type="font/woff2" crossorigin href="${lang === "fa" ? "/assets/fonts/IRANSansX-Regular.woff2" : "/assets/vazirmatn.woff2"}"><link rel="icon" href="/assets/favicon-32.png" type="image/png" sizes="32x32"><link rel="icon" href="/assets/favicon.svg?v=20261122-logo1" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" sizes="180x180"><link rel="stylesheet" href="/style.css?v=20261122-logo1"><link rel="stylesheet" href="/services.css?v=20261120-seo1">
<script type="application/ld+json">${json(graph(lang, service))}</script>`;
}
export function serviceTile(service, lang, bilingual = false) {
  const t = service[lang],
    href = servicePath(lang, service.slug);
  const text = (field) =>
    bilingual
      ? `<span data-en="${e(service.en[field])}" data-fa="${e(service.fa[field])}">${e(t[field])}</span>`
      : e(t[field]);
  return `<a class="service-tile" href="${href}"${bilingual ? ` data-href-en="${servicePath("en", service.slug)}" data-href-fa="${servicePath("fa", service.slug)}"` : ""}><span class="service-code" aria-hidden="true" dir="ltr">${e(service.code)}</span><h3>${text("name")}</h3><p>${text("intro")}</p><span class="service-tile-action">${bilingual ? '<span data-en="Explore this service" data-fa="جزئیات این خدمت">Explore this service</span>' : lang === "fa" ? "جزئیات این خدمت" : "Explore this service"}</span></a>`;
}
export function renderServicePage(lang, service) {
  const fa = lang === "fa",
    home = homePath(lang),
    root = servicePath(lang),
    other = servicePath(fa ? "en" : "fa", service?.slug),
    t = service?.[lang];
  const txt = (en, faText) => (fa ? faText : en);
  const person = txt("Mehdi Eslami", "مهدی اسلامی");
  const breadcrumbs = `<nav class="service-breadcrumb" aria-label="${txt("Breadcrumb", "مسیر صفحه")}"><ol><li><a href="${home}">${txt("Home", "خانه")}</a></li><li>${service ? `<a href="${root}">${txt("Services", "خدمات")}</a>` : `<span aria-current="page">${txt("Services", "خدمات")}</span>`}</li>${service ? `<li><span aria-current="page">${e(t.name)}</span></li>` : ""}</ol></nav>`;
  const owner = `<p class="service-owner"><a href="${home}#about">${person}</a><span aria-hidden="true"> · </span><bdi lang="${fa ? "en" : "fa"}">${fa ? "Mehdi Eslami" : "مهدی اسلامی"}</bdi></p>`;
  const contact = (label) =>
    `<a class="button primary" href="${home}#contact">${e(label)}</a>`;
  let body;
  if (service) {
    body = `<section class="service-hero"><p class="eyebrow">${e(t.name)}</p><h1>${e(t.heading)}</h1>${owner}<p class="service-lead">${e(t.intro)}</p>${contact(txt("Discuss this project", "درخواست همکاری"))}</section>
<div class="service-reading"><article class="service-copy"><section><h2>${e(t.fitTitle)}</h2><p>${e(t.fit)}</p></section><section><h2>${txt("What we can include", "امکانات قابل ارائه")}</h2><ul>${t.outputs.map((x) => `<li>${e(x)}</li>`).join("")}</ul></section><section><h2>${e(t.decisionTitle)}</h2><p>${e(t.decision)}</p></section><section><h2>${txt("A useful starting brief", "اطلاعات لازم برای شروع")}</h2><p>${e(t.start)}</p></section><section class="service-faq"><h2>${txt("Before we begin", "پرسش‌های متداول")}</h2>${t.faqs.map(([q, a]) => `<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join("")}</section></article>
<aside class="service-evidence"><h2>${txt("Related work", "نمونه‌کار و تجربهٔ مرتبط")}</h2>${service.image ? `<figure class="service-capture"><img src="/assets/${service.image}.webp" data-capture-tone="${service.image === "videofetch" ? "dark" : "light"}" width="1348" height="${service.image === "dearlater" ? 925 : 850}" loading="lazy" decoding="async" alt="${txt("Running project interface capture", "تصویر اجرای رابط کاربری پروژه")}"><figcaption>${service.image === "videofetch" ? txt("Frontend capture; backend disconnected.", "تصویر اجرای رابط کاربری بدون اتصال به بک‌اند.") : txt("Running interface with sample data.", "تصویر اجرای برنامه با اطلاعات نمونه.")}</figcaption></figure>` : ""}<p>${e(t.example)}</p>${service.project ? `<a class="text-link" href="${home}#project-${service.project}">${txt("See the project story", "مشاهدهٔ تصویر و جزئیات پروژه")}</a><a class="text-link" href="https://github.com/MehdiEslami1221/${service.repo}" rel="noopener noreferrer" target="_blank">${txt("Read the source on GitHub", "مشاهدهٔ کد در گیت‌هاب")}</a>` : `<a class="text-link" href="${home}#resume">${txt("Read my English or Persian résumé", "مشاهدهٔ رزومهٔ فارسی یا انگلیسی")}</a>`}</aside></div>
<section class="service-related"><h2>${txt("Other ways I can help", "خدمات مرتبط")}</h2><div class="service-related-links">${services
      .filter((s) => s.slug !== service.slug)
      .map(
        (s) => `<a href="${servicePath(lang, s.slug)}">${e(s[lang].name)}</a>`,
      )
      .join("")}</div></section>`;
  } else {
    body = `<section class="service-hero"><p class="eyebrow">${txt("WEB · JAVA · ANDROID", "وب · جاوا · اندروید")}</p><h1>${txt("Website development & custom software.", "طراحی سایت و برنامه‌نویسی اختصاصی.")}</h1>${owner}<p class="service-lead">${txt("I build websites, management systems, Java backends and Android apps. Tell me about your project so we can discuss the features, timeline and cost.", "وب‌سایت، سامانهٔ مدیریتی، بک‌اند جاوا و اپلیکیشن اندروید توسعه می‌دهم. نیاز پروژهٔ خود را مطرح کنید تا دربارهٔ امکانات، زمان اجرا و هزینه گفت‌وگو کنیم.")}</p>${contact(txt("Tell me what you need", "ثبت درخواست همکاری"))}</section>
<div class="service-list">${services.map((s) => serviceTile(s, lang)).join("")}</div>
<section class="service-overview-copy"><h2>${txt("Choose a useful starting point", "انتخاب خدمت متناسب با نیاز شما")}</h2><p>${txt("We start with what you need people to do: learn about your business, manage records, follow a process or use a service on their phone. I use that to define the screens, data and integrations before implementation.", "ابتدا مشخص می‌کنیم کاربران قرار است چه کاری انجام دهند؛ با خدمات شما آشنا شوند، اطلاعات ثبت کنند، روندی را پیگیری کنند یا از امکاناتی روی گوشی استفاده کنند. سپس صفحات، اطلاعات و ارتباط با سرویس‌های دیگر را بر همین اساس مشخص می‌کنیم.")}</p>
<h2>${txt("From a brief to an agreed scope", "مراحل شروع همکاری")}</h2><ol><li>${txt("Describe one real task, who uses the result and what already exists.", "کاربرد پروژه، کاربران آن و امکانات یا محتوای آمادهٔ خود را معرفی کنید.")}</li><li>${txt("Review the essential screens, data, integrations and delivery requirements.", "صفحات، اطلاعات موردنیاز، اتصال به سرویس‌ها و معیارهای تحویل را بررسی می‌کنیم.")}</li><li>${txt("Discuss scope, timing, cost and the first version before implementation.", "پیش از اجرا، دربارهٔ امکانات نسخهٔ نخست، زمان‌بندی و هزینه توافق می‌کنیم.")}</li></ol>
<h2>${txt("Projects and experience", "بررسی نمونه‌کارها و سوابق")}</h2><p>${txt("My projects include scheduled Telegram letters, research surveys, inventory management, reminders and media tools. You can see their interfaces, read about implementation decisions and explore the source code. My résumé covers my work experience and skills.", "پروژه‌های من شامل نامه‌های زمان‌بندی‌شدهٔ تلگرام، پرسش‌نامهٔ پژوهشی، مدیریت انبار، یادآوری موعدها و ابزارهای رسانه است. می‌توانید تصاویر، تصمیم‌های فنی و کد منبع آن‌ها را بررسی کنید. سوابق کاری و مهارت‌هایم نیز در رزومه آمده است.")}</p><div class="tool-actions"><a class="button secondary" href="${home}#work">${txt("Explore the projects", "مشاهدهٔ نمونه‌کارها")}</a><a class="button secondary" href="${home}#resume">${txt("Read my résumé", "مشاهدهٔ رزومه")}</a></div></section>`;
  }
  return `<!doctype html><html dir="${fa ? "rtl" : "ltr"}" lang="${lang}"><head>${serviceHead(lang, service)}</head><body class="service-page"><a class="skip" href="#main">${txt("Skip to content", "رفتن به محتوای صفحه")}</a><div class="service-ambient" aria-hidden="true"></div><header class="service-header wrap"><a class="service-brand" href="${home}" aria-label="${txt("Mehdi Eslami homepage", "صفحه اصلی مهدی اسلامی")}"><span class="brand-icon" aria-hidden="true"><img src="/assets/logo.svg" alt="" width="56" height="42"></span><span>${person}</span></a><nav aria-label="${txt("Main navigation", "منوی اصلی")}"><a href="${home}#work">${txt("Work", "نمونه‌کارها")}</a><a href="${root}">${txt("Services", "خدمات")}</a><a href="${home}#contact">${txt("Contact", "تماس")}</a></nav><a class="service-switch" href="${other}" hreflang="${fa ? "en" : "fa"}" lang="${fa ? "en" : "fa"}">${fa ? "EN" : "فارسی"}</a></header><main class="wrap" id="main">${breadcrumbs}${body}<section class="service-contact"><h2>${txt("Have a project in mind?", "برای شروع پروژه آماده‌اید؟")}</h2><p>${txt("Tell me what you want to build, who will use it and which features matter most. We can discuss the scope, timeline and cost from there.", "موضوع پروژه، کاربران و امکانات اصلی را بنویسید تا دربارهٔ روش اجرا، زمان‌بندی و هزینه گفت‌وگو کنیم.")}</p>${contact(txt("Prepare your project brief", "ارسال درخواست همکاری"))}</section></main><footer class="service-footer wrap"><a class="footer-mark" href="${home}" aria-label="${txt("Mehdi Eslami homepage", "صفحهٔ اصلی مهدی اسلامی")}"><img src="/assets/logo.svg" alt="" width="48" height="36"></a><span>${person} · ${txt("Software Developer", "توسعه‌دهنده نرم‌افزار")}</span><a href="${home}#resume">${txt("Résumé", "رزومه")}</a><a href="https://github.com/MehdiEslami1221" rel="noopener noreferrer" target="_blank">GitHub</a><a href="https://www.linkedin.com/in/mehdi-eslami/" rel="noopener noreferrer" target="_blank">LinkedIn</a></footer></body></html>`;
}
