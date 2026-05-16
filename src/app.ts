import { RESPONSE_MESSAGE } from "./configs";
import swaggerSpec from "./docs/swagger.js";
import swaggerUi from "swagger-ui-express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,

    customSiteTitle: "FlickChat API Docs",

    customfavIcon: "/flickchat.ico",

    swaggerOptions: {
      filter: true,
      persistAuthorization: true,
    },
  }),
);

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: RESPONSE_MESSAGE.SERVER_RUNNING,
    health: "/health",
    docs: "/api-docs",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check server health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
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
 *                   example: Server is healthy ✅
 *                 timestamp:
 *                   type: string
 *                   example: 2026-05-16T10:30:00.000Z
 */
app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: RESPONSE_MESSAGE.SERVER_HEALTHY,
    timestamp: new Date().toISOString(),
  });
});

export default app;
