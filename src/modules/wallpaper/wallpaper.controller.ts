import { getWallpaperService } from "./wallpaper.service";
import { Languages } from "../../utils/global.types";

export const getWallpaper = async ({
  query,
}: {
  query: { lang?: Languages; file?: string; region: string; date: string };
}) => {
  if (!query.date) {
    return { error: "Missing required parameters: date" };
  }

  // ✅ Defaults
  const lang = query.lang || Languages.ENGLISH;
  const file = query.file || "1";
  const region = query.region || "27";
  // ✅ Call Service to generate/get wallpaper
  const imageBuffer = await getWallpaperService(lang, file, region, query.date);

  if (!imageBuffer) return { error: "Could not generate wallpaper" };

  // ✅ Return image as response
  return new Response(imageBuffer, {
    headers: { "Content-Type": "image/jpeg" },
  });
};
