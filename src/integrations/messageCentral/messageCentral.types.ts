export type MessageCentralFlowType = "SMS" | "WHATSAPP" | "RCS" | "SAUTH";

export interface MessageCentralTokenResponse {
  status: number;
  token: string;
}

export interface MessageCentralSendOtpData {
  verificationId: string;
  mobileNumber: string;
  responseCode: string;
  errorMessage: string | null;
  timeout: string;
  transactionId: string;
}

export interface MessageCentralSendOtpResponse {
  responseCode: number;
  message: string;
  data?: MessageCentralSendOtpData;
}

export interface MessageCentralValidateOtpData {
  verificationId: string;
  mobileNumber: string;
  responseCode: string;
  errorMessage: string | null;
  verificationStatus: string;
  transactionId: string;
}

export interface MessageCentralValidateOtpResponse {
  responseCode: number;
  message: string;
  data?: MessageCentralValidateOtpData;
}

export interface SendOtpParams {
  countryCode: string;
  mobileNumber: string;
  flowType?: MessageCentralFlowType;
  otpLength?: number;
}

export interface ValidateOtpParams {
  verificationId: string;
  code: string;
  flowType?: MessageCentralFlowType;
}
