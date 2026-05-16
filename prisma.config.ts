import { defineConfig } from "prisma/config";
import { configDotenv } from "dotenv";
import "dotenv/config";

configDotenv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
