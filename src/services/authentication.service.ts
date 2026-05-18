import { randomBytes } from "crypto";
import { googleAuthClient, type DeviceInfo } from "../integrations/google/index.js";
import userRepository from "../repository/user.repository.js";
import { AppError } from "../errors/AppError.js";
import { RESPONSE_MESSAGE } from "../configs/index.js";
import { generateUniqueUsername, signAccessToken } from "../utils/index.js";
import { ENV } from "../configs/index.js";

function sanitizeUser(user: {
  id: string;
  fullName: string;
  username: string;
  email: string | null;
  profilePicture: string | null;
  phoneNumber: string | null;
  isOnline: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    phoneNumber: user.phoneNumber,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
  };
}

class AuthenticationService {
  googleLogin = async (idToken: string, device?: DeviceInfo) => {
    const googleUser = await googleAuthClient.verifyIdToken(idToken);

    let user = (await userRepository.findByGoogleId(googleUser.googleId))?.user;
    let isNewUser = false;

    if (!user) {
      const existingByEmail = googleUser.email
        ? await userRepository.findByEmail(googleUser.email)
        : null;

      if (existingByEmail) {
        await userRepository.linkGoogleProvider(existingByEmail.id, googleUser.googleId);
        user = await userRepository.updateGoogleProfile(existingByEmail.id, googleUser);
      } else {
        const username = await generateUniqueUsername(
          googleUser.email.split("@")[0] || googleUser.fullName,
        );
        user = await userRepository.createGoogleUser(googleUser, username);
        isNewUser = true;
      }
    } else {
      user = await userRepository.updateGoogleProfile(user.id, googleUser);
    }

    if (user.isBlocked) {
      throw new AppError(403, RESPONSE_MESSAGE.ACCOUNT_BLOCKED, "ACCOUNT_BLOCKED");
    }

    const refreshToken = randomBytes(48).toString("hex");
    const session = await userRepository.createSession(user.id, refreshToken, device);
    const accessToken = signAccessToken(user.id);

    const sessionExpiresAt = new Date();
    sessionExpiresAt.setDate(
      sessionExpiresAt.getDate() + ENV.JWT_REFRESH_EXPIRES_DAYS,
    );

    return {
      isNewUser,
      accessToken,
      refreshToken,
      expiresAt: sessionExpiresAt.toISOString(),
      sessionId: session.id,
      user: sanitizeUser(user),
    };
  };

  socialLogin = async (provider: string, token: string, device?: DeviceInfo) => {
    if (provider.toUpperCase() === "GOOGLE") {
      return this.googleLogin(token, device);
    }

    throw new AppError(400, RESPONSE_MESSAGE.PROVIDER_NOT_SUPPORTED, "PROVIDER_NOT_SUPPORTED");
  };

  sendOtp = async (_phoneNumber: string) => {};

  verifyOtp = async (
    _phoneNumber: string,
    _otp: string,
    _verificationId: string,
  ) => {};

  refreshToken = async (_refreshToken: string) => {};

  logout = async (_userId: string) => {};
}

export default new AuthenticationService();
