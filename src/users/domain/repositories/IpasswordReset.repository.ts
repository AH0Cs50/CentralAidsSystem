
export interface IPasswordResetToken {
    userId: string;
    token: string;
    expiresAt: Date;
    used: boolean;
}

export interface IPasswordResetRepository {
    /**
     * Creates a password reset token for a user.
     * @param userId - The ID of the user requesting the password reset.
     * @returns The generated password reset token.
     */
    createToken(tokenData: IPasswordResetToken): Promise<string>;


    /**
     * Finds a password reset token by its value.
     * @param token - The token string to search for.
     * @returns The found password reset token or null if not found.
     */
    findByToken(token: string): Promise<IPasswordResetToken | null>;

    /**
     * Finds all password reset tokens associated with a user ID.
     * @param userId - The ID of the user to find tokens for.
     * @returns An array of password reset tokens associated with the user.
     */

    findByUserId(userId: string): Promise<IPasswordResetToken[]>;

    /**
     * Marks a password reset token as used.
     * @param token - The token string to mark as used.
     */

    markTokenAsUsed(token: string): Promise<void>;

}
