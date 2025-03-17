import * as cheerio from "cheerio";
import { env } from "../../utils/contants";
import type { PrayerTimes } from "../../utils/global.types";

const fetchWithRetry = async (
  url: string,
  retries = 3,
  delay = 3000
): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Fetching attempt ${i + 1}: ${url}`);
      const response = await fetch(url);
      if (response.ok) return response;
      console.warn(`Retry ${i + 1}: Failed with status ${response.status}`);
    } catch (error) {
      console.error(`Retry ${i + 1}: Error fetching`, error);
    }
    await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts.`);
};

export const scrapPrayerTimes = async (
  region: string,
  date: string
): Promise<PrayerTimes[]> => {
  try {
    const [year, month] = date.split("-");
    const url = `${env.WEBSITE_URL}/${region}/${parseInt(month!, 10)}`;
    const response = await fetchWithRetry(url);

    const html = await response.text();
    const $ = cheerio.load(html);
    const prayerTimes: PrayerTimes[] = [];

    $(".prayer_table tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 9) {
        const day = $(tds[1]).text().trim().padStart(2, "0");
        prayerTimes.push({
          date: `${year}-${month}-${day}`,
          Fajr: $(tds[3]).text().trim(),
          Sunrise: $(tds[4]).text().trim(),
          Dhuhr: $(tds[5]).text().trim(),
          Asr: $(tds[6]).text().trim(),
          Maghrib: $(tds[7]).text().trim(),
          Isha: $(tds[8]).text().trim(),
        });
      }
    });
    console.log("prayerTimes: ", prayerTimes);
    return prayerTimes;
  } catch (error) {
    console.error("❌ Error scraping prayer times:", error);
    return [];
  }
};
