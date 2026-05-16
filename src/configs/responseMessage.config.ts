const RESPONSE_MESSAGE = {
  SERVER_RUNNING: "Server is running 🚀",
  SERVER_HEALTHY: "Server is healthy ✅",
  SOCKET_HEALTHY: "Socket.io server is running ✅",
  SOCKET_NOT_READY: "Socket.io server is not initialized",
  INTERNAL_ERROR: "Internal server error",

  OTP_SENT: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  NOT_IMPLEMENTED: "Not implemented",

  PHONE_NUMBER_REQUIRED: "phoneNumber is required",
  COUNTRY_CODE_INVALID_TYPE: "countryCode must be a string",
  VERIFICATION_ID_REQUIRED: "verificationId is required",
  OTP_REQUIRED: "otp is required",

  COUNTRY_CODE_REQUIRED:
    "countryCode is required when phone number is not in E.164 format",
  INVALID_COUNTRY_CODE: "Invalid country code",
  INVALID_MOBILE_NUMBER: "Invalid mobile number",

  OTP_PROVIDER_REQUEST_FAILED: "Message Central request failed",
  OTP_PROVIDER_INVALID_RESPONSE: "Invalid response from OTP provider",
  OTP_CONFIG_MISSING: "Message Central credentials are not configured",
  OTP_AUTH_FAILED: "Failed to authenticate with OTP provider",
  INVALID_VERIFICATION_SESSION: "Invalid verification session",
  OTP_REQUEST_EXISTS: "OTP request already exists for this number",
  OTP_VERIFICATION_FAILED: "OTP verification failed",
  WRONG_OTP: "Incorrect OTP",
  OTP_ALREADY_VERIFIED: "OTP already verified",
  OTP_EXPIRED: "OTP has expired",
  OTP_RATE_LIMIT: "OTP rate limit reached. Try again later",
  OTP_SERVICE_UNAVAILABLE: "OTP service is temporarily unavailable",
} as const;

export default RESPONSE_MESSAGE;
