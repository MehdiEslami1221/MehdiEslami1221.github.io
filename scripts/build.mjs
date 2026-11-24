import { readFile, writeFile, mkdir } from "node:fs/promises";
import {
  SITE_URL,
  HOME_SEO,
  homeSchema,
  homePath,
  servicePath,
} from "../seo.mjs";
import { services } from "../content/services.mjs";
import { quotes } from "../content/quotes.mjs";
import { escapeHTML, renderServicePage } from "./service-pages.mjs";
import { launchHead, launchBody } from "./pwa-shell.mjs";
import {
  homeProfile,
  renderProfilePage,
  retiredPlayground,
} from "./profile-pages.mjs";
import { profilePath } from "../content/profile.mjs";
import { homeImage, renderImagePage } from "./image-pages.mjs";
import { imagePath } from "../content/image.mjs";
import { homeDateSection } from "../date-markup.mjs";
import { renderDatePage } from "./date-pages.mjs";
import { datePath } from "../content/date.mjs";
const escape = escapeHTML;
const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
const attrPairs = [
  ["placeholder", "placeholder"],
  ["aria", "aria-label"],
  ["alt", "alt"],
  ["href", "href"],
];
function localize(html) {
  html = html.replace(
    /<([a-z0-9]+)\b([^<>]*\bdata-en="[^"]*"[^<>]*\bdata-fa="([^"]*)"[^<>]*)>[^<]*<\/\1\s*>/g,
    (_, tag, attrs, value) =>
      `<${tag}${attrs}>${escape(decode(value))}</${tag}>`,
  );
  html = html.replace(/<[^>]+>/g, (tag) => {
    for (const [data, attr] of attrPairs) {
      const match = tag.match(new RegExp(`data-${data}-fa="([^"]*)"`));
      if (match)
        tag = tag.replace(
          new RegExp(`(?<![\\w-])${attr}="[^"]*"`),
          `${attr}="${match[1]}"`,
        );
    }
    return tag;
  });
  html = html.replace(
    '<html dir="ltr" lang="en">',
    '<html dir="rtl" lang="fa">',
  );
  html = html.replace(
    /<a([^>]*class="language-switch"[^>]*)>\s*فارسی\s*<\/a\s*>/,
    '<a class="language-switch" href="/" lang="en" hreflang="en">EN</a>',
  );
  html = html.replace(
    /(<blockquote\b[^>]*id="quote-text"[^>]*>)[\s\S]*?(<\/blockquote\s*>)/,
    "$1سادگی پیش از پیچیدگی به دست نمی‌آید؛ پس از آن حاصل می‌شود.$2",
  );
  html = html.replace(
    'href="/assets/vazirmatn.woff2"',
    'href="/assets/fonts/IRANSansX-Regular.woff2"',
  );
  return html.replace(
    /(<span\b[^>]*id="quote-author"[^>]*>)[\s\S]*?(<\/span\s*>)/,
    "$1آلن پرلیس$2",
  );
}
function homeMetadata(html, lang) {
  const meta = HOME_SEO[lang];
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escape(meta.title)}</title>`,
  );
  html = html.replace(/<meta\b[^>]*>/g, (tag) => {
    const key = tag.match(/(?:name|property)="([^"]*)"/)?.[1];
    const map = {
      description: meta.description,
      "og:description": meta.description,
      "twitter:description": meta.description,
      "og:title": meta.title,
      "twitter:title": meta.title,
      "og:url": SITE_URL + homePath(lang),
      "og:locale": lang === "fa" ? "fa_IR" : "en_US",
      "og:locale:alternate": lang === "fa" ? "en_US" : "fa_IR",
      "og:image:alt": meta.imageAlt,
      "twitter:image:alt": meta.imageAlt,
    };
    return key in map
      ? tag.replace(/content="[^"]*"/, `content="${escape(map[key])}"`)
      : tag;
  });
  html = html.replace(
    /<link\b[^>]*rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${SITE_URL + homePath(lang)}">`,
  );
  return html.replace(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/,
    `<script id="site-schema" type="application/ld+json">${JSON.stringify(homeSchema(lang), null, 2).replaceAll("<", "\\u003c")}</script>`,
  );
}
let source = await readFile("index.html", "utf8");
source = source.replace(/(<span\b[^>]*id="quote-index"[^>]*>)[\s\S]*?(<\/span>)/, `$1${String(1).padStart(2, "0")} / ${String(quotes.length).padStart(2, "0")}$2`);
source = source.replace(
  /<!-- app-launch-head -->[\s\S]*?<!-- \/app-launch-head -->/,
  `<!-- app-launch-head -->\n${launchHead()}\n<!-- /app-launch-head -->`,
);
source = source.replace(
  /<!-- app-launch-body -->[\s\S]*?<!-- \/app-launch-body -->/,
  `<!-- app-launch-body -->\n${launchBody()}\n<!-- /app-launch-body -->`,
);
source = source.replace(
  /<!-- studio-discovery -->[\s\S]*?<!-- \/studio-discovery -->/,
  `<!-- studio-discovery -->\n${homeProfile()}\n<!-- /studio-discovery -->`,
);
if (!source.includes("<!-- image-discovery -->"))
  source = source.replace(
    "<!-- /studio-discovery -->",
    "<!-- /studio-discovery -->\n<!-- image-discovery --><!-- /image-discovery -->",
  );
