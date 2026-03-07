export class PasswordResetUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
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
