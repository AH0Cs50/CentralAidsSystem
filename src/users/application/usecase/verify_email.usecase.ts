
import type { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import type { AuthService, TokenPayload } from "../auth.service.js";

export class verifyEmail {
    constructor (private readonly userRepo: IUserRepository,
        private readonly authService:AuthService,
    ){}

    async execute (token):Promise<boolean> {
        const payload:TokenPayload =this.authService.verifyAccessToken(token);
        const userId=paly
    }
}