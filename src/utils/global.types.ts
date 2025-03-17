export enum Languages {
  UZ_KIRIL = "uz-kiril",
  UZ_LATIN = "uz-latin",
  ENGLISH = "english",
}

export type PrayerTimes = {
  id?: string;
  date: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};
