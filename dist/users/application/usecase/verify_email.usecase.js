export class VerifyEmailUseCase {
    resetServiceToken;
    constructor(resetServiceToken) {
        this.resetServiceToken = resetServiceToken;
    }
    async execute(passResetToken) {
        return true;
    }
}
