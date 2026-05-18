import { ENV, RESPONSE_MESSAGE } from "../../configs/index.js";
import { AppError } from "../../errors/AppError.js";

const APPLE_ISSUER = "https://appleid.apple.com";

type JoseModule = typeof import("jose");

let joseModule: JoseModule | null = null;
let appleJwks: ReturnType<JoseModule["createRemoteJWKSet"]> | null = null;

const getJoseModule = async (): Promise<JoseModule> => {
  if (!joseModule) {
    joseModule = await import("jose");
  }

  return joseModule;
};

const getAppleJwks = async () => {
  if (!appleJwks) {
    const jose = await getJoseModule();
    appleJwks = jose.createRemoteJWKSet(
      new URL("https://appleid.apple.com/auth/keys"),
    );
  }

  return appleJwks;
};

export interface AppleIdentityPayload {
  sub: string;
  email?: string;
  emailVerified?: boolean;
}

class AppleClient {
  verifyIdentityToken = async (
    identityToken: string,
  ): Promise<AppleIdentityPayload> => {
    if (!ENV.APPLE_CLIENT_ID) {
      throw new AppError(
        500,
        RESPONSE_MESSAGE.APPLE_CONFIG_MISSING,
        "CONFIG_ERROR",
      );
    }

    try {
      const jose = await getJoseModule();
      const jwks = await getAppleJwks();

      const { payload } = await jose.jwtVerify(identityToken, jwks, {
        issuer: APPLE_ISSUER,
        audience: ENV.APPLE_CLIENT_ID,
      });

      if (!payload.sub || typeof payload.sub !== "string") {
        throw new AppError(
          401,
          RESPONSE_MESSAGE.INVALID_APPLE_IDENTITY_TOKEN,
          "AUTH_ERROR",
        );
      }

      const email =
        typeof payload.email === "string" ? payload.email : undefined;
      const emailVerified =
        payload.email_verified === true ||
        payload.email_verified === "true" ||
        payload.email_verified === 1 ||
        payload.email_verified === "1";

      return {
        sub: payload.sub,
        email,
        emailVerified,
      };
    } catch {
      throw new AppError(
        401,
        RESPONSE_MESSAGE.INVALID_APPLE_IDENTITY_TOKEN,
        "AUTH_ERROR",
      );
    }
  };
}

export default new AppleClient();
