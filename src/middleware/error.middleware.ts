// shared/middleware/errorMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../shared/HttpError.js";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Handle known HttpError
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || undefined,
    });
  }

  // Fallback for unknown / programming errors (not http error)
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
