export const env = {
  PORT: Bun.env.PORT || 8080,
  API_ID: Number(Bun.env.API_ID) || 0,
  API_HASH: Bun.env.API_HASH || "",
  CHANNEL_USERNAME: Bun.env.CHANNEL_USERNAME || "",
  SESSION_STRING: Bun.env.SESSION_STRING || "",
  WEBSITE_URL: Bun.env.WEBSITE_URL || "https://islom.uz/vaqtlar",
  //
  API_VERSION: Bun.env.API_VERSION || "1.0.0",
  API_TITLE: Bun.env.API_TITLE || "API Documentation",
  API_ENV: Bun.env.NODE_ENV || "development",
};
