// src/infrastructure/services/token.service.ts
import type { ITokenService, TokenPayload, TokenServiceConfig } from '../../application/services/ITokenService.js';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import type { StringValue } from "ms"; //string value type for ms library, to ensure correct typing for expiresIn

import { RefreshTokenEntry } from "../../domain/entities/RefreshToken.entity.js";
import type { IRefreshTokenRepository } from '../../domain/repositories/IRefreshToken.repository.js';

//error handling
import {
  InvalidAccessTokenError,
  InvalidRefreshTokenError,
  RefreshTokenRevokedError,
  RefreshTokenStorageError,
  RefreshTokenDecodeError
} from "../../domain/errors/auth.error.js";


/**
 * General-purpose TokenService
 */

export class TokenService implements ITokenService {
  private refreshTokens: Map<string, RefreshTokenEntry> = new Map(); //in memory refresh token store, can be replaced with a repository for persistence or live in Redis for distributed systems

  constructor(private readonly config: TokenServiceConfig,
    private readonly refreshTokenRepo: IRefreshTokenRepository) { }
  // ----------------------------
  // ACCESS TOKEN
  // ----------------------------
  createAccessToken(payload: TokenPayload): string {
    const expiresIn: StringValue = this.config.jwtExpiresIn as StringValue;
    return jwt.sign(payload, this.config.jwtSecret, { expiresIn });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.config.jwtSecret) as TokenPayload;
    } catch {
      throw new InvalidAccessTokenError();
    }
  }

  // ----------------------------
  // REFRESH TOKEN
  // ----------------------------
  createRefreshToken(userId: string, role: string): string {
    const expiresIn: StringValue = this.config.refreshExpiresIn as StringValue;

    const token = jwt.sign({ sub: userId, role }, this.config.refreshSecret, {
      expiresIn,
      jwtid: uuidv4(), //jti
    });

    const decoded = jwt.decode(token) as { jti: string; exp: number } | null;
    if (!decoded || !decoded.jti || !decoded.exp) {
      throw new RefreshTokenDecodeError();
    }

    const expiresAtDate = new Date(decoded.exp * 1000);

    const refreshTokenEntity = new RefreshTokenEntry(
      decoded.jti,
      token,
      userId,
      expiresAtDate,
      false
    );

    this.refreshTokens.set(token, refreshTokenEntity);
    this.refreshTokenRepo.save(refreshTokenEntity).catch(() => {
      this.refreshTokens.delete(token);
      throw new RefreshTokenStorageError();
    })

    return token;
  }

  private async getRefreshToken(token: string): Promise<RefreshTokenEntry> {
    let stored: RefreshTokenEntry | undefined = this.refreshTokens.get(token);
    if (!stored) {
      stored = await this.refreshTokenRepo.findByToken(token);
    }
    if (stored?.revoked === true || !stored) throw new InvalidRefreshTokenError();
    this.refreshTokens.set(token, stored);
    return stored;
  }

  async verifyRefreshToken(token: string): Promise<string> {

    let stored = await this.getRefreshToken(token);

    if (stored.revoked) {
      throw new RefreshTokenRevokedError();
    }

    try {
      const payload = jwt.verify(token, this.config.refreshSecret) as { sub: string };
      return payload.sub;
    } catch {
      throw new InvalidRefreshTokenError();
    }
  }

  async revokeRefreshToken(token: string): Promise<boolean> {
    const stored = await this.getRefreshToken(token);
    if (stored) {
      stored.revoked = true;
      this.refreshTokens.delete(token);
      this.refreshTokenRepo.revoke(stored.token);
      return true;
    }
    return false;
  }

}
