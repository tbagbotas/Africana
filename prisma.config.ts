import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: process.env.VERCEL_ENV === "preview"
  ? env("AFRICANA_PREVIEW_DATABASE_URL_POOLED")
  : env("DATABASE_URL"),
  },
});