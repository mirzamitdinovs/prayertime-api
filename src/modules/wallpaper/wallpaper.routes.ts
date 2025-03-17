import { Elysia } from "elysia";
import { getWallpaperService } from "./wallpaper.service";
import { Languages } from "../../utils/global.types";

export const WallpaperRoutes = new Elysia().get(
  "/wallpaper",
  async ({ query }) => {
    const {
      lang = Languages.UZ_KIRIL,
      file = "1",
      date,
      region = "27",
    } = query;

    if (!date) {
      return new Response("Missing required query parameters", { status: 400 });
    }

    const imageBuffer = await getWallpaperService(
      lang as Languages,
      file,
      region,
      date
    );

    if (!imageBuffer) {
      return new Response("Failed to generate wallpaper", { status: 500 });
    }

    return new Response(imageBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  },
  {
    detail: {
      summary: "Get Wallpaper",
      description:
        "Retrieve a generated wallpaper with prayer times for a given language and background.",
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
            default: "uz-kiril",
            example: "uz-latin",
          },
          description: "Language of the wallpaper (Default: uz-kiril)",
        },
        {
          in: "query",
          name: "file",
          required: false,
          schema: {
            type: "string",
            enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
            default: "1",
            example: "3",
          },
          description: "Wallpaper background selection",
        },
      ],
      responses: {
        200: {
          description: "Successfully generated wallpaper",
          content: {
            "image/png": {
              schema: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
  }
);
