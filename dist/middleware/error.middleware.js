import { HttpError } from "../shared/HttpError.js";
export function errorMiddleware(err, req, res, next) {
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
