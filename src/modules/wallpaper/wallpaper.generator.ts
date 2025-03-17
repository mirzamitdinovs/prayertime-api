import { createCanvas, loadImage } from "canvas";
import { translatePrayerTimes } from "../../utils/lang_parser";
import { Languages, PrayerTimes } from "../../utils/global.types";

const phoneWidth = 720; // Optimized resolution
const phoneHeight = 1560;
export const generatePrayerTimeImage = async (
  language: string,
  wallpaper: string,
  prayerTimes: PrayerTimes
): Promise<Buffer> => {
  const canvas = createCanvas(phoneWidth, phoneHeight);
  const ctx = canvas.getContext("2d");

  try {
    // Parse the prayer times for the specified language
    const translatedPrayerTimes = translatePrayerTimes(
      prayerTimes,
      language as Languages
    );

    // Extract the date text and prayer times list
    const dateText =
      translatedPrayerTimes["Date"] ||
      translatedPrayerTimes["Sana"] ||
      translatedPrayerTimes["Сана"];

    const prayerTimesList = Object.entries(translatedPrayerTimes).filter(
      ([key]) => key !== "Date" && key !== "Sana" && key !== "Сана"
    );

    // Load and draw the background image
    const backgroundImage = await loadImage(`./public/wallpapers/${wallpaper}`);
    ctx.drawImage(backgroundImage, 0, 0, phoneWidth, phoneHeight);

    // Add a blurred overlay
    (ctx as any).filter = "blur(10px)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, phoneWidth, phoneHeight);
    (ctx as any).filter = "none"; // Reset filter

    // Calculate the total height of the prayer times section dynamically
    const totalPrayerTimesHeight = prayerTimesList.length * 91; // Restored spacing to original

    // Calculate the Y position to start from the bottom
    const bottomMargin = 250; // Margin from the bottom
    const prayerSectionStartY =
      phoneHeight - totalPrayerTimesHeight - bottomMargin;

    // Draw the transparent background for the entire prayer times section
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Black with 50% opacity
    ctx.fillRect(
      50, // X position
      prayerSectionStartY, // Adjusted Y position to start from the bottom
      phoneWidth - 100, // Width of the rectangle
      totalPrayerTimesHeight // Height of the rectangle
    );

    // Draw Date Section
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 72px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(dateText, phoneWidth / 2, prayerSectionStartY - 150); // Adjusted position

    // Draw Title
    ctx.font = "bold 56px Arial";
    ctx.fillStyle = "#ffc107";
    ctx.fillText(
      language === "uz-latin"
        ? "Har kunlik namoz"
        : language === "uz-kiril"
        ? "Ҳар кунлик намоз"
        : "Daily Prayers",
      phoneWidth / 2,
      prayerSectionStartY - 60
    );

    // Draw Prayer Times List
    prayerTimesList.reverse().forEach(([name, time], index) => {
      // Calculate Y position for the current entry, starting from the bottom of the box
      const yPosition =
        prayerSectionStartY + totalPrayerTimesHeight - (index + 1) * 80;

      // Prayer Name
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(name, 100, yPosition);

      // Prayer Time
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "#ffc107";
      ctx.textAlign = "right";
      ctx.fillText(time as string, phoneWidth - 100, yPosition);
    });

    // Generate the buffer in JPEG format
    const buffer = canvas.toBuffer("image/jpeg");

    // Compress the buffer using sharp
    // const compressedBuffer = await sharp(buffer)
    // 	.jpeg({ quality: 75 }) // Compression quality
    // 	.toBuffer();

    // return compressedBuffer;
    return buffer;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
