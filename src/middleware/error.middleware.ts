// shared/middleware/errorMiddleware.ts
import type { Request, Response, NextFunction } from "express";

import { HttpError } from "../shared/errors/main.erorr.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
    });
  }

  // Unknown / programming error
  console.error(err);
  //default to 500 Internal Server Error for unhandled exceptions
  return res.status(500).json({
    success: false,
    error: "InternalServerError",
    message: "Something went wrong",
  });
}