import { Request, Response } from "express";

class AuthenticationController {
  sendOtp = async (req: Request, res: Response) => {};

  verifyOtp = async (req: Request, res: Response) => {};

  socialLogin = async (req: Request, res: Response) => {};

  refreshToken = async (req: Request, res: Response) => {};

  logout = async (req: Request, res: Response) => {};
}

export default new AuthenticationController();
