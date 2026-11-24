import test from "node:test";
import assert from "node:assert/strict";
import { recentBlogPosts } from "../blog-feed.mjs";
const post = (id, overrides = {}) => ({
  id,
  title: "یادداشت فارسی",
  excerpt: "متن مقاله",
  language: "fa",
  url: `http://blog.mehdieslami.ir/posts/post-${id}/`,
  publishedAt: `2026-01-${String(id).padStart(2, "0")}`,
  category: { titleFa: "اخبار", titleEn: "News" },
  ...overrides,
});
test("The portfolio shows at most four newest unique posts and keeps original-language text in either interface", () => {
  const list = [post(1), post(5), post(3), post(2), post(4), post(5)];
  const feed = { version: 1, posts: { en: list, fa: list } };
  const en = recentBlogPosts(feed, "en");
  assert.equal(en.length, 4);
  assert.deepEqual(
    en.map((p) => new Date(p.publishedAt).getUTCDate()),
    [5, 4, 3, 2],
  );
  assert.equal(en[0].category, "News");
  assert.equal(en[0].language, "fa");
  assert.equal(en[0].title, "یادداشت فارسی");
  assert.match(en[0].url, /^https:/);
  assert.equal(recentBlogPosts(feed, "fa")[0].category, "اخبار");
});
test("Unpublished dates, foreign destinations and unsafe image sources cannot become portfolio cards", () => {
  const list = [
    post(1, { url: "javascript:alert(1)" }),
    post(2, { url: "https://evil.test/posts/post-2/" }),
    post(3, { publishedAt: "2099-01-01" }),
    post(4, { url: "https://blog.mehdieslami.ir/posts/%2e%2e/" }),
    post(5, { image: { url: "https://evil.test/a.jpg", alt: "x" } }),
  ];
  const result = recentBlogPosts({ version: 1, posts: { en: list } }, "en");
  assert.equal(result.length, 1);
  assert.equal(result[0].image, undefined);
  assert.throws(
    () => recentBlogPosts({ version: 2, posts: {} }, "en"),
    /Invalid/,
  );
  assert.deepEqual(
    recentBlogPosts({ version: 1, posts: { en: [] } }, "en"),
    [],
  );
});
