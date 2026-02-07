// src/application/services/AuthService.ts
import jwt,{type SignOptions} from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from '../../shared/HttpError.js'
import { type StringValue } from "ms";

import { RefreshTokenEntry } from "../domain/entities/RefreshToken.entitiy.js";
import type {IRefreshTokenRepository} from '../domain/repositories/IrefreshToken.js'
/**
 * Payload for JWT tokens
 */
export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: string
}


/**
 * AuthService configuration
 */
export interface AuthConfig {
  jwtSecret: string;             // secret for access token
  jwtExpiresIn: string;          // e.g. "15m"
  refreshSecret: string;         // secret for refresh token
  refreshExpiresIn: string;      // e.g. "7d"
}

/**
 * General-purpose AuthService
 */
export class AuthService {
  private refreshTokens: Map<string, RefreshTokenEntry> = new Map();

  constructor(private readonly config: AuthConfig,
    private readonly refreshtokenRepo: IRefreshTokenRepository ) {}

  // ----------------------------
  // ACCESS TOKEN
  // ----------------------------
  createAccessToken(payload: TokenPayload): string {
    const expiresIn: StringValue = this.config.jwtExpiresIn as StringValue;
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn,
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.config.jwtSecret) as TokenPayload;
    } catch {
      throw new HttpError(401, "Invalid or expired access token");
    }
  }

  // ----------------------------
  // REFRESH TOKEN
  // ----------------------------
  createRefreshToken(userId: string,role:string): string {
    const expiresIn: StringValue = this.config.refreshExpiresIn as StringValue;
    const token = jwt.sign({ sub: userId, role }, this.config.refreshSecret , {
     expiresIn,
      jwtid: uuidv4(), //jti
    });

    const decoded = jwt.decode(token) as { jti: string; exp: number } | null;
        if (!decoded || !decoded.jti || !decoded.exp) {
            throw new Error("Failed to decode refresh token");
    }
    const expiresAt = decoded.exp * 1000; // convert to ms

    const expiresAtDate = new Date(decoded.exp * 1000);

    const refreshTokenEntity = new RefreshTokenEntry(
    decoded.jti,   
    token,        
    userId,
    expiresAtDate,
    false 
    );

    this.refreshTokens.set(token, {
      tokenId: decoded.jti,
      userId,
      revoked: false,
      expiresAt:new Date(expiresAt),
    });

    return token;
  }

  verifyRefreshToken(token: string): string {
    const stored = this.refreshTokens.get(token);

    if (!stored || stored.revoked) {
      throw new HttpError(401, "Refresh token revoked or invalid");
    }

    try {
      const payload = jwt.verify(token, this.config.refreshSecret) as { sub: string };
      return payload.sub;
    } catch {
      throw new HttpError(401, "Invalid or expired refresh token");
    }
  }

  revokeRefreshToken(token: string) {
    const stored = this.refreshTokens.get(token);
    if (stored) {
      stored.revoked = true;
      this.refreshTokens.set(token, stored);
    }
  }

  // ----------------------------
  // ROTATE REFRESH TOKEN
  // ----------------------------
  rotateRefreshToken(oldToken: string): { accessToken: string; refreshToken: string } {
    const userId = this.verifyRefreshToken(oldToken);
    this.revokeRefreshToken(oldToken);

    const newAccessToken = this.createAccessToken({ sub: userId, email: "" ,role:"user"}); // email can be fetched from DB
    const newRefreshToken = this.createRefreshToken(userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
