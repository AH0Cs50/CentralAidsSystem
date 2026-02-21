export class verifyEmail {
    userRepo;
    authService;
    constructor(userRepo, authService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }
    async execute(token) {
    }
}
