import Elysia from "elysia";
import { prayerTimeRoutes } from "./modules/prayer_time";
import { WallpaperRoutes } from "./modules/wallpaper";

const routes = new Elysia().group("/api", (app) =>
  app.use(prayerTimeRoutes).use(WallpaperRoutes)
);

export { routes as AppRoutes };
