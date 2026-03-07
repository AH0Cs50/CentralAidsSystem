import type { IPasswordResetTokenRepository, PasswordResetToken } from "../../domain/repositories/IResetPasswordRepository.js";
import type { IpasswordResetTokenService } from "../../domain/services/IResetPasswordTokenService.js";
import type { IpasswordHasher } from "../../application/services/IpasswordHasher.js";
import crypto from 'crypto'; //for secure token generation
import { InvalidResetTokenError, ResetTokenExpiredError, ResetTokenNotFoundError } from "../../domain/errors/password.error.js";

export class ResetPasswordTokenService implements IpasswordResetTokenService {
    constructor(private readonly passwordResetRepo: IPasswordResetTokenRepository,
        private readonly passwordHasher: IpasswordHasher) { }

    private generateSecureToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private hashToken(token: string): Promise<string> {
        return this.passwordHasher.hash(token);
    }

    async generateToken(userId: string, expiresIn = 3600): Promise<string> {

        const token = this.generateSecureToken();

        // 2. Calculate expiration timestamp
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        const hashedToken = await this.hashToken(token);
        // 3. Save token in repository
        const resetToken: PasswordResetToken = {
            userId,
            token: hashedToken,
            expiresAt,
            used: false
        };
        await this.passwordResetRepo.createToken(resetToken);

        return token;
    }

    async validateToken(token: string): Promise<string | null> {
        const hashedToken = await this.hashToken(token); // Hash the incoming token to compare with stored hash
        // 1. Find token in repository
        const resetToken = await this.passwordResetRepo.findByToken(hashedToken);
        if (!resetToken) throw new InvalidResetTokenError();
        // 2. Check if token is expired
        if (resetToken.expiresAt < new Date()) {
            await this.passwordResetRepo.markTokenAsUsed(hashedToken);
            throw new ResetTokenExpiredError();
        }
        return resetToken.userId;
    }

    async invalidateToken(token: string): Promise<boolean> {
        const hashedToken = await this.hashToken(token);
        const resetToken = await this.passwordResetRepo.findByToken(hashedToken);
        if (!resetToken) throw new InvalidResetTokenError();
        await this.passwordResetRepo.markTokenAsUsed(hashedToken);
        return true;
    }

    async revokeAllTokensForUser(userId: string): Promise<boolean> {
        await this.passwordResetRepo.makeAllTokensUsedForUser(userId);
        return true;
    }

}
