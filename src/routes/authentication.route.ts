import { authenticationController } from "../controllers";
import { Router } from "express";

const router = Router();

router.post("/send-otp", authenticationController.sendOtp);
router.post("/verify-otp", authenticationController.verifyOtp);
router.post("/social-login", authenticationController.socialLogin);
router.post("/refresh-token", authenticationController.refreshToken);
router.post("/logout", authenticationController.logout);

export default router;