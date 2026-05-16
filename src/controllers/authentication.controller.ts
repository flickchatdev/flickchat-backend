import { Request, Response } from "express";
import authenticationService from "../services/authentication.service.js";
import { RESPONSE_MESSAGE } from "../configs/index.js";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AuthenticationController {
  sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber, countryCode } = req.body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      throw new AppError(400, RESPONSE_MESSAGE.PHONE_NUMBER_REQUIRED, "VALIDATION_ERROR");
    }

    if (countryCode !== undefined && typeof countryCode !== "string") {
      throw new AppError(400, RESPONSE_MESSAGE.COUNTRY_CODE_INVALID_TYPE, "VALIDATION_ERROR");
    }

    const data = await authenticationService.sendOtp(phoneNumber, countryCode);

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.OTP_SENT,
      data,
    });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber, otp, verificationId, countryCode } = req.body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      throw new AppError(400, RESPONSE_MESSAGE.PHONE_NUMBER_REQUIRED, "VALIDATION_ERROR");
    }

    const data = await authenticationService.verifyOtp(
      phoneNumber,
      otp,
      verificationId,
      countryCode,
    );

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.OTP_VERIFIED,
      data,
    });
  });

  socialLogin = asyncHandler(async (_req: Request, res: Response) => {
    res.status(501).json({ success: false, message: RESPONSE_MESSAGE.NOT_IMPLEMENTED });
  });

  refreshToken = asyncHandler(async (_req: Request, res: Response) => {
    res.status(501).json({ success: false, message: RESPONSE_MESSAGE.NOT_IMPLEMENTED });
  });

  logout = asyncHandler(async (_req: Request, res: Response) => {
    res.status(501).json({ success: false, message: RESPONSE_MESSAGE.NOT_IMPLEMENTED });
  });
}

export default new AuthenticationController();
