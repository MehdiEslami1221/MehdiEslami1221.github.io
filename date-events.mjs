import { parts, weekday } from "./date-core.mjs?v=20261123-date1";
export const eventSources = {
  iran: "https://calendar.ut.ac.ir/documents/2139738/7092644/Calendar-1405.pdf",
  copy: "https://www.avazehgostar.com/file/pdf/calendar_1405",
  international: "https://www.un.org/en/observances/list-days-weeks",
};
// Selected observances, not an exhaustive historical holiday database.
const persian = [
  [1, 1, "Nowruz", "نوروز"],
  [1, 2, "Nowruz holiday", "عید نوروز"],
  [1, 3, "Nowruz holiday", "عید نوروز"],
  [1, 4, "Nowruz holiday", "عید نوروز"],
  [1, 12, "Islamic Republic Day", "روز جمهوری اسلامی"],
  [1, 13, "Nature Day", "روز طبیعت"],
  [1, 25, "Attar commemoration", "روز بزرگداشت عطار"],
  [2, 1, "Saadi commemoration", "روز بزرگداشت سعدی"],
  [2, 3, "Architecture Day", "روز معمار"],
  [2, 10, "Persian Gulf Day", "روز خلیج فارس"],
  [2, 12, "Teachers’ Day in Iran", "روز معلم"],
  [
    2,
    25,
    "Persian Language and Ferdowsi Day",
    "روز زبان فارسی و بزرگداشت فردوسی",
  ],
  [2, 28, "Khayyam commemoration", "روز بزرگداشت خیام"],
  [3, 3, "Khorramshahr liberation anniversary", "سالروز آزادسازی خرمشهر"],
  [3, 14, "Imam Khomeini anniversary", "رحلت امام خمینی"],
  [3, 15, "15 Khordad anniversary", "قیام ۱۵ خرداد"],
  [4, 14, "Municipalities Day", "روز شهرداری و دهیاری"],
  [4, 22, "Information Technology Day", "روز فناوری اطلاعات"],
  [5, 17, "Journalists’ Day", "روز خبرنگار"],
  [6, 1, "Physicians’ Day", "روز پزشک"],
  [6, 4, "Employees’ Day", "روز کارمند"],
  [6, 5, "Pharmacists’ Day", "روز داروساز"],
  [6, 21, "Cinema Day", "روز سینما"],
  [6, 27, "Persian Poetry and Literature Day", "روز شعر و ادب فارسی"],
  [7, 1, "Start of the school year in Iran", "آغاز سال تحصیلی"],
  [7, 8, "Rumi commemoration", "روز بزرگداشت مولوی"],
  [7, 20, "Hafez commemoration", "روز بزرگداشت حافظ"],
  [8, 13, "School Students’ Day", "روز دانش‌آموز"],
  [8, 24, "Book and Reading Day", "روز کتاب و کتاب‌خوانی"],
  [9, 7, "Navy Day", "روز نیروی دریایی"],
  [9, 15, "Accountants’ Day", "روز حسابدار"],
  [9, 16, "University Students’ Day", "روز دانشجو"],
  [9, 25, "Research Day", "روز پژوهش"],
  [9, 30, "Yalda Night", "شب یلدا"],
  [
    11,
    22,
    "Anniversary of the Islamic Revolution",
    "سالروز پیروزی انقلاب اسلامی",
  ],
  [12, 5, "Engineers’ Day", "روز مهندس"],
  [12, 15, "Tree Planting Day", "روز درختکاری"],
  [12, 29, "Oil Nationalization Day", "روز ملی شدن صنعت نفت"],
];
const international = [
  [1, 1, "Gregorian New Year", "آغاز سال میلادی"],
  [2, 21, "International Mother Language Day", "روز جهانی زبان مادری"],
  [3, 8, "International Women’s Day", "روز جهانی زن"],
  [3, 22, "World Water Day", "روز جهانی آب"],
  [4, 22, "International Mother Earth Day", "روز جهانی زمین"],
  [5, 1, "International Workers’ Day", "روز جهانی کارگر"],
  [6, 5, "World Environment Day", "روز جهانی محیط زیست"],
  [
    11,
    25,
    "International Day for the Elimination of Violence against Women",
    "روز جهانی منع خشونت علیه زنان",
  ],
  [12, 1, "World AIDS Day", "روز جهانی ایدز"],
  [
    12,
    3,
    "International Day of Persons with Disabilities",
    "روز جهانی افراد دارای معلولیت",
  ],
  [12, 10, "Human Rights Day", "روز جهانی حقوق بشر"],
];
// Dates reviewed against the published 1405 calendar. Never repeat these in another year.
const holidays1405 = [
  [1, 1, "Eid al-Fitr", "عید فطر"],
  [1, 2, "Eid al-Fitr holiday", "تعطیل عید فطر"],
  [1, 25, "Martyrdom of Imam Ja’far al-Sadiq", "شهادت امام جعفر صادق"],
  [3, 6, "Eid al-Adha", "عید قربان"],
  [3, 14, "Eid al-Ghadir", "عید غدیر"],
  [4, 3, "Tasu’a", "تاسوعا"],
  [4, 4, "Ashura", "عاشورا"],
  [5, 13, "Arbaeen", "اربعین"],
  [
    5,
    21,
    "Prophet Muhammad and Imam Hasan anniversary",
    "رحلت پیامبر و شهادت امام حسن",
  ],
  [5, 22, "Martyrdom of Imam Reza", "شهادت امام رضا"],
  [5, 30, "Martyrdom of Imam Hasan al-Askari", "شهادت امام حسن عسکری"],
  [
    6,
    8,
    "Birth of Prophet Muhammad and Imam Ja’far al-Sadiq",
    "میلاد پیامبر و امام جعفر صادق",
  ],
  [8, 22, "Martyrdom of Fatima al-Zahra", "شهادت حضرت فاطمه"],
  [10, 2, "Birth of Imam Ali · Father’s Day", "میلاد امام علی و روز پدر"],
  [10, 16, "Mab’ath", "مبعث پیامبر"],
  [11, 4, "Birth of Imam Mahdi", "میلاد امام مهدی"],
  [12, 9, "Martyrdom of Imam Ali", "شهادت امام علی"],
  [12, 19, "Eid al-Fitr", "عید فطر"],
  [12, 20, "Eid al-Fitr holiday", "تعطیل عید فطر"],
];
const fixedHolidays = new Set([
  "1-1",
  "1-2",
  "1-3",
  "1-4",
  "1-12",
  "1-13",
  "3-14",
  "3-15",
  "11-22",
  "12-29",
]);
export function eventsOn(day) {
  const p = parts(day, "persian"),
    g = parts(day, "gregory"),
    out = [];
  for (const [month, date, en, fa] of persian)
    if (p.month === month && p.day === date)
      out.push({
        en,
        fa,
        kind: "iran",
        holiday: p.year === 1405 && fixedHolidays.has(`${month}-${date}`),
      });
  for (const [month, date, en, fa] of international)
    if (g.month === month && g.day === date)
      out.push({ en, fa, kind: "international", holiday: false });
  if (p.year === 1405) {
    for (const [month, date, en, fa] of holidays1405)
      if (p.month === month && p.day === date)
        out.push({ en, fa, kind: "iran1405", holiday: true });
    if (p.month === 9 && p.day === 9)
      out.push({
        en: "Mother’s Day in Iran · Birth of Fatima al-Zahra",
        fa: "روز مادر و میلاد حضرت فاطمه",
        kind: "iran1405",
        holiday: false,
      });
  }
  const jan1 = Math.floor(Date.UTC(g.year, 0, 1) / 86400000);
  if (day - jan1 === 255)
    out.push({
      en: "Programmer’s Day",
      fa: "روز برنامه‌نویس",
      kind: "international",
      holiday: false,
    });
  return out;
}
export function eventsBetween(start, end) {
  const result = [];
  for (let day = start; day <= end && day < start + 370; day++) {
    const entries = eventsOn(day);
    if (entries.length) result.push({ day, entries });
  }
  return result;
}
export const isFriday = (day) => weekday(day) === 5;
