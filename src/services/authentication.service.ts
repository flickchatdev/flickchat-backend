class AuthenticationService {
  sendOtp = async (phoneNumber: string) => {};

  verifyOtp = async (
    phoneNumber: string,
    otp: string,
    verificationId: string,
  ) => {};

  socialLogin = async (provider: string, token: string) => {};

  refreshToken = async (refreshToken: string) => {};

  logout = async (userId: string) => {};
}

export default new AuthenticationService();
