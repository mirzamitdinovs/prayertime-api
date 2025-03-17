import { db } from "../../utils/database"; // ✅ Use the single database instance
import { scrapPrayerTimes } from "../prayer_time";
import { generatePrayerTimeImage } from "./wallpaper.generator";
import type { Languages, PrayerTimes } from "../../utils/global.types";

// ✅ Ensure tables exist inside a single DB
db.run(`
  CREATE TABLE IF NOT EXISTS prayer_times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL,
    Fajr TEXT NOT NULL,
    Sunrise TEXT NOT NULL,
    Dhuhr TEXT NOT NULL,
    Asr TEXT NOT NULL,
    Maghrib TEXT NOT NULL,
    Isha TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wallpaper_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cache_key TEXT UNIQUE NOT NULL,
    image BLOB NOT NULL
  );
`);

/**
 * ✅ Get Cached Prayer Times from DB
 */
const getCachedPrayerTimes = (date: string): PrayerTimes | null => {
  return db
    .query("SELECT * FROM prayer_times WHERE date = ?")
    .get(date) as PrayerTimes | null;
};

/**
 * ✅ Get or Generate Wallpaper
 */
export const getWallpaperService = async (
  lang: Languages,
  file: string,
  region: string,
  date: string
): Promise<Buffer | null> => {
  const wallpaper = `wallpaper-${file}.jpg`;
  const cacheKey = `wallpaper:${lang}:${wallpaper}:${date}`;

  // ✅ Check if wallpaper image is cached
  const cachedWallpaper = db
    .query("SELECT image FROM wallpaper_cache WHERE cache_key = ?")
    .get(cacheKey) as { image: Buffer } | null;

  if (cachedWallpaper) {
    console.log("✅ Returning cached wallpaper");
    return cachedWallpaper.image;
  }

  console.log("🔄 Checking for cached prayer times...");
  let prayerTimes = getCachedPrayerTimes(date);

  if (!prayerTimes) {
    console.log("❌ No cached prayer times found. Scraping fresh data...");
    const fullMonthData = await scrapPrayerTimes(region, date);
    prayerTimes = fullMonthData.find((day) => day.date === date) ?? null;

    if (!prayerTimes) return null;
  }

  console.log("🔄 Generating wallpaper...");
  const imageBuffer = await generatePrayerTimeImage(
    lang,
    wallpaper,
    prayerTimes
  );

  // ✅ Save wallpaper to cache
  db.run(
    "INSERT OR REPLACE INTO wallpaper_cache (cache_key, image) VALUES (?, ?)",
    [cacheKey, imageBuffer] // ✅ Pass parameters as an array
  );

  console.log("✅ Wallpaper cached successfully.");

  return imageBuffer;
};

/**
 * ✅ Delete previous month's wallpaper images & prayer times
 */
export const cleanupOldWallpapers = () => {
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0"); // Two-digit month
  const currentYear = today.getFullYear();

  console.log(
    `🗑 Cleaning up data older than ${currentYear}-${currentMonth}...`
  );

  db.run(`DELETE FROM prayer_times WHERE SUBSTR(date, 1, 7) < ?`, [
    `${currentYear}-${currentMonth}`,
  ]);

  db.run(`DELETE FROM wallpaper_cache WHERE SUBSTR(cache_key, -7, 7) < ?`, [
    `${currentYear}-${currentMonth}`,
  ]);

  console.log("✅ Old prayer times and wallpapers deleted.");
};
