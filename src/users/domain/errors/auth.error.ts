import { HttpError } from "../../../shared/errors/main.erorr.js";

export class InvalidTokenError extends HttpError {
    constructor(message = "Invalid or expired token") {
        super(401, message);
        this.name = "InvalidTokenError";
    }
}

export class TokenExpiredError extends HttpError {
    constructor(message = "Token has expired") {
        super(401, message);
        this.name = "TokenExpiredError";
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = "Authentication required") {
        super(401, message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = "Access denied") {
        super(403, message);
        this.name = "ForbiddenError";
    }
}

export class InvalidAccessTokenError extends HttpError {
    constructor(message = "Invalid or expired access token") {
        super(401, message);
        this.name = "InvalidAccessTokenError";
    }
}

export class InvalidRefreshTokenError extends HttpError {
    constructor(message = "Invalid or revoked refresh token") {
        super(401, message);
        this.name = "InvalidRefreshTokenError";
    }
}

export class RefreshTokenRevokedError extends HttpError {
    constructor(message = "Refresh token revoked or invalid") {
        super(401, message);
        this.name = "RefreshTokenRevokedError";
    }
}


export class RefreshTokenStorageError extends HttpError {
    constructor(message = "The refresh token could not be stored in DB") {
        super(500, message);
        this.name = "RefreshTokenStorageError";
    }
}

export class RefreshTokenDecodeError extends HttpError {
    constructor(message = "Failed to decode refresh token") {
        super(500, message);
        this.name = "RefreshTokenDecodeError";
    }
}