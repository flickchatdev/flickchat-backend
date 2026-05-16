import { ENV, RESPONSE_MESSAGE } from "../../configs/index.js";
import { AppError } from "../../errors/AppError.js";
import type {
  MessageCentralSendOtpResponse,
  MessageCentralTokenResponse,
  MessageCentralValidateOtpResponse,
  SendOtpParams,
  ValidateOtpParams,
} from "./messageCentral.types.js";

const TOKEN_CACHE_TTL_MS = 50 * 60 * 1000;

class MessageCentralClient {
  private cachedToken: { value: string; expiresAt: number } | null = null;

  private get baseUrl(): string {
    return ENV.MESSAGE_CENTRAL_BASE_URL;
  }

  private mapApiError(
    responseCode: number,
    message?: string,
    providerMessage?: string | null,
  ): AppError {
    const detail =
      providerMessage || message || RESPONSE_MESSAGE.OTP_PROVIDER_REQUEST_FAILED;

    switch (responseCode) {
      case 400:
        return new AppError(400, detail, "BAD_REQUEST");
      case 409:
        return new AppError(409, detail, "DUPLICATE_RESOURCE");
      case 511:
        return new AppError(400, RESPONSE_MESSAGE.INVALID_COUNTRY_CODE, "INVALID_COUNTRY_CODE");
      case 505:
        return new AppError(
          400,
          RESPONSE_MESSAGE.INVALID_VERIFICATION_SESSION,
          "INVALID_VERIFICATION_ID",
        );
      case 506:
        return new AppError(409, RESPONSE_MESSAGE.OTP_REQUEST_EXISTS, "REQUEST_ALREADY_EXISTS");
      case 700:
        return new AppError(400, RESPONSE_MESSAGE.OTP_VERIFICATION_FAILED, "VERIFICATION_FAILED");
      case 702:
        return new AppError(400, RESPONSE_MESSAGE.WRONG_OTP, "WRONG_OTP");
      case 703:
        return new AppError(400, RESPONSE_MESSAGE.OTP_ALREADY_VERIFIED, "ALREADY_VERIFIED");
      case 705:
        return new AppError(400, RESPONSE_MESSAGE.OTP_EXPIRED, "OTP_EXPIRED");
      case 800:
        return new AppError(429, RESPONSE_MESSAGE.OTP_RATE_LIMIT, "RATE_LIMIT");
      case 500:
      case 501:
        return new AppError(502, RESPONSE_MESSAGE.OTP_SERVICE_UNAVAILABLE, "OTP_PROVIDER_ERROR");
      default:
        return new AppError(502, detail, "OTP_PROVIDER_ERROR");
    }
  }

  private async parseJson<T>(response: Response): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch {
      throw new AppError(
        502,
        RESPONSE_MESSAGE.OTP_PROVIDER_INVALID_RESPONSE,
        "OTP_PROVIDER_ERROR",
      );
    }
  }

  async getAuthToken(): Promise<string> {
    if (ENV.MESSAGE_CENTRAL_AUTH_TOKEN) {
      return ENV.MESSAGE_CENTRAL_AUTH_TOKEN;
    }

    const now = Date.now();
    if (this.cachedToken && now < this.cachedToken.expiresAt) {
      return this.cachedToken.value;
    }

    if (!ENV.MESSAGE_CENTRAL_CUSTOMER_ID || !ENV.MESSAGE_CENTRAL_KEY) {
      throw new AppError(500, RESPONSE_MESSAGE.OTP_CONFIG_MISSING, "OTP_CONFIG_ERROR");
    }

    const url = new URL(`${this.baseUrl}/auth/v1/authentication/token`);
    url.searchParams.set("customerId", ENV.MESSAGE_CENTRAL_CUSTOMER_ID);
    url.searchParams.set("key", ENV.MESSAGE_CENTRAL_KEY);
    url.searchParams.set("scope", "NEW");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { accept: "*/*" },
    });

    const body = await this.parseJson<MessageCentralTokenResponse>(response);

    if (!response.ok || !body.token) {
      throw new AppError(502, RESPONSE_MESSAGE.OTP_AUTH_FAILED, "OTP_AUTH_FAILED");
    }

    this.cachedToken = {
      value: body.token,
      expiresAt: now + TOKEN_CACHE_TTL_MS,
    };

    return body.token;
  }

  async sendOtp(params: SendOtpParams) {
    const authToken = await this.getAuthToken();

    const url = new URL(`${this.baseUrl}/verification/v3/send`);
    url.searchParams.set("customerId", ENV.MESSAGE_CENTRAL_CUSTOMER_ID);
    url.searchParams.set("countryCode", params.countryCode);
    url.searchParams.set("mobileNumber", params.mobileNumber);
    url.searchParams.set("flowType", params.flowType ?? ENV.MESSAGE_CENTRAL_FLOW_TYPE);

    const otpLength = params.otpLength ?? ENV.MESSAGE_CENTRAL_OTP_LENGTH;
    url.searchParams.set("otpLength", String(otpLength));

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        accept: "*/*",
        authToken,
      },
    });

    const body = await this.parseJson<MessageCentralSendOtpResponse>(response);

    if (!response.ok || body.responseCode !== 200 || !body.data?.verificationId) {
      const providerCode = Number(body.data?.responseCode ?? body.responseCode);
      throw this.mapApiError(
        providerCode || response.status,
        body.message,
        body.data?.errorMessage,
      );
    }

    return body.data;
  }

  async validateOtp(params: ValidateOtpParams) {
    const authToken = await this.getAuthToken();

    const url = new URL(`${this.baseUrl}/verification/v3/validateOtp`);
    url.searchParams.set("verificationId", params.verificationId);
    url.searchParams.set("code", params.code);
    url.searchParams.set("flowType", params.flowType ?? ENV.MESSAGE_CENTRAL_FLOW_TYPE);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "*/*",
        authToken,
      },
    });

    const body = await this.parseJson<MessageCentralValidateOtpResponse>(response);

    if (!response.ok || body.responseCode !== 200 || !body.data) {
      const providerCode = Number(body.data?.responseCode ?? body.responseCode);
      throw this.mapApiError(
        providerCode || response.status,
        body.message,
        body.data?.errorMessage,
      );
    }

    const status = body.data.verificationStatus?.toUpperCase();
    if (status !== "VERIFICATION_COMPLETED" && status !== "VERIFIED") {
      throw this.mapApiError(700, body.message, body.data.errorMessage);
    }

    return body.data;
  }
}

export default new MessageCentralClient();
