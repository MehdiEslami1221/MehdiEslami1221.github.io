import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import {
  HOME_SEO,
  SITE_URL,
  homeSchema,
  homePath,
  servicePath,
} from "../seo.mjs";
import { services } from "../content/services.mjs";
import {profilePath} from "../content/profile.mjs";
const read = (path) =>
  readFile(path === "/" ? "index.html" : path.slice(1) + "index.html", "utf8");
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map((m) =>
    Object.fromEntries(
      [...m[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]),
    ),
  );
const schemas = (html) =>
  [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => JSON.parse(m[1]));
const pages = [
  {en:profilePath("en"),fa:profilePath("fa")},
  { en: "/", fa: "/fa/" },
  ...["", ...services.map((s) => s.slug)].map((slug) => ({
    en: servicePath("en", slug),
    fa: servicePath("fa", slug),
  })),
];
test("Every localized page has a unique title, self canonical and reciprocal language links", async () => {
  const titles = new Set(),
    descriptions = new Set();
  for (const pair of pages)
    for (const lang of ["en", "fa"]) {
      const path = pair[lang],
        html = await read(path),
        head = html.split("</head>")[0];
      const title = head.match(/<title>([^<]+)<\/title>/)?.[1];
      assert.ok(title);
      assert.ok(!titles.has(title), title);
      titles.add(title);
      const metas = tags(head, "meta");
      const desc = metas.find((m) => m.name === "description")?.content;
      assert.ok(desc?.length > 65);
      assert.ok(!descriptions.has(desc), path);
      descriptions.add(desc);
      const links = tags(head, "link");
      assert.equal(
        links.find((l) => l.rel === "canonical")?.href,
        SITE_URL + path,
      );
      for (const code of ["en", "fa", "x-default"])
        assert.equal(
          links.find((l) => l.rel === "alternate" && l.hreflang === code)?.href,
          SITE_URL + pair[code === "fa" ? "fa" : "en"],
        );
      assert.equal(
        metas.find((m) => m.property === "og:url")?.content,
        SITE_URL + path,
      );
      assert.equal(
        metas.find((m) => m.property === "og:title")?.content,
        title,
      );
      assert.equal(
        metas.find((m) => m.name === "twitter:description")?.content,
        desc,
      );
      assert.match(html, new RegExp(`lang="${lang}"`));
      assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
      assert.ok(
        !metas.some(
          (m) => m.name === "robots" && m.content.includes("noindex"),
        ),
        path,
      );
    }
  assert.equal(titles.size, 14);
});
test("All fourteen pages are in the sitemap and all local HTML links and resources resolve", async () => {
  const sitemap = await readFile("sitemap.xml", "utf8");
  const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert.equal(new Set(locs).size, 14);
  for (const pair of pages)
    for (const lang of ["en", "fa"]) {
      const path = pair[lang],
        html = await read(path);
      assert.ok(locs.includes(SITE_URL + path));
      for (const attr of [
        ...tags(html, "a"),
        ...tags(html, "img"),
        ...tags(html, "link"),
        ...tags(html, "script"),
      ]) {
        const target = attr.href || attr.src;
        if (!target || !target.startsWith("/") || target.startsWith("//"))
          continue;
        const pathname = new URL(target, SITE_URL).pathname;
        const local =
          pathname === "/"
            ? "index.html"
            : pathname.slice(1) + (pathname.endsWith("/") ? "index.html" : "");
        await access(local);
      }
      for (const service of services)
        assert.ok(
          html.includes(servicePath(lang, service.slug)),
          path + " links to " + service.slug,
        );
    }
});
test("Structured data describes the visible owner and service without invented ratings or prices", async () => {
  for (const pair of pages)
    for (const lang of ["en", "fa"]) {
      const path = pair[lang],
        html = await read(path),
        data = schemas(html);
      assert.equal(data.length, 1);
      const graph = data[0]["@graph"];
      assert.ok(Array.isArray(graph));
      const person = graph.find((n) => n["@type"] === "Person");
      assert.equal(person["@id"], SITE_URL + "/#me");
      assert.equal(person.name, lang === "fa" ? "مهدی اسلامی" : "Mehdi Eslami");
      assert.ok(
        person.alternateName.includes(
          lang === "fa" ? "Mehdi Eslami" : "مهدی اسلامی",
        ),
      );
      const page = graph.find((n) =>
        ["ProfilePage", "WebPage", "CollectionPage"].includes(n["@type"]),
      );
      assert.equal(page.url, SITE_URL + path);
      assert.equal(page.inLanguage, lang);
      assert.ok(
        !JSON.stringify(data).match(
          /aggregateRating|reviewCount|priceCurrency|streetAddress/,
        ),
      );
      if (page["@type"] === "WebPage" && path.includes("/services/")) {
        const service = graph.find((n) => n["@type"] === "Service");
        assert.ok(service);
        assert.ok(html.includes(service.description.replaceAll("&", "&amp;")));
        assert.equal(service.provider["@id"], person["@id"]);
        assert.equal(page.mainEntity["@id"], service["@id"]);
      }
    }
  for (const lang of ["en", "fa"])
    assert.equal(
      homeSchema(lang)["@graph"].find((n) => n["@type"] === "ProfilePage").name,
      HOME_SEO[lang].title,
    );
  const notFound = await readFile("404.html", "utf8");
  assert.match(notFound, /noindex/);
});
