import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import logger from "logixlysia";

import { AppRoutes } from "./routes";
import { env } from "./utils/contants";
import { swaggerConfig } from "./utils/swagger";
import { cleanupOldWallpapers, WallpaperRoutes } from "./modules/wallpaper";
import { cleanupOldPrayerTimes } from "./modules/prayer_time";
// ✅ Run cleanup when the server starts
cleanupOldPrayerTimes();
cleanupOldWallpapers();

// ✅ Schedule daily cleanup at midnight
setInterval(() => {
  cleanupOldPrayerTimes();
  cleanupOldWallpapers();
}, 48 * 60 * 60 * 1000); // Runs every 48 hours

const app = new Elysia()
  .use(logger())
  .use(
    swagger({
      ...swaggerConfig,
      path: "/",
      exclude: ["/", "/json"], // Remove unnecessary default routes
    })
  )
  .use(AppRoutes);

app.listen({ port: env.PORT }, () => {
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
});
