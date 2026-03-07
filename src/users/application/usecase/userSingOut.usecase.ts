import type { ITokenService } from "../services/ITokenService.js";
import { InvalidRefreshTokenError } from "../../domain/errors/auth.error.js";

export class UserSignOutUseCase {

    constructor(private readonly tokenService: ITokenService) { }

    async execute(refreshToken: string): Promise<void> {

        if (!refreshToken) {
            const error = new InvalidRefreshTokenError();
            error.details = "Refresh token is required for sign out";
            throw error;
        }

        await this.tokenService.revokeRefreshToken(refreshToken);
    }
}