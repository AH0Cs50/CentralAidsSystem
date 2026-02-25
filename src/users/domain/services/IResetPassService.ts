// users/domain/services/IResetPasswordTokenService.ts

export interface IResetPasswordTokenService {
  /**
   * Generate a new password reset token for a user
   * @param userId The ID of the user requesting a reset
   * @param expiresIn Optional expiration in seconds (default 1 hour)
   * @returns The generated token string
   */
  generateToken(userId: string, expiresIn?: number): Promise<string>;

  /**
   * Validate a password reset token
   * @param token The token string to validate
   * @returns userId if valid, null if invalid/expired/used
   */
  validateToken(token: string): Promise<string | null>;

  /**
   * Mark a token as used after successful password reset
   * @param token The token string
   */
  invalidateToken(token: string): Promise<boolean>;

  // /**
  //  * Revoke all existing reset tokens for a user (optional)
  //  * @param userId The user ID
  //  */
  // revokeAllTokensForUser?(userId: string): Promise<boolean>;
}