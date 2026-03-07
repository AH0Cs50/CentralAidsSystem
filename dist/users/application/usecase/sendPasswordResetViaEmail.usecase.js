import { Email } from "../../domain/value-objects/Email.js";
export class sendPasswordResetViaEmailUseCase {
    resetPasswordTokenPassword;
    emailService;
    userRepository;
    constructor(resetPasswordTokenPassword, emailService, userRepository) {
        this.resetPasswordTokenPassword = resetPasswordTokenPassword;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }
    async execute(userEmail) {
        const userEmailVO = Email.create(userEmail);
        const user = await this.userRepository.findByEmail(userEmailVO);
        if (!user)
            throw new Error("User not found");
        const userId = user.id;
        // 1. Generate a password reset token
        const token = await this.resetPasswordTokenPassword.generateToken(userId);
        // 2. Send email to user with reset link containing the token
        await this.emailService.sendPasswordResetEmail(userId, token);
    }
}
