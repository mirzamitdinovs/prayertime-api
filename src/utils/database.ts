import { Database } from "bun:sqlite";

// ✅ Initialize a single database
export const db = new Database("app.db");

// ✅ Create the prayer_times table
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
  )
`);

// ✅ Create the wallpaper_cache table
db.run(`
  CREATE TABLE IF NOT EXISTS wallpaper_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cache_key TEXT UNIQUE NOT NULL,
    image BLOB NOT NULL
  )
`);

console.log("✅ Database initialized (app.db)");
