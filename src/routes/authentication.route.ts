import { authenticationController } from "../controllers";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to a mobile number
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber]
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "9876543210"
 *               countryCode:
 *                 type: string
 *                 example: "91"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid phone number
 *       429:
 *         description: Rate limit exceeded
 *       502:
 *         description: OTP provider error
 */
router.post("/send-otp", authenticationController.sendOtp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP entered by the user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, otp, verificationId]
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "9876543210"
 *               countryCode:
 *                 type: string
 *                 example: "91"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               verificationId:
 *                 type: string
 *                 example: "abc-verification-id"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", authenticationController.verifyOtp);
router.post("/social-login", authenticationController.socialLogin);
router.post("/refresh-token", authenticationController.refreshToken);
router.post("/logout", authenticationController.logout);

export default router;
