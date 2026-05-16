import { Router } from "express";
import { ENV, RESPONSE_MESSAGE } from "../configs/index.js";
import { getSocketStatus } from "../socket/index.js";

const router = Router();

/**
 * @swagger
 * /socket/health:
 *   get:
 *     summary: Check Socket.io server status
 *     description: |
 *       Verifies that Socket.io is initialized on this server.
 *       Use **Try it out** here for a quick REST check.
 *
 *       Socket.io itself is not testable inside Swagger UI. To test a live connection:
 *       1. Connect with `socket.io-client` to the same host/port as this API
 *       2. Or open `handshakeTestUrl` in a browser / run the polling request below
 *       3. Emit event `ping` — server replies with `pong`
 *
 *       **Client connect URL:** `http://localhost:8080` (same as REST server)
 *
 *       **Events:**
 *       | Direction | Event | Payload |
 *       |-----------|-------|---------|
 *       | Client → Server | `ping` | none |
 *       | Server → Client | `pong` | `{ timestamp: string }` |
 *     tags: [Socket]
 *     responses:
 *       200:
 *         description: Socket.io is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Socket.io server is running ✅
 *                 data:
 *                   type: object
 *                   properties:
 *                     ready:
 *                       type: boolean
 *                       example: true
 *                     path:
 *                       type: string
 *                       example: /socket.io
 *                     connectedClients:
 *                       type: integer
 *                       example: 0
 *                     clientConnectUrl:
 *                       type: string
 *                       example: http://localhost:8080
 *                     handshakeTestUrl:
 *                       type: string
 *                       example: /socket.io/?EIO=4&transport=polling
 *                     events:
 *                       type: object
 *       503:
 *         description: Socket.io not initialized
 */
router.get("/health", (_req, res) => {
  const status = getSocketStatus();

  if (!status.ready) {
    res.status(503).json({
      success: false,
      message: RESPONSE_MESSAGE.SOCKET_NOT_READY,
      data: status,
    });
    return;
  }

  const host = ENV.NODE_ENV === "production" ? undefined : `http://localhost:${ENV.PORT}`;

  res.status(200).json({
    success: true,
    message: RESPONSE_MESSAGE.SOCKET_HEALTHY,
    data: {
      ...status,
      clientConnectUrl: host,
    },
  });
});

export default router;
