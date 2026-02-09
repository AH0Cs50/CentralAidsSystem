// src/application/services/AuthService.ts
import jwt, {} from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from '../../shared/HttpError.js';
import {} from "ms";
import { RefreshTokenEntry } from "../domain/entities/RefreshToken.entitiy.js";
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
        const expiresIn = this.config.jwtExpiresIn;
        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn,
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
    createRefreshToken(userId, role) {
        const expiresIn = this.config.refreshExpiresIn;
        const token = jwt.sign({ sub: userId, role }, this.config.refreshSecret, {
            expiresIn,
            jwtid: uuidv4(), //jti
        });
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.jti || !decoded.exp) {
            throw new Error("Failed to decode refresh token");
        }
        const expiresAt = decoded.exp * 1000; // convert to ms
        const expiresAtDate = new Date(decoded.exp * 1000);
        const refreshTokenEntity = new RefreshTokenEntry(decoded.jti, token, userId, expiresAtDate, false);
        this.refreshTokens.set(token, {
            tokenId: decoded.jti,
            userId,
            revoked: false,
            expiresAt: new Date(expiresAt),
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
        const newAccessToken = this.createAccessToken({ sub: userId, email: "", role: "user" }); // email can be fetched from DB
        const newRefreshToken = this.createRefreshToken(userId);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
