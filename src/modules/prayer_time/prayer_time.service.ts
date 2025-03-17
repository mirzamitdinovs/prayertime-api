import { scrapPrayerTimes } from "./prayer_time.scraper"; // ✅ Import Scraper
import { translatePrayerTimes } from "../../utils/lang_parser"; // ✅ Import Parser
import type { Languages, PrayerTimes } from "../../utils/global.types"; // ✅ Import types
import { db } from "../../utils/database"; // ✅ Use the single database instance

// ✅ Ensure the table exists
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
 * ✅ Get prayer times for a specific day & parse it into the requested language
 */
export const getPrayerTimesService = async (
  date: string,
  region: string,
  lang: Languages
): Promise<Record<string, string> | null> => {
  let row = db
    .query("SELECT * FROM prayer_times WHERE date = ?")
    .get(date) as PrayerTimes | null;

  if (!row) {
    console.log("🔄 Fetching fresh prayer times for:", date);

    // ✅ Scrape and cache the full month's prayer times
    const fullMonthData = await scrapPrayerTimes(region, date);

    if (fullMonthData.length > 0) {
      cachePrayerTimes(fullMonthData); // Save to DB
      row = fullMonthData.find((day) => day.date === date) || null;
    }
  }

  // ✅ If still no data, return null
  if (!row) return null;

  // ✅ Parse the prayer times into the requested language
  return translatePrayerTimes(row, lang);
};

/**
 * ✅ Cache the entire month's prayer times in SQLite
 */
const cachePrayerTimes = (data: PrayerTimes[]) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO prayer_times (date, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    data.forEach((prayer) => {
      stmt.run(
        prayer.date, // Already in YYYY-MM-DD format
        prayer.Fajr,
        prayer.Sunrise,
        prayer.Dhuhr,
        prayer.Asr,
        prayer.Maghrib,
        prayer.Isha
      );
    });
  })();

  console.log("✅ Prayer times cached successfully.");
};

/**
 * ✅ Delete previous month's prayer times & wallpaper cache
 */
export const cleanupOldPrayerTimes = () => {
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0"); // Ensure two digits
  const currentYear = today.getFullYear();

  console.log(
    `🗑 Cleaning up prayer times older than ${currentYear}-${currentMonth}...`
  );

  db.run(`DELETE FROM prayer_times WHERE SUBSTR(date, 1, 7) < ?`, [
    `${currentYear}-${currentMonth}`,
  ]);

  db.run(`DELETE FROM wallpaper_cache WHERE cache_key NOT LIKE ?`, [
    `%${currentYear}-${currentMonth}-%`,
  ]);

  console.log("✅ Old prayer times and wallpaper cache deleted.");
};
