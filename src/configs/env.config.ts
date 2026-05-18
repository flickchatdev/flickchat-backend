import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: Number(process.env.PORT) || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  ACCESS_SECRET:
    process.env.ACCESS_SECRET ||
    process.env.JWT_SECRET ||
    process.env.JWT_ACCESS_SECRET ||
    "",
  ACCESS_TOKEN_EXPIRES_IN:
    process.env.ACCESS_TOKEN_EXPIRES_IN ||
    process.env.JWT_ACCESS_EXPIRES_IN ||
    "15m",

  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || "",

  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "",
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || "",

  MESSAGE_CENTRAL_BASE_URL:
    process.env.MESSAGE_CENTRAL_BASE_URL || "",
  MESSAGE_CENTRAL_CUSTOMER_ID: process.env.MESSAGE_CENTRAL_CUSTOMER_ID || "",
  MESSAGE_CENTRAL_KEY: process.env.MESSAGE_CENTRAL_KEY || "",
  MESSAGE_CENTRAL_AUTH_TOKEN: process.env.MESSAGE_CENTRAL_AUTH_TOKEN || "",
  MESSAGE_CENTRAL_DEFAULT_COUNTRY_CODE:
    process.env.MESSAGE_CENTRAL_DEFAULT_COUNTRY_CODE || "",
  MESSAGE_CENTRAL_FLOW_TYPE: process.env.MESSAGE_CENTRAL_FLOW_TYPE || "",
  MESSAGE_CENTRAL_OTP_LENGTH: Number(process.env.MESSAGE_CENTRAL_OTP_LENGTH) || 6,

  DATABASE_URL: process.env.DATABASE_URL || "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_DAYS: Number(process.env.JWT_REFRESH_EXPIRES_DAYS) || 30,
};

export default ENV;
