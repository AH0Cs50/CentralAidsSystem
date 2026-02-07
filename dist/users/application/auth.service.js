// src/application/services/AuthService.ts
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from '../../shared/HttpError.js';
/**
 * General-purpose AuthService
 */
export class AuthService {
    config;
    refreshtokenRepo;
    refreshTokens = new Map();
    constructor(config, refreshtokenRepo) {
        this.config = config;
        this.refreshtokenRepo = refreshtokenRepo;
    }
    // ----------------------------
    // ACCESS TOKEN
    // ----------------------------
    createAccessToken(payload) {
        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: this.config.jwtExpiresIn,
        });
    }
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.config.jwtSecret);
        }
        catch {
            throw new HttpError(401, "Invalid or expired access token");
        }
    }
    // ----------------------------
    // REFRESH TOKEN
    // ----------------------------
    createRefreshToken(userId) {
        const token = jwt.sign({ sub: userId }, this.config.refreshSecret, {
            expiresIn: this.config.refreshExpiresIn,
            jwtid: uuidv4(),
        });
        const decoded = jwt.decode(token);
        const expiresAt = decoded.exp * 1000; // convert to ms
        this.refreshTokens.set(token, {
            tokenId: decoded.jti,
            userId,
            revoked: false,
            expiresAt,
        });
        return token;
    }
    verifyRefreshToken(token) {
        const stored = this.refreshTokens.get(token);
        if (!stored || stored.revoked) {
            throw new HttpError(401, "Refresh token revoked or invalid");
        }
        try {
            const payload = jwt.verify(token, this.config.refreshSecret);
            return payload.sub;
        }
        catch {
            throw new HttpError(401, "Invalid or expired refresh token");
        }
    }
    revokeRefreshToken(token) {
        const stored = this.refreshTokens.get(token);
        if (stored) {
            stored.revoked = true;
            this.refreshTokens.set(token, stored);
        }
    }
    // ----------------------------
    // ROTATE REFRESH TOKEN
    // ----------------------------
    rotateRefreshToken(oldToken) {
        const userId = this.verifyRefreshToken(oldToken);
        this.revokeRefreshToken(oldToken);
        const newAccessToken = this.createAccessToken({ sub: userId, email: "" }); // email can be fetched from DB
        const newRefreshToken = this.createRefreshToken(userId);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
