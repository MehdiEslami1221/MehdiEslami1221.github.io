// Short excerpts with source links; Persian text is a translation of each excerpt.
const perlis = "https://www.cs.yale.edu/homes/perlis-alan/quotes.html";
const jobs = "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says";
const gates = "https://www.gatesnotes.com/NAU-Commencement-Speech";
const zen = "https://peps.python.org/pep-0020/";
export const QUOTE_INTERVAL_MS = 10_000;
export const quotes = [
  { text: "Simplicity does not precede complexity, but follows it.", fa: "سادگی پیش از پیچیدگی به دست نمی‌آید؛ پس از آن حاصل می‌شود.", author: "Alan Perlis", faAuthor: "آلن پرلیس", source: perlis },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", fa: "زمان شما محدود است؛ آن را صرف زندگی‌کردن به جای دیگران نکنید.", author: "Steve Jobs", faAuthor: "استیو جابز", source: jobs },
  { text: "You are not a slacker if you cut yourself some slack.", fa: "اگر کمی به خودتان استراحت بدهید، به این معنا نیست که تنبل هستید.", author: "Bill Gates", faAuthor: "بیل گیتس", source: gates },
  { text: "Simple is better than complex.", fa: "سادگی بهتر از پیچیدگی است.", author: "Tim Peters", faAuthor: "تیم پیترز", source: zen },
  { text: "Make something people want.", fa: "چیزی بسازید که مردم به آن نیاز دارند.", author: "Paul Graham", faAuthor: "پل گراهام", source: "https://www.paulgraham.com/good.html" },
  { text: "Premature optimization is the root of all evil.", fa: "بهینه‌سازی زودهنگام، ریشهٔ بسیاری از دردسرهاست.", author: "Donald Knuth", faAuthor: "دونالد کنوت", source: "https://web.stanford.edu/class/archive/cs/cs107/cs107.1224/lectures/16/16-Optimization.html" },
  { text: "This is for everyone.", fa: "این برای همه است.", author: "Tim Berners-Lee", faAuthor: "تیم برنرز لی", source: "https://www.w3.org/news/2012/this-is-for-everyone-the-tweet-heard-around-the-world/" },
  { text: "One man's constant is another man's variable.", fa: "آنچه برای یک نفر ثابت است، برای دیگری متغیر است.", author: "Alan Perlis", faAuthor: "آلن پرلیس", source: perlis },
  { text: "The tools we use have a profound (and devious!) influence on our thinking habits, and, therefore, on our thinking abilities.", fa: "ابزارهایی که به کار می‌بریم، تأثیری عمیق بر عادت‌های فکری و در نتیجه بر توانایی اندیشیدن ما دارند.", author: "Edsger W. Dijkstra", faAuthor: "ادسخر دایکسترا", source: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html" },
  { text: "Readability counts.", fa: "خوانایی اهمیت دارد.", author: "Tim Peters", faAuthor: "تیم پیترز", source: zen },
  { text: "It's easier to ask forgiveness than it is to get permission.", fa: "عذرخواهی‌کردن آسان‌تر از اجازه‌گرفتن است.", author: "Grace Hopper", faAuthor: "گریس هاپر", source: "https://www.history.navy.mil/news-and-events/news/2026/code-commission-character-grace-hopper.html" },
  { text: "So keep looking. Don’t settle.", fa: "پس به جست‌وجو ادامه دهید؛ به چیزی کمتر از خواسته‌تان رضایت ندهید.", author: "Steve Jobs", faAuthor: "استیو جابز", source: jobs },
  { text: "Take a break when you need to.", fa: "هر وقت به استراحت نیاز دارید، به خودتان فرصت بدهید.", author: "Bill Gates", faAuthor: "بیل گیتس", source: gates },
  { text: "When you have an idea for a startup, ask yourself: who wants this right now?", fa: "وقتی ایده‌ای برای یک کسب‌وکار دارید، از خودتان بپرسید: همین حالا چه کسی به آن نیاز دارد؟", author: "Paul Graham", faAuthor: "پل گراهام", source: "https://paulgraham.com/startupideas.html" },
  { text: "Optimization hinders evolution.", fa: "بهینه‌سازی می‌تواند مانع تکامل شود.", author: "Alan Perlis", faAuthor: "آلن پرلیس", source: perlis },
  { text: "If the implementation is hard to explain, it's a bad idea.", fa: "اگر توضیح پیاده‌سازی دشوار است، ایدهٔ خوبی نیست.", author: "Tim Peters", faAuthor: "تیم پیترز", source: zen },
];
