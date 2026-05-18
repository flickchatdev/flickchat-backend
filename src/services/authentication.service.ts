import { AuthProvider, type User } from "@prisma/client";
import { messageCentralClient } from "../integrations/messageCentral/index.js";
import { appleClient } from "../integrations/apple/index.js";
import { firebaseClient } from "../integrations/firebase/index.js";
import { googleAuthClient } from "../integrations/google/index.js";
import { AppError } from "../errors/AppError.js";
import { parsePhoneNumber } from "../utils/phone.util.js";
import { ENV, RESPONSE_MESSAGE } from "../configs/index.js";
import { userRepository } from "../repository/index.js";
import { generateUniqueUsername } from "../utils/index.js";
import {
  generateRefreshToken,
  hashToken,
  signAccessToken,
} from "../utils/jwt.util.js";

type SessionMeta = {
  fcmToken?: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  platform?: string;
  appVersion?: string;
  osVersion?: string;
  ipAddress?: string;
  userAgent?: string;
};

type SocialProfile = {
  fullName?: string;
};

type SocialLinkRequest = {
  provider?: string;
  token?: string;
};

type VerifiedSocialIdentity = {
  provider: AuthProvider;
  providerId: string;
  email?: string;
  emailVerified?: boolean;
  fullName?: string;
};

class AuthenticationService {
  private normalizePhoneNumber = (phoneNumber: string, countryCode?: string) => {
    const parsed = parsePhoneNumber({
      phoneNumber,
      countryCode: countryCode ?? ENV.MESSAGE_CENTRAL_DEFAULT_COUNTRY_CODE,
    });

    return `+${parsed.countryCode}${parsed.mobileNumber}`;
  };

  sendOtp = async (phoneNumber: string, countryCode?: string) => {
    const parsed = parsePhoneNumber({
      phoneNumber,
      countryCode: countryCode ?? ENV.MESSAGE_CENTRAL_DEFAULT_COUNTRY_CODE,
    });

    const data = await messageCentralClient.sendOtp({
      countryCode: parsed.countryCode,
      mobileNumber: parsed.mobileNumber,
    });

    return {
      verificationId: data.verificationId,
      timeout: data.timeout,
      transactionId: data.transactionId,
    };
  };

