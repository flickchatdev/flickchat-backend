import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: Number(process.env.PORT) || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL: process.env.DATABASE_URL || "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_DAYS: Number(process.env.JWT_REFRESH_EXPIRES_DAYS) || 30,
};

export default ENV;
