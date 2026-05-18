import { authenticationController } from "../controllers";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Sign in with Google (SSO)
 *     description: |
 *       Send the **Google ID token** from the mobile/web Google Sign-In SDK.
 *       The server verifies it with Google, then creates or logs in the user and returns JWT tokens.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token from client SDK
 *               deviceId:
 *                 type: string
 *               deviceName:
 *                 type: string
 *               platform:
 *                 type: string
 *                 example: android
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid Google token
 */
router.post("/google", authenticationController.googleLogin);

/**
 * @swagger
 * /api/auth/social-login:
 *   post:
 *     summary: Social login (Google or Apple)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [provider, token]
 *             properties:
 *               provider:
 *                 type: string
 *                 example: GOOGLE
 *               token:
 *                 type: string
 *                 description: Google ID token (alias idToken also accepted)
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/social-login", authenticationController.socialLogin);

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to a mobile number
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

/**
 * @swagger
 * /api/auth/verify-firebase-token:
 *   post:
 *     summary: Verify Firebase ID token and optional FCM token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOi...
 *               fcmToken:
 *                 type: string
 *                 example: e2fR8k:APA91b...
 *     responses:
 *       200:
 *         description: Firebase token verified successfully
 */
router.post(
  "/verify-firebase-token",
  authenticationController.verifyFirebaseToken,
);

router.post("/refresh-token", authenticationController.refreshToken);
router.post("/logout", authenticationController.logout);

export default router;
