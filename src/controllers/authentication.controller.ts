import { Request, Response } from "express";
import authenticationService from "../services/authentication.service.js";
import { RESPONSE_MESSAGE } from "../configs/index.js";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AuthenticationController {
  sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber, countryCode } = req.body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.PHONE_NUMBER_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    if (countryCode !== undefined && typeof countryCode !== "string") {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.COUNTRY_CODE_INVALID_TYPE,
        "VALIDATION_ERROR",
      );
    }

    const data = await authenticationService.sendOtp(phoneNumber, countryCode);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.OTP_SENT,
      data,
    });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const {
      phoneNumber,
      otp,
      verificationId,
      countryCode,
      provider,
      token,
      fcmToken,
      deviceId,
      deviceName,
      deviceType,
      platform,
      appVersion,
      osVersion,
    } = req.body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      throw new AppError(
        400,
        RESPONSE_MESSAGE.PHONE_NUMBER_REQUIRED,
        "VALIDATION_ERROR",
      );
    }

    const data = await authenticationService.verifyOtp(
      phoneNumber,
      otp,
      verificationId,
      countryCode,
      {
        fcmToken,
        deviceId,
        deviceName,
        deviceType,
        platform,
        appVersion,
        osVersion,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
      {
        provider,
        token,
      },
    );

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.OTP_VERIFIED,
      data,
    });
  });

  socialLogin = asyncHandler(async (req: Request, res: Response) => {
    const {
      provider,
      token,
      fullName,
      fcmToken,
      deviceId,
      deviceName,
      deviceType,
      platform,
      appVersion,
      osVersion,
    } = req.body;

    const data = await authenticationService.socialLogin(
      provider,
      token,
      {
        fcmToken,
        deviceId,
        deviceName,
        deviceType,
        platform,
        appVersion,
        osVersion,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
      {
        fullName,
      },
    );

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.SOCIAL_LOGIN_SUCCESS,
      data,
    });
  });

  verifyFirebaseToken = asyncHandler(async (req: Request, res: Response) => {
    const { token, fcmToken } = req.body;

    const data = await authenticationService.verifyFirebaseToken(
      token,
      fcmToken,
    );

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.FIREBASE_TOKEN_VERIFIED,
      data,
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const data = await authenticationService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.TOKEN_REFRESHED,
      data,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const data = await authenticationService.logout(refreshToken);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.LOGGED_OUT,
      data,
    });
  });
}

export default new AuthenticationController();
