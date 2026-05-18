import { Request, Response } from "express";
import authenticationService from "../services/authentication.service.js";
import { RESPONSE_MESSAGE } from "../configs/index.js";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { DeviceInfo } from "../integrations/google/index.js";

function parseDeviceInfo(req: Request, body: Record<string, unknown>): DeviceInfo {
  return {
    deviceId: body.deviceId as string | undefined,
    deviceName: body.deviceName as string | undefined,
    deviceType: body.deviceType as string | undefined,
    platform: body.platform as string | undefined,
    appVersion: body.appVersion as string | undefined,
    osVersion: body.osVersion as string | undefined,
    fcmToken: body.fcmToken as string | undefined,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  };
}

class AuthenticationController {
  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { idToken, ...deviceFields } = req.body;

    if (!idToken || typeof idToken !== "string") {
      throw new AppError(400, RESPONSE_MESSAGE.GOOGLE_TOKEN_REQUIRED, "VALIDATION_ERROR");
    }

    const data = await authenticationService.googleLogin(
      idToken,
      parseDeviceInfo(req, deviceFields),
    );

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.GOOGLE_LOGIN_SUCCESS,
      data,
    });
  });

  socialLogin = asyncHandler(async (req: Request, res: Response) => {
    const { provider, token, idToken, ...deviceFields } = req.body;
    const authToken = idToken || token;

    if (!provider || typeof provider !== "string") {
      throw new AppError(400, "provider is required", "VALIDATION_ERROR");
    }

    if (!authToken || typeof authToken !== "string") {
      throw new AppError(400, RESPONSE_MESSAGE.GOOGLE_TOKEN_REQUIRED, "VALIDATION_ERROR");
    }

    const data = await authenticationService.socialLogin(
      provider,
      authToken,
      parseDeviceInfo(req, deviceFields),
    );

    res.status(200).json({
      success: true,
      message: RESPONSE_MESSAGE.GOOGLE_LOGIN_SUCCESS,
      data,
    });
  });

  sendOtp = asyncHandler(async (_req: Request, res: Response) => {
    res.status(501).json({ success: false, message: RESPONSE_MESSAGE.NOT_IMPLEMENTED });
  });

  verifyOtp = asyncHandler(async (_req: Request, res: Response) => {
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
