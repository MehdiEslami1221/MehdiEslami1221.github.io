const BLOG_ORIGIN = "https://blog.mehdieslami.ir";
export function recentBlogPosts(feed, language, now = Date.now()) {
  const list = feed?.version === 1 && feed.posts?.[language];
  if (!Array.isArray(list)) throw new Error("Invalid blog feed");
  const seen = new Set();
  return list
    .slice(0, 20)
    .flatMap((item) => {
      if (
        !item ||
        !["fa", "en"].includes(item.language) ||
        typeof item.title !== "string" ||
        !item.title.trim()
      )
        return [];
      const date = Date.parse(item.publishedAt);
      if (!Number.isFinite(date) || date > now) return [];
      let url;
      try {
        url = new URL(item.url);
        if (
          !["http:", "https:"].includes(url.protocol) ||
          url.hostname !== "blog.mehdieslami.ir" ||
          url.username ||
          url.password ||
          url.port
        )
          return [];
        const path = url.pathname.match(/^\/(en\/)?posts\/([^/]+)\/$/);
        if (
          !path ||
          (path[1] ? "en" : "fa") !== item.language ||
          !/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(
            decodeURIComponent(path[2]),
          )
        )
          return [];
        url = new URL(url.pathname, BLOG_ORIGIN).href;
      } catch {
        return [];
      }
      if (seen.has(url)) return [];
      seen.add(url);
      let image;
      try {
        const src = new URL(item.image?.url);
        if (src.protocol === "https:" && src.hostname === "cdn.sanity.io") {
          src.searchParams.set("w", "800");
          src.searchParams.set("fit", "max");
          src.searchParams.set("auto", "format");
          image = {
            url: src.href,
            alt:
              typeof item.image.alt === "string"
                ? item.image.alt.slice(0, 500)
                : "",
          };
        }
      } catch {}
      return [
        {
          url,
          image,
          language: item.language,
          publishedAt: new Date(date).toISOString(),
          title: item.title.trim().slice(0, 180),
          excerpt:
            typeof item.excerpt === "string" ? item.excerpt.slice(0, 400) : "",
          category:
            typeof item.category?.[
              language === "fa" ? "titleFa" : "titleEn"
            ] === "string"
              ? item.category[language === "fa" ? "titleFa" : "titleEn"].slice(
                  0,
                  60,
                )
              : language === "fa"
                ? "نوشته"
                : "Journal",
        },
      ];
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 4);
}
