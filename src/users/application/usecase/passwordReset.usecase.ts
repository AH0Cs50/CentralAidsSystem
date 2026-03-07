import type { IpasswordResetTokenService } from "../../domain/services/IResetPasswordTokenService.js";
import type { IpasswordHasher } from "../../application/services/IpasswordHasher.js";
import type { IUserRepository } from "../../domain/repositories/IUser.repository.js";

import { InvalidResetTokenError, PasswordValidationError } from "../../domain/errors/password.error.js";

export class PasswordResetUseCase {

    constructor(private readonly passwordResetTokenService: IpasswordResetTokenService,
        private readonly passwordHasher: IpasswordHasher,
        private readonly userRepository: IUserRepository
    ) { }

    async execute(token: string, newPassword: string): Promise<void> {
        const userId = await this.passwordResetTokenService.validateToken(token);
        if (!userId) throw new InvalidResetTokenError();
        const User = await this.userRepository.findById(userId);
        if (newPassword.length < 8) {
            const error = new PasswordValidationError();
            error.details = "Password must be at least 8 characters long";
            throw error;
        }
        const hashedPassword = await this.passwordHasher.hash(newPassword);
        User?.changePassword(hashedPassword);
        await this.userRepository.update(User!);
        // Invalidate the token after successful password reset
        await this.passwordResetTokenService.invalidateToken(token);
        // Optionally, send a confirmation email about password change
        // await this.emailService.sendPasswordChangeConfirmationEmail(userId);
        // Example: await this.userRepository.updatePassword(userId, hashedPassword);
    }
}

