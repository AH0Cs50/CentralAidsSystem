// users/domain/errors/PasswordErrors.ts

import { HttpError } from "../../../shared/errors/main.erorr.js";


export class ResetTokenNotFoundError extends HttpError {
    constructor(message = "Reset token not found") {
        super(404, message);
        this.name = "ResetTokenNotFoundError";
    }
}

export class ResetTokenExpiredError extends HttpError {
    constructor(message = "Reset token has expired") {
        super(400, message);
        this.name = "ResetTokenExpiredError";
    }
}

export class InvalidResetTokenError extends HttpError {
    constructor(message = "Invalid reset token") {
        super(400, message);
        this.name = "InvalidResetTokenError";
    }
}

export class PasswordValidationError extends HttpError {
    constructor(message = "Password does not meet complexity requirements") {
        super(400, message);
        this.name = "PasswordValidationError";
    }
}

const PasswordErrors = {
    ResetTokenNotFoundError,
    ResetTokenExpiredError,
    InvalidResetTokenError
}

export default PasswordErrors;