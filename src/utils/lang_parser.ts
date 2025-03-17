import { Languages } from "./global.types"; // Import the Languages enum
import type { PrayerTimes } from "./global.types";

export const translatePrayerTimes = (
  data: PrayerTimes,
  language: Languages
) => {
  // Define translations for each language
  const translations = {
    [Languages.UZ_LATIN]: {
      date: "Sana",
      Fajr: "Bomdod",
      Sunrise: "Quyosh",
      Dhuhr: "Peshin",
      Asr: "Asr",
      Maghrib: "Shom",
      Isha: "Xufton",
    },
    [Languages.UZ_KIRIL]: {
      date: "Сана",
      Fajr: "Бомдод",
      Sunrise: "Қуёш",
      Dhuhr: "Пешин",
      Asr: "Аср",
      Maghrib: "Шом",
      Isha: "Хуфтон",
    },
    [Languages.ENGLISH]: {
      date: "Date",
      Fajr: "Fajr",
      Sunrise: "Sunrise",
      Dhuhr: "Dhuhr",
      Asr: "Asr",
      Maghrib: "Maghrib",
      Isha: "Isha",
    },
  };

  // Get the selected translation map
  const translationMap = translations[language];

  console.log("translationMap: ", translationMap);
  // ✅ Ensure the returned object matches `PrayerTime`
  return {
    [translationMap.date]: data.date,
    [translationMap.Fajr]: data.Fajr,
    [translationMap.Sunrise]: data.Sunrise,
    [translationMap.Dhuhr]: data.Dhuhr,
    [translationMap.Asr]: data.Asr,
    [translationMap.Maghrib]: data.Maghrib,
    [translationMap.Isha]: data.Isha,
  };
};
