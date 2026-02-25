// src/application/services/ITokenService.ts
import type { RefreshTokenEntry } from '../../domain/entities/RefreshToken.entitiy.js';

/**
 * Payload for JWT tokens
*/

//consider as token payload type for both access and refresh tokens, can be extended with more fields as needed (e.g. role, permissions)
export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: string;
  status: string;
}

/**
 * AuthService configuration
 */
export interface TokenServiceConfig {
  jwtSecret: string;             // secret for access token
  jwtExpiresIn: string;          // e.g. "15m"
  refreshSecret: string;         // secret for refresh token
  refreshExpiresIn: string;      // e.g. "7d"
}

/**
 * Interface for a TokenService
 * Can be implemented by any class that handles JWT access/refresh tokens
 */
export interface ITokenService {

  /**
   * Creates a new access token from payload
   */
  createAccessToken(payload: TokenPayload): string;

  /**
   * Verifies an access token and returns its payload
   * @throws HttpError 401 if invalid or expired
   */
  verifyAccessToken(token: string): TokenPayload;

  /**
   * Creates a new refresh token for the user
   * @param userId - user identifier
   * @param role - user's role
   * @returns the JWT refresh token string
   */
  createRefreshToken(userId: string, role: string): string;

  /**
   * Verifies a refresh token
   * @returns the userId (sub) if valid
   * @throws HttpError 401 if invalid, revoked, or expired
   */
  verifyRefreshToken(token: string): Promise<string>;

  /**
   * Revokes a refresh token
   */
  revokeRefreshToken(token: string): Promise<void>;

}