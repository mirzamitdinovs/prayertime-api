import { Languages } from "../../utils/global.types";
import { getPrayerTimesService } from "./prayer_time.service";

export const getPrayerTimes = async ({
  query,
}: {
  query: { date: string; lang?: string };
}) => {
  if (!query.date) {
    return { error: "Missing required parameters: date and region" };
  }
  const userLang = query.lang || Languages.ENGLISH;
  const prayerTimes = await getPrayerTimesService(
    query.date,
    "27",
    userLang as Languages
  );

  if (!prayerTimes) return { error: "Prayer times not found" };
  if (prayerTimes.id) {
    delete prayerTimes.id;
  }
  return prayerTimes;
};
