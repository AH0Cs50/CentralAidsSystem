import crypto from 'crypto'; //for secure token generation
export class ResetPasswordTokenService {
    passwordResetRepo;
    constructor(passwordResetRepo) {
        this.passwordResetRepo = passwordResetRepo;
    }
    async generateToken(userId, expiresIn = 3600) {
        // 1. Generate a secure random token
        const token = crypto.randomBytes(32).toString('hex');
        // 2. Calculate expiration timestamp
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        // 3. Save token in repository
        const resetToken = {
            userId,
            token,
            expiresAt,
            used: false
        };
        await this.passwordResetRepo.createToken(resetToken);
        return token;
    }
    async validateToken(token) {
        // 1. Find token in repository
        const resetToken = await this.passwordResetRepo.findByToken(token);
        if (!resetToken)
            throw new Error("Invalid token");
        // 2. Check if token is expired
        if (resetToken.expiresAt < new Date()) {
            await this.passwordResetRepo.markTokenAsUsed(token);
            throw new Error("Token has expired");
        }
        return resetToken.userId;
    }
    async invalidateToken(token) {
        const resetToken = await this.passwordResetRepo.findByToken(token);
        if (!resetToken)
            throw new Error("Invalid token");
        await this.passwordResetRepo.markTokenAsUsed(token);
        return true;
    }
    async revokeAllTokensForUser(userId) {
    }
}
