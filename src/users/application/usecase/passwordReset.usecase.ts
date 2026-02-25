import type { IUserRepository } from "../../domain/repositories/Iuser.repository.js";
import type { TokenService } from "../../infrastructure/services/token.service.js";
import type { Role } from "../../domain/entities/user.entity.js";

export class PasswordResetUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: IemailService,
        private readonly tokenService: TokenService,
    ) {}

    async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const token = this.tokenService.createAccessToken({ sub: userId, email: user.email.value, role: user.role, status: user.status });
        const resetLink = `${process.env.APP_URL}/password-reset:${token}`;

        await this.emailService.sendPasswordResetEmail(user.email, resetLink);
    }
}