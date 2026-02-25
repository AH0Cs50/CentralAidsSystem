import type { ResetPasswordService } from "../../infrastructure/services/resetPassword.service.js";


export class VerifyEmailUseCase {
    constructor(private readonly resetServiceToken: ResetPasswordService) { }

    async execute(passResetToken: string): Promise<boolean> {

        return true;
    }

}