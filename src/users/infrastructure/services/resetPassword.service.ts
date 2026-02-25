import type { IPasswordResetRepository, IPasswordResetToken } from "../../domain/repositories/IpasswordReset.repository.js";
import type { IResetPasswordTokenService } from "../../domain/services/IResetPassService.js";

import crypto from 'crypto'; //for secure token generation

export class ResetPasswordService implements IResetPasswordTokenService {
    constructor(private readonly passwordResetRepo: IPasswordResetRepository) { }

    async generateToken(userId: string, expiresIn = 3600): Promise<string> {
        // 1. Generate a secure random token
        const token = crypto.randomBytes(32).toString('hex');

        // 2. Calculate expiration timestamp
        const expiresAt = new Date(Date.now() + expiresIn * 1000);

        // 3. Save token in repository
        const resetToken: IPasswordResetToken = {
            userId,
            token,
            expiresAt,
            used: false
        };
        await this.passwordResetRepo.createToken(resetToken);

        return token;
    }

    async validateToken(token: string): Promise<string | null> {
        // 1. Find token in repository
        const resetToken = await this.passwordResetRepo.findByToken(token);
        if (!resetToken) throw new Error("Invalid token");
        // 2. Check if token is expired
        if (resetToken.expiresAt < new Date()) {
            await this.passwordResetRepo.markTokenAsUsed(token);
            throw new Error("Token has expired");
        }
        return resetToken.userId;
    }

    async invalidateToken(token: string): Promise<boolean> {
        const resetToken = await this.passwordResetRepo.findByToken(token);
        if (!resetToken) throw new Error("Invalid token");
        await this.passwordResetRepo.markTokenAsUsed(token);
        return true;
    }

}
