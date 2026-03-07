// shared/errors/ValidationErrors.ts

import { HttpError } from "./main.erorr.js";

export class ValidationError extends HttpError {
    constructor(message = "Invalid request data") {
        super(400, message);
        this.name = "ValidationError";
    }
}

export class BadRequestError extends HttpError {
    constructor(message = "Bad request") {
        super(400, message);
        this.name = "BadRequestError";
    }
}