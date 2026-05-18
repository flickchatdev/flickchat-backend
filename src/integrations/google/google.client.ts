import { OAuth2Client, TokenPayload } from "google-auth-library";
import { ENV } from "../../configs/index.js";
import { AppError } from "../../errors/AppError.js";
import { RESPONSE_MESSAGE } from "../../configs/index.js";
import type { GoogleUserPayload } from "./google.types.js";

class GoogleAuthClient {
  private client: OAuth2Client | null = null;

  private getClient(): OAuth2Client {
    if (!ENV.GOOGLE_CLIENT_ID) {
      throw new AppError(500, RESPONSE_MESSAGE.GOOGLE_NOT_CONFIGURED, "GOOGLE_NOT_CONFIGURED");
    }

    if (!this.client) {
      this.client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);
    }

    return this.client;
  }

  private mapPayload(payload: TokenPayload): GoogleUserPayload {
    if (!payload.sub) {
      throw new AppError(401, RESPONSE_MESSAGE.GOOGLE_TOKEN_INVALID, "GOOGLE_TOKEN_INVALID");
    }

    return {
      googleId: payload.sub,
      email: payload.email || `${payload.sub}@google.user`,
      fullName: payload.name || payload.email?.split("@")[0] || "User",
      profilePicture: payload.picture,
    };
  }

  async verifyIdToken(idToken: string): Promise<GoogleUserPayload> {
    try {
      const ticket = await this.getClient().verifyIdToken({
        idToken,
        audience: ENV.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new AppError(401, RESPONSE_MESSAGE.GOOGLE_TOKEN_INVALID, "GOOGLE_TOKEN_INVALID");
      }

      return this.mapPayload(payload);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(401, RESPONSE_MESSAGE.GOOGLE_TOKEN_INVALID, "GOOGLE_TOKEN_INVALID");
    }
  }
}

export default new GoogleAuthClient();