  verifyOtp = async (
    phoneNumber: string,
    otp: string,
    verificationId: string,
    countryCode?: string,
    sessionMeta: SessionMeta = {},
    socialLink?: SocialLinkRequest,
  ) => {
    if (!verificationId?.trim()) {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.VERIFICATION_ID_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    if (!otp?.trim()) {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.OTP_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    const normalizedPhoneNumber = this.normalizePhoneNumber(
      phoneNumber,
      countryCode,
    );

    const data = await messageCentralClient.validateOtp({
      verificationId: verificationId.trim(),
      code: otp.trim(),
    });

    const verifiedSocialIdentity = await this.verifyOptionalSocialLink(
      socialLink,
    );

    if (verifiedSocialIdentity) {
      const existingSocialProvider = await userRepository.findByProvider(
        verifiedSocialIdentity.provider,
        verifiedSocialIdentity.providerId,
      );

      if (
        existingSocialProvider?.user.phoneNumber &&
        existingSocialProvider.user.phoneNumber !== normalizedPhoneNumber
      ) {
        throw new AppError(
          409,
          RESPONSE_MESSAGE.PROVIDER_ALREADY_LINKED,
          "AUTH_ERROR",
        );
      }
    }

    let user = await userRepository.findByPhoneNumber(normalizedPhoneNumber);
    const wasCreated = !user;

    if (!user) {
      user = await userRepository.create({
        phoneNumber: normalizedPhoneNumber,
      });
    }

    await userRepository.linkAuthProvider(
      user.id,
      AuthProvider.PHONE,
      normalizedPhoneNumber,
    );

    if (verifiedSocialIdentity) {
      await userRepository.linkAuthProvider(
        user.id,
        verifiedSocialIdentity.provider,
        verifiedSocialIdentity.providerId,
      );

      const updates: Partial<Pick<User, "email" | "fullName">> = {};

      if (!user.email && verifiedSocialIdentity.email) {
        updates.email = verifiedSocialIdentity.email;
      }

      if (!user.fullName && verifiedSocialIdentity.fullName) {
        updates.fullName = verifiedSocialIdentity.fullName;
      }

      if (Object.keys(updates).length > 0) {
        user = await userRepository.update(user.id, updates);
      }
    }

    const tokens = await this.issueSessionTokens(user.id, sessionMeta);

    return {
      verificationId: data.verificationId,
      mobileNumber: data.mobileNumber,
      transactionId: data.transactionId,
      user: this.buildUserResponse(user),
      tokens,
      isNew: wasCreated || !this.isProfileComplete(user),
      isProfileComplete: this.isProfileComplete(user),
      linkedProvider: verifiedSocialIdentity?.provider,
    };
  };

  googleLogin = async (idToken: string, sessionMeta: SessionMeta = {}) => {
    const googleUser = await googleAuthClient.verifyIdToken(idToken);

    const existingProvider = await userRepository.findByGoogleId(
      googleUser.googleId,
    );
    let user: User | null = existingProvider?.user ?? null;
    let isNewUser = false;

    if (!user && googleUser.email) {
      user = await userRepository.findByEmail(googleUser.email);

      if (user) {
        await userRepository.linkAuthProvider(
          user.id,
          AuthProvider.GOOGLE,
          googleUser.googleId,
        );
        user = await userRepository.updateGoogleProfile(user.id, googleUser);
      }
    }

    if (!user) {
      const username = await generateUniqueUsername(
        googleUser.email?.split("@")[0] || googleUser.fullName,
      );
      user = await userRepository.createGoogleUser(googleUser, username);
      isNewUser = true;
    } else if (!isNewUser) {
      user = await userRepository.updateGoogleProfile(user.id, googleUser);
    }

    if (user.isBlocked) {
      throw new AppError(
        403,
        RESPONSE_MESSAGE.ACCOUNT_BLOCKED,
        "ACCOUNT_BLOCKED",
      );
    }

    const tokens = await this.issueSessionTokens(user.id, sessionMeta);

    return {
      isNewUser,
      user: this.buildUserResponse(user),
      tokens,
      provider: AuthProvider.GOOGLE,
      isProfileComplete: this.isProfileComplete(user),
      requiresPhoneVerification: !this.hasVerifiedPhoneNumber(user),
    };
  };

  socialLogin = async (
    provider: string,
    token: string,
    sessionMeta: SessionMeta,
    profile?: SocialProfile,
  ) => {
    const normalizedProvider = provider.trim().toLowerCase();

    if (normalizedProvider === "google") {
      return this.googleLogin(token, sessionMeta);
    }

    if (!provider?.trim()) {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.PROVIDER_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    if (!token?.trim()) {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.TOKEN_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    const socialIdentity = await this.verifySocialIdentity(
      provider,
      token,
      profile,
    );

    const existingProviderRecord = await userRepository.findByProvider(
      socialIdentity.provider,
      socialIdentity.providerId,
    );

    let user: User | null = existingProviderRecord?.user ?? null;

    if (!user) {
      return {
        requiresPhoneVerification: true,
        isNew: true,
        isProfileComplete: false,
        provider: socialIdentity.provider,
        user: null,
        tokens: null,
      };
    }

    if (!user.email && socialIdentity.email) {
      user = await userRepository.update(user.id, {
        email: socialIdentity.email,
      });
    }

    if (!user) {
      throw new AppError(
        500,
        RESPONSE_MESSAGE.INTERNAL_ERROR,
        "INTERNAL_ERROR",
      );
    }

    if (!this.hasVerifiedPhoneNumber(user)) {
      return {
        requiresPhoneVerification: true,
        isNew: !this.isProfileComplete(user),
        isProfileComplete: this.isProfileComplete(user),
        provider: socialIdentity.provider,
        user: this.buildUserResponse(user),
        tokens: null,
      };
    }

    const tokens = await this.issueSessionTokens(user.id, sessionMeta);

    return {
      user: this.buildUserResponse(user),
      tokens,
      provider: socialIdentity.provider,
      isNew: !this.isProfileComplete(user),
      isProfileComplete: this.isProfileComplete(user),
      requiresPhoneVerification: false,
    };
  };

  verifyFirebaseToken = async (token: string, fcmToken?: string) => {
    if (!token?.trim()) {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.TOKEN_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    const decoded = await firebaseClient.verifyIdToken(token.trim());

    if (fcmToken?.trim()) {
      await firebaseClient.verifyFcmToken(fcmToken.trim());
    }

    return {
      uid: decoded.uid,
      email: decoded.email,
      phoneNumber: decoded.phoneNumber,
      fcmTokenVerified: Boolean(fcmToken?.trim()),
    };
  };

  refreshToken = async (refreshToken: string) => {
    if (!refreshToken?.trim()) {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.REFRESH_TOKEN_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    const hashedRefreshToken = hashToken(refreshToken.trim());
    const session =
      await userRepository.findActiveSessionByRefreshToken(hashedRefreshToken);

    if (!session) {
      throw new AppError(
        401,
        RESPONSE_MESSAGE.INVALID_REFRESH_TOKEN,
        "AUTH_ERROR",
      );
    }

    if (session.expiresAt.getTime() < Date.now()) {
      await userRepository.deactivateSession(session.id);
      throw new AppError(401, RESPONSE_MESSAGE.SESSION_EXPIRED, "AUTH_ERROR");
    }

    const accessToken = signAccessToken({
      userId: session.userId,
      sessionId: session.id,
    });

    const nextRefreshToken = generateRefreshToken();
    const nextRefreshTokenHash = hashToken(nextRefreshToken);
    const nextRefreshExpiresAt = this.getRefreshTokenExpiresAt();

    await userRepository.updateSession(session.id, {
      refreshToken: nextRefreshTokenHash,
      expiresAt: nextRefreshExpiresAt,
    });

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      expiresAt: nextRefreshExpiresAt.toISOString(),
    };
  };

  logout = async (refreshToken: string) => {
    if (!refreshToken?.trim()) {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.REFRESH_TOKEN_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    const hashedRefreshToken = hashToken(refreshToken.trim());
    const session =
      await userRepository.findActiveSessionByRefreshToken(hashedRefreshToken);

    if (!session) {
      throw new AppError(
        401,
        RESPONSE_MESSAGE.INVALID_REFRESH_TOKEN,
        "AUTH_ERROR",
      );
    }

    await userRepository.deactivateSession(session.id);

    return {
      success: true,
    };
  };

  private buildUserResponse = (user: User) => {
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      isActive: user.isActive,
      isBlocked: user.isBlocked,
    };
  };

  private isProfileComplete = (user: Pick<User, "fullName" | "username">) => {
    return Boolean(user.fullName?.trim() && user.username?.trim());
  };

  private hasVerifiedPhoneNumber = (user: Pick<User, "phoneNumber">) => {
    return Boolean(user.phoneNumber?.startsWith("+"));
  };

  private getRefreshTokenExpiresAt = () => {
    const days = ENV.JWT_REFRESH_EXPIRES_DAYS || 30;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  };

  private issueSessionTokens = async (
    userId: string,
    sessionMeta: SessionMeta,
  ) => {
    if (sessionMeta.fcmToken) {
      await firebaseClient.verifyFcmToken(sessionMeta.fcmToken);
    }

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashToken(refreshToken);
    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();

    const session = await userRepository.createSession({
      userId,
      refreshToken: refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
      fcmToken: sessionMeta.fcmToken,
      deviceId: sessionMeta.deviceId,
      deviceName: sessionMeta.deviceName,
      deviceType: sessionMeta.deviceType,
      platform: sessionMeta.platform,
      appVersion: sessionMeta.appVersion,
      osVersion: sessionMeta.osVersion,
      ipAddress: sessionMeta.ipAddress,
      userAgent: sessionMeta.userAgent,
    });

    const accessToken = signAccessToken({
      userId,
      sessionId: session.id,
    });

    return {
      accessToken,
      refreshToken,
      expiresAt: refreshTokenExpiresAt.toISOString(),
    };
  };

  private verifyOptionalSocialLink = async (
    socialLink?: SocialLinkRequest,
  ): Promise<VerifiedSocialIdentity | null> => {
    if (!socialLink?.provider && !socialLink?.token) {
      return null;
    }

    if (!socialLink.provider?.trim() || !socialLink.token?.trim()) {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.SOCIAL_LINK_PROVIDER_AND_TOKEN_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    return this.verifySocialIdentity(socialLink.provider, socialLink.token);
  };

  private verifySocialIdentity = async (
    provider: string,
    token: string,
    profile?: SocialProfile,
  ): Promise<VerifiedSocialIdentity> => {
    const normalizedProvider = provider.trim().toLowerCase();

    if (normalizedProvider !== "apple") {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.PROVIDER_NOT_SUPPORTED,
        "VALIDATION_ERROR",
      );
    }

    const applePayload = await appleClient.verifyIdentityToken(token.trim());

    return {
      provider: AuthProvider.APPLE,
      providerId: applePayload.sub,
      email: applePayload.email,
      emailVerified: applePayload.emailVerified ?? true,
      fullName: profile?.fullName?.trim() || undefined,
    };
  };
}

export default new AuthenticationService();
