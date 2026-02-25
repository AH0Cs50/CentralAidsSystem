export class PasswordResetUseCase {
    userRepository;
    emailService;
    tokenService;
    constructor(userRepository, emailService, tokenService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.tokenService = tokenService;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const token = this.tokenService.createAccessToken({ sub: userId, email: user.email.value, role: user.role, status: user.status });
        const resetLink = `${process.env.APP_URL}/password-reset:${token}`;
        await this.emailService.sendPasswordResetEmail(user.email, resetLink);
    }
}
