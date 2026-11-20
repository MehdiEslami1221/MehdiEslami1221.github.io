// Shared by the static builder and the homepage language controller.
export const SITE_URL = "https://mehdieslami.ir";
export const HOME_SEO = {
  en: {
    title: "Mehdi Eslami | Web Developer & Java Programmer",
    description:
      "Mehdi Eslami develops websites, custom web applications, Java and Spring Boot APIs, and Android apps. Explore real projects and discuss your software requirements.",
    imageAlt: "Mehdi Eslami — web, Java and Android developer",
  },
  fa: {
    title: "مهدی اسلامی | طراحی سایت و برنامه‌نویسی اختصاصی",
    description:
      "مهدی اسلامی؛ طراح سایت و برنامه‌نویس جاوا، وب و اندروید. نمونه‌کارها و خدمات طراحی وب‌سایت، ساخت سامانه و توسعه بک‌اند را ببین و برای سفارش پروژه تماس بگیر.",
    imageAlt: "مهدی اسلامی؛ توسعه‌دهنده وب، جاوا و اندروید",
  },
};
export const homePath = (lang) => (lang === "fa" ? "/fa/" : "/");
export const servicePath = (lang, slug = "") =>
  `${lang === "fa" ? "/fa" : ""}/services/${slug ? slug + "/" : ""}`;
export function personSchema(lang) {
  return {
    "@type": "Person",
    "@id": SITE_URL + "/#me",
    name: lang === "fa" ? "مهدی اسلامی" : "Mehdi Eslami",
    alternateName: lang === "fa" ? ["Mehdi Eslami"] : ["مهدی اسلامی"],
    url: SITE_URL + "/",
    image: SITE_URL + "/assets/portrait.webp",
    jobTitle: lang === "fa" ? "توسعه‌دهنده نرم‌افزار" : "Software Developer",
    description: HOME_SEO[lang].description,
    knowsAbout: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "Next.js",
      "Web development",
      "Android",
      "Kotlin",
    ],
    sameAs: [
      "https://github.com/MehdiEslami1221",
      "https://www.linkedin.com/in/mehdi-eslami/",
      "https://www.instagram.com/mage.code/",
      "https://t.me/Mr_MehdiEslami",
    ],
  };
}
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_URL + "/#website",
    url: SITE_URL + "/",
    name: "Mehdi Eslami",
    alternateName: ["مهدی اسلامی", "mehdieslami.ir"],
    inLanguage: ["en", "fa"],
    publisher: { "@id": SITE_URL + "/#me" },
  };
}
export function homeSchema(lang) {
  const url = SITE_URL + homePath(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteSchema(),
      personSchema(lang),
      {
        "@type": "ProfilePage",
        "@id": url + "#profile",
        url,
        name: HOME_SEO[lang].title,
        description: HOME_SEO[lang].description,
        inLanguage: lang,
        isPartOf: { "@id": SITE_URL + "/#website" },
        mainEntity: { "@id": SITE_URL + "/#me" },
      },
    ],
  };
}
