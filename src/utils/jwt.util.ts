import crypto from "crypto";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { ENV, RESPONSE_MESSAGE } from "../configs/index.js";

interface TokenPayload {
  userId: string;
  sessionId: string;
}

const getJwtSecrets = () => {
  if (!ENV.ACCESS_SECRET) {
    throw new AppError(
      500,
      RESPONSE_MESSAGE.ACCESS_SECRET_MISSING,
      "CONFIG_ERROR",
    );
  }

  return {
    accessSecret: ENV.ACCESS_SECRET as Secret,
  };
};

export const signAccessToken = (payload: TokenPayload): string => {
  const { accessSecret } = getJwtSecrets();

  return jwt.sign(payload, accessSecret, {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (): string =>
  crypto.randomBytes(48).toString("hex");

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
