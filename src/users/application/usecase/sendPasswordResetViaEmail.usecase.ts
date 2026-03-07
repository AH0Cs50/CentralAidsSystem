import type { IUserRepository } from "../../domain/repositories/IUser.repository.js";
import type { IpasswordResetTokenService } from "../../domain/services/IResetPasswordTokenService.js";
import type { IEmailService } from "../../domain/services/IEmailService.js";
import { Email } from "../../domain/value-objects/Email.js";
import { UserNotFoundError } from "../../domain/errors/user.error.js";

export class sendPasswordResetViaEmailUseCase {
    constructor(
        private readonly resetPasswordTokenService: IpasswordResetTokenService,
        private readonly emailService: IEmailService,
        private readonly userRepository: IUserRepository
    ) { }

    async execute(userEmail: string): Promise<void> {
        const userEmailVO = Email.create(userEmail);
        const user = await this.userRepository.findByEmail(userEmailVO);
        if (!user) throw new UserNotFoundError();
        const userId = user.id;
        const token = await this.resetPasswordTokenService.generateToken(userId);
        await this.emailService.sendPasswordResetEmail(userId, token);
    }
}