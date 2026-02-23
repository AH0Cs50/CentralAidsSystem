export class verifyEmail {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(userId) {
        return true;
    }
}
