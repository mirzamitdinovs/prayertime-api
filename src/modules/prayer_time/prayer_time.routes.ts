import { Elysia } from "elysia";
import { getPrayerTimes } from "./prayer_time.controller";

export const prayerTimeRoutes = new Elysia().get(
  "/prayer-times",
  getPrayerTimes,
  {
    detail: {
      summary: "Get Prayer Times",
      description: "Fetch prayer times for a given date and language.",
      // ✅ This groups it under "Prayer Times" in Swagger
      parameters: [
        {
          in: "query",
          name: "date",
          required: true,
          schema: { type: "string", example: "2025-03-27" },
          description: "Date in YYYY-MM-DD format",
        },
        {
          in: "query",
          name: "lang",
          required: false,
          schema: {
            type: "string",
            enum: ["uz-kiril", "uz-latin", "english"],
            default: "english",
            example: "uz-latin",
          },
          description: "Language for prayer times (Default: English)",
        },
      ],
      responses: {
        200: {
          description: "Successfully retrieved prayer times",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  date: { type: "string", example: "2025-03-27" },
                  Fajr: { type: "string", example: "06:23" },
                  Sunrise: { type: "string", example: "07:49" },
                  Dhuhr: { type: "string", example: "12:31" },
                  Asr: { type: "string", example: "15:23" },
                  Maghrib: { type: "string", example: "17:07" },
                  Isha: { type: "string", example: "18:26" },
                },
              },
            },
          },
        },
      },
    },
  }
);
