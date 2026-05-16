import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { ENV, RESPONSE_MESSAGE } from "../configs/index.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }

  if (ENV.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(500).json({
    success: false,
    message: RESPONSE_MESSAGE.INTERNAL_ERROR,
    code: "INTERNAL_ERROR",
  });
};
