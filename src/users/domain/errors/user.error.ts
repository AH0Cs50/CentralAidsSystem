// users/domain/errors/UserErrors.ts

import { HttpError } from "../../../shared/errors/main.erorr.js";

export class UserNotFoundError extends HttpError {
    constructor(message = "User not found") {
        super(404, message);
        this.name = "UserNotFoundError";
    }
}

export class UserAlreadyExistsError extends HttpError {
    constructor(message = "User already exists") {
        super(409, message);
        this.name = "UserAlreadyExistsError";
    }
}

export class EmailAlreadyVerifiedError extends HttpError {
    constructor(message = "Email already verified") {
        super(400, message);
        this.name = "EmailAlreadyVerifiedError";
    }
}

export class InvalidUserCredentialsError extends HttpError {
    constructor(message = "Invalid email or password") {
        super(401, message);
        this.name = "InvalidUserCredentialsError";
    }
}

export class UserEmailNotVerifiedError extends HttpError {
    constructor(message = "Email not verified") {
        super(403, message);
        this.name = "UserEmailNotVerifiedError";
    }
}

export class userAccountLockedError extends HttpError {
    constructor(message = "User account is locked") {
        super(403, message);
        this.name = "userAccountLockedError";
    }
}

export class UserCredentialsRequiredError extends HttpError {
    constructor(message = "Email and password are required") {
        super(400, message);
        this.name = "UserCredentialsRequiredError";
    }
}


