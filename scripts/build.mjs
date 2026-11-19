import { readFile, writeFile, mkdir } from "node:fs/promises";
let html = await readFile("index.html", "utf8");
const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
const escape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
html = html.replace(
  /<([a-z0-9]+)\b([^<>]*\bdata-en="[^"]*"[^<>]*\bdata-fa="([^"]*)"[^<>]*)>[^<]*<\/\1\s*>/g,
  (_, tag, attrs, value) => `<${tag}${attrs}>${escape(decode(value))}</${tag}>`,
);
html = html.replace(/<[^>]+>/g, (tag) => {
  for (const [data, attr] of [
    ["placeholder", "placeholder"],
    ["aria", "aria-label"],
    ["alt", "alt"],
  ]) {
    const match = tag.match(new RegExp(`data-${data}-fa="([^"]*)"`));
    if (match)
      tag = tag.replace(
        new RegExp(`(?<![\\w-])${attr}="[^"]*"`),
        `${attr}="${match[1]}"`,
      );
  }
  return tag;
});
html = html.replace('<html dir="ltr" lang="en">', '<html dir="rtl" lang="fa">');
html = html.replace(
  /<title>[^<]*<\/title>/,
  "<title>مهدی اسلامی | توسعه‌دهندهٔ جاوا، وب و اندروید</title>",
);
const description =
  "من مهدی اسلامی‌ام؛ بک‌اند جاوا، سایت و اپلیکیشن اندروید می‌سازم. نمونه‌کارهام رو ببین، دموها رو امتحان کن و از پروژه‌ات بگو.";
html = html.replace(/<meta\b[^>]*>/g, (tag) => {
  if (
    /(?:name|property)="(?:description|og:description|twitter:description)"/.test(
      tag,
    )
  )
    return tag.replace(/content="[^"]*"/, `content="${description}"`);
  if (/(?:name|property)="(?:og:title|twitter:title)"/.test(tag))
    return tag.replace(
      /content="[^"]*"/,
      'content="مهدی اسلامی | توسعه‌دهندهٔ جاوا، وب و اندروید"',
    );
  if (/property="og:locale"/.test(tag)) return tag.replace("en_US", "fa_IR");
  if (/property="og:url"/.test(tag))
    return tag.replace("https://mehdieslami.ir/", "https://mehdieslami.ir/fa/");
  return tag;
});
html = html.replace(
  /<link\b[^>]*rel="canonical"[^>]*>/,
  '<link rel="canonical" href="https://mehdieslami.ir/fa/">',
);
html = html.replace(
  /<a([^>]*class="language-switch"[^>]*)>\s*فارسی\s*<\/a\s*>/,
  '<a class="language-switch" href="/" lang="en" hreflang="en">EN</a>',
);
html = html.replace(/(<blockquote\b[^>]*id="quote-text"[^>]*>)[\s\S]*?(<\/blockquote\s*>)/, '$1سادگی قبل از پیچیدگی نمی‌آد؛ بعد از اون به دست می‌آد.$2');
html = html.replace(/(<span\b[^>]*id="quote-author"[^>]*>)[\s\S]*?(<\/span\s*>)/, '$1آلن پرلیس$2');
html = html.replace(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  (_, json) => {
    const schema = JSON.parse(json);
    schema.url = "https://mehdieslami.ir/fa/";
    schema["@id"] = "https://mehdieslami.ir/fa/#profile";
    schema.inLanguage = "fa";
    schema.name = "مهدی اسلامی — توسعه‌دهندهٔ نرم‌افزار";
    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
  },
);
await mkdir("fa", { recursive: true });
await writeFile("fa/index.html", html);
await writeFile(
  "sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    ["", "fa/"]
      .map(
        (route) =>
          `<url><loc>https://mehdieslami.ir/${route}</loc><xhtml:link rel="alternate" hreflang="en" href="https://mehdieslami.ir/"/><xhtml:link rel="alternate" hreflang="fa" href="https://mehdieslami.ir/fa/"/></url>`,
      )
      .join("") +
    "</urlset>\n",
);
console.log("Built Persian route and bilingual sitemap.");
