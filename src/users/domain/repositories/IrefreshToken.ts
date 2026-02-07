// src/domain/repositories/IRefreshTokenRepository.ts
import { RefreshTokenEntry } from "../entities/RefreshToken.entitiy.js";

export interface IRefreshTokenRepository {
  /**
   * Save a new refresh token
   */
  save(token: RefreshTokenEntry): Promise<void>;

  /**
   * Find a refresh token by token string
   */
  findByToken(token: string): Promise<RefreshTokenEntry | null>;

  /**
   * Revoke a refresh token
   */
  revoke(token: string): Promise<void>;

  /**
   * Delete expired tokens
   */
  deleteExpired(): Promise<number>; // returns number of deleted tokens

  /**
   * Optional: revoke all tokens for a user
   */
  revokeAllForUser(userId: string): Promise<void>;
}
