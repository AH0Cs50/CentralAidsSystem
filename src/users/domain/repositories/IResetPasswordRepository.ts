
export interface PasswordResetToken {
    userId: string;
    token: string;
    expiresAt: Date;
    used: boolean;
}

export interface IPasswordResetTokenRepository {
    /**
     * Creates a password reset token for a user.
     * @param userId - The ID of the user requesting the password reset.
     * @returns The generated password reset token.
     */
    createToken(tokenData: PasswordResetToken): Promise<string>;


    /**
     * Finds a password reset token by its value.
     * @param token - The token string to search for.
     * @returns The found password reset token or null if not found.
     */
    findByToken(token: string): Promise<PasswordResetToken | null>;

    /**
     * Finds all password reset tokens associated with a user ID.
     * @param userId - The ID of the user to find tokens for.
     * @returns An array of password reset tokens associated with the user.
     */

    findByUserId(userId: string): Promise<PasswordResetToken[]>;


    /**
     * Marks a password reset token as used.
     * @param token - The token string to mark as used.
     */

    markTokenAsUsed(token: string): Promise<void>;
    /**
     * Revokes all password reset tokens for a given user ID.
     * @param userId - The ID of the user whose tokens should be revoked.
     */
    getUnusedTokensByUserId(userId: string): Promise<PasswordResetToken[]>;

    makeAllTokensUsedForUser(userId: string): Promise<void>;
}
