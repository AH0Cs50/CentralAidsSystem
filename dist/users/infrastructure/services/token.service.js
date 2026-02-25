// src/infrastructure/services/AuthService.ts
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from '../../../shared/HttpError.js';
import { RefreshTokenEntry } from "../../domain/entities/RefreshToken.entitiy.js";
/**
 * General-purpose TokenService
 */
export class TokenService {
    config;
    refreshTokenRepo;
    refreshTokens = new Map(); //in memory refresh token store, can be replaced with a repository for persistence or live in Redis for distributed systems
    constructor(config, refreshTokenRepo) {
        this.config = config;
        this.refreshTokenRepo = refreshTokenRepo;
    }
    // ----------------------------
    // ACCESS TOKEN
    // ----------------------------
    createAccessToken(payload) {
        const expiresIn = this.config.jwtExpiresIn;
        return jwt.sign(payload, this.config.jwtSecret, { expiresIn });
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
        const expiresAtDate = new Date(decoded.exp * 1000);
        const refreshTokenEntity = new RefreshTokenEntry(decoded.jti, token, userId, expiresAtDate, false);
        this.refreshTokens.set(token, refreshTokenEntity);
        this.refreshTokenRepo.save(refreshTokenEntity).catch(() => {
            throw new HttpError(500, "the refresh token not stored in db");
            // you can revoked here also and delete from refresh tokens memory in map 
        });
        return token;
    }
    async getRefreshToken(token) {
        let stored = this.refreshTokens.get(token);
        if (!stored) {
            stored = await this.refreshTokenRepo.findByToken(token);
            if (stored) {
                this.refreshTokens.set(token, stored);
            }
            else {
                throw new HttpError(401, "Refresh token revoked or invalid");
            }
        }
        return stored;
    }
    async verifyRefreshToken(token) {
        let stored = await this.getRefreshToken(token);
        if (stored.revoked) {
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
    async revokeRefreshToken(token) {
        const stored = await this.getRefreshToken(token);
        if (stored) {
            stored.revoked = true;
            this.refreshTokens.set(token, stored);
        }
    }
}
