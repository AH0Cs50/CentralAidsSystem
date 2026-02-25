export class verifyEmail {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.verifyEmailStatus();
        await this.userRepo.save(user);
        return true;
    }
}
