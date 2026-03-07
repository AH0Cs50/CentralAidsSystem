
import type { ITokenService, TokenPayload } from "../services/ITokenService.js";
import type { IUserRepository } from "../../domain/repositories/IUser.repository.js";
import { User } from "../../domain/entities/user.entity.js";

import { UserNotFoundError } from "../../domain/errors/user.error.js";

export class getAccessTokenViaRefreshTokenUseCase {
    constructor(private readonly TokenService: ITokenService,
        private readonly userRepo: IUserRepository
    ) { }

    async execute(refreshToken: string): Promise<string> {
        const UserId = await this.TokenService.verifyRefreshToken(refreshToken);
        const User = await this.userRepo.findById(UserId);
        if (!User) throw new UserNotFoundError();
        const payload: TokenPayload = {
            sub: User.id,
            email: User.email.value,
            role: User.getRole(),
            status: User.getStatus()
        }
        const AccessToken = this.TokenService.createAccessToken(payload);
        return AccessToken;
    }
}