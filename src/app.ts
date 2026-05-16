import { RESPONSE_MESSAGE } from "./configs";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.static(path.join(process.cwd(), "src/public")));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: RESPONSE_MESSAGE.SERVER_RUNNING,
    health: "/health",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: RESPONSE_MESSAGE.SERVER_HEALTHY,
    timestamp: new Date().toISOString(),
  });
});

export default app;
