import jwt from "jsonwebtoken";
import { ENV } from "../configs/index.js";
import { AppError } from "../errors/AppError.js";

export function signAccessToken(userId: string): string {
  if (!ENV.JWT_SECRET) {
    throw new AppError(500, "JWT is not configured", "JWT_CONFIG_ERROR");
  }

  return jwt.sign({ sub: userId }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}
