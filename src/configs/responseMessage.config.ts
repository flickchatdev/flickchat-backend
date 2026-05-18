const RESPONSE_MESSAGE = {
  SERVER_RUNNING: "Server is running 🚀",
  SERVER_HEALTHY: "Server is healthy ✅",
  SOCKET_HEALTHY: "Socket.io server is running ✅",
  SOCKET_NOT_READY: "Socket.io server is not initialized",
  INTERNAL_ERROR: "Internal server error",

  OTP_SENT: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  SOCIAL_LOGIN_SUCCESS: "Social login successful",
  TOKEN_REFRESHED: "Token refreshed successfully",
  LOGGED_OUT: "Logged out successfully",
  FIREBASE_TOKEN_VERIFIED: "Firebase token verified successfully",
  NOT_IMPLEMENTED: "Not implemented",

  PHONE_NUMBER_REQUIRED: "phoneNumber is required",
  COUNTRY_CODE_INVALID_TYPE: "countryCode must be a string",
  VERIFICATION_ID_REQUIRED: "verificationId is required",
  OTP_REQUIRED: "otp is required",
  PROVIDER_REQUIRED: "provider is required",
  PROVIDER_NOT_SUPPORTED: "provider is not supported",
  PROVIDER_ALREADY_LINKED: "provider account is already linked to another user",
  SOCIAL_LINK_PROVIDER_AND_TOKEN_REQUIRED:
    "provider and token are required to link social login",
  TOKEN_REQUIRED: "token is required",
  INVALID_APPLE_IDENTITY_TOKEN: "Invalid Apple identity token",
  APPLE_CONFIG_MISSING: "Apple configuration is missing",
  ACCESS_SECRET_MISSING: "Access token signing secret is missing",
  REFRESH_TOKEN_REQUIRED: "refreshToken is required",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  SESSION_EXPIRED: "Session expired",
  USER_NOT_FOUND: "User not found",
  FIREBASE_CONFIG_MISSING: "Firebase credentials are not configured",
  INVALID_FIREBASE_TOKEN: "Invalid Firebase token",
  INVALID_FCM_TOKEN: "Invalid FCM token",

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


  GOOGLE_LOGIN_SUCCESS: "Google login successful",
  GOOGLE_TOKEN_REQUIRED: "idToken is required",
  GOOGLE_TOKEN_INVALID: "Invalid or expired Google token",
  GOOGLE_NOT_CONFIGURED: "Google SSO is not configured on the server",
  ACCOUNT_BLOCKED: "Your account has been blocked",
};

export default RESPONSE_MESSAGE;