source = source.replace(
  /<!-- image-discovery -->[\s\S]*?<!-- \/image-discovery -->/,
  `<!-- image-discovery -->\n${homeImage()}\n<!-- /image-discovery -->`,
);
if (!source.includes("<!-- date-tools -->"))
  source = source.replace(
    '<section class="section wrap" id="lab">',
    '<!-- date-tools --><!-- /date-tools -->\n<section class="section wrap" id="lab">',
  );
source = source.replace(
  /<!-- date-tools -->[\s\S]*?<!-- \/date-tools -->/,
  `<!-- date-tools -->\n${homeDateSection()}\n<!-- /date-tools -->`,
);
source = homeMetadata(source, "en");
await writeFile("index.html", source);
await mkdir("fa", { recursive: true });
await writeFile("fa/index.html", homeMetadata(localize(source), "fa"));
const pairs = [["/", "/fa/"]];
for (const service of [null, ...services]) {
  pairs.push([
    servicePath("en", service?.slug),
    servicePath("fa", service?.slug),
  ]);
  for (const lang of ["en", "fa"]) {
    const path = servicePath(lang, service?.slug).slice(1);
    await mkdir(path, { recursive: true });
    await writeFile(path + "index.html", renderServicePage(lang, service));
  }
}
pairs.push([profilePath("en"), profilePath("fa")]);
for (const lang of ["en", "fa"]) {
  const path = profilePath(lang).slice(1);
  await mkdir(path, { recursive: true });
  await writeFile(path + "index.html", renderProfilePage(lang));
  const retired = (lang === "fa" ? "fa/" : "") + "playground/";
  await mkdir(retired, { recursive: true });
  await writeFile(retired + "index.html", retiredPlayground(lang));
}
pairs.push([imagePath("en"), imagePath("fa")]);
for (const lang of ["en", "fa"]) {
  const path = imagePath(lang).slice(1);
  await mkdir(path, { recursive: true });
  await writeFile(path + "index.html", renderImagePage(lang));
}
pairs.push([datePath("en"), datePath("fa")]);
for (const lang of ["en", "fa"]) {
  const path = datePath(lang).slice(1);
  await mkdir(path, { recursive: true });
  await writeFile(path + "index.html", renderDatePage(lang));
}
const alternatives = (pair) =>
  ["en", "fa", "x-default"]
    .map(
      (lang, i) =>
        `<xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL + pair[i === 1 ? 1 : 0]}"/>`,
    )
    .join("");
const urls = pairs.flatMap((pair) =>
  pair.map(
    (path) => `<url><loc>${SITE_URL + path}</loc>${alternatives(pair)}</url>`,
  ),
);
await writeFile(
  "sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    urls.join("") +
    "</urlset>\n",
);
console.log(`Built ${urls.length} static localized pages and sitemap.`);
