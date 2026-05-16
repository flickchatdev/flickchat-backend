import { messageCentralClient } from "../integrations/messageCentral/index.js";
import { AppError } from "../errors/AppError.js";
import { parsePhoneNumber } from "../utils/phone.util.js";
import { ENV, RESPONSE_MESSAGE } from "../configs/index.js";

class AuthenticationService {
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
  ) => {
    if (!verificationId?.trim()) {
      throw new AppError(400, RESPONSE_MESSAGE.VERIFICATION_ID_REQUIRED, "VALIDATION_ERROR");
    }

    if (!otp?.trim()) {
      throw new AppError(400, RESPONSE_MESSAGE.OTP_REQUIRED, "VALIDATION_ERROR");
    }

    parsePhoneNumber({
      phoneNumber,
      countryCode: countryCode ?? ENV.MESSAGE_CENTRAL_DEFAULT_COUNTRY_CODE,
    });

    const data = await messageCentralClient.validateOtp({
      verificationId: verificationId.trim(),
      code: otp.trim(),
    });

    return {
      verificationId: data.verificationId,
      mobileNumber: data.mobileNumber,
      transactionId: data.transactionId,
    };
  };

  socialLogin = async (provider: string, token: string) => {};

  refreshToken = async (refreshToken: string) => {};

  logout = async (userId: string) => {};
}

export default new AuthenticationService();
