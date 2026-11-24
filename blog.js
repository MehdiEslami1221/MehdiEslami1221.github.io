import { recentBlogPosts } from "./blog-feed.mjs?v=20261124-blog1";
export function createBlogSection(root, getLanguage) {
  if (!root) return { render() {}, load() {} };
  const grid = root.querySelector(".blog-post-grid"),
    status = root.querySelector(".blog-status"),
    retry = root.querySelector(".blog-retry");
  let feed,
    state = "idle",
    pending = false;
  const text = (en, fa) => (getLanguage() === "fa" ? fa : en);
  function element(tag, className, value) {
    const node = document.createElement(tag);
    node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }
  function render() {
    const language = getLanguage();
    retry.textContent = text("Try again", "تلاش دوباره");
    retry.hidden = state !== "error";
    grid.setAttribute("aria-busy", String(state === "loading"));
    if (state !== "ready") {
      status.hidden = false;
      status.textContent =
        state === "error"
          ? text(
              "Recent posts could not be loaded. You can still open the blog.",
              "دریافت نوشته‌های تازه انجام نشد. می‌توانید وبلاگ را باز کنید.",
            )
          : state === "loading"
            ? text("Loading recent posts…", "در حال دریافت نوشته‌های تازه…")
            : text(
                "Read the latest posts on the blog.",
                "تازه‌ترین نوشته‌ها را در وبلاگ بخوانید.",
              );
      return;
    }
    const posts = recentBlogPosts(feed, language);
    grid.replaceChildren();
    grid.dataset.count = String(posts.length);
    grid.style.setProperty("--post-columns", String(Math.max(1, posts.length)));
    grid.hidden = !posts.length;
    status.hidden = posts.length > 0;
    status.textContent = text(
      "New posts will appear here once published.",
      "نوشته‌های تازه پس از انتشار در این بخش نمایش داده می‌شوند.",
    );
    for (const post of posts) {
      const card = element("a", "blog-post-card");
      card.href = post.url;
      const cover = element("div", "blog-post-cover");
      if (post.image) {
        const image = document.createElement("img");
        image.src = post.image.url;
        image.alt = post.image.alt;
        image.width = 800;
        image.height = 450;
        image.loading = "lazy";
        image.decoding = "async";
        cover.append(image);
      } else {
        cover.classList.add("blog-code-cover");
        cover.append(element("span", "", "{ … }"));
        cover.setAttribute("aria-hidden", "true");
      }
      const info = element("div", "blog-post-info");
      const meta = element("div", "blog-post-meta");
      meta.append(element("span", "", post.category));
      const badge = element(
        "span",
        "blog-post-language",
        post.language === "fa" ? "فارسی" : "English",
      );
      badge.lang = post.language;
      meta.append(badge);
      const title = element("h3", "blog-original", post.title),
        excerpt = element("p", "blog-original", post.excerpt);
      for (const node of [title, excerpt]) {
        node.lang = post.language;
        node.dir = post.language === "fa" ? "rtl" : "ltr";
      }
      const bottom = element("div", "blog-post-bottom"),
        date = element(
          "time",
          "",
          new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          }).format(new Date(post.publishedAt)),
        );
      date.dateTime = post.publishedAt;
      bottom.append(
        date,
        element(
          "span",
          "blog-read-link",
          text("Read post ↗", "خواندن نوشته ↗"),
        ),
      );
      info.append(meta, title, excerpt, bottom);
      card.append(cover, info);
      grid.append(card);
    }
  }
  async function load() {
    if (pending) return;
    pending = true;
    state = "loading";
    render();
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(
        "https://blog.mehdieslami.ir/latest-posts.json",
        { credentials: "omit", cache: "no-cache", signal: controller.signal },
      );
      if (!response.ok) throw new Error("Blog unavailable");
      feed = await response.json();
      recentBlogPosts(feed, "en");
      recentBlogPosts(feed, "fa");
      state = "ready";
    } catch {
      state = "error";
    } finally {
      clearTimeout(timer);
      pending = false;
      render();
    }
  }
  retry.addEventListener("click", load);
  return { render, load };
}
