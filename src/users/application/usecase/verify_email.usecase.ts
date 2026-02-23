
import type { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import type { AuthService, TokenPayload } from "../auth.service.js";

export class verifyEmail {
    constructor (private readonly userRepo: IUserRepository,
    ){}

    async execute (userId:string):Promise<boolean> {
        //get user data
        return true;
    }
}