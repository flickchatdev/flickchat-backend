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
 *     summary: Social login (Google supported)
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

router.post("/send-otp", authenticationController.sendOtp);
router.post("/verify-otp", authenticationController.verifyOtp);
router.post("/refresh-token", authenticationController.refreshToken);
router.post("/logout", authenticationController.logout);

export default router;
