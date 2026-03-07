import type { ITokenService, TokenPayload } from "../../application/services/ITokenService.js";
import type { IUserRepository } from "../../domain/repositories/IUser.repository.js";
import { Email } from "../../domain/value-objects/Email.js";
import {
    UserNotFoundError, InvalidUserCredentialsError, UserCredentialsRequiredError,
    UserEmailNotVerifiedError, userAccountLockedError
} from "../../domain/errors/user.error.js";

export class userSignInUsecase {
    constructor(private readonly userRepository: IUserRepository,
        private readonly tokenService: ITokenService
    ) { }

    async execute(email: string, password: string) {
        if (!email || !password) {
            throw new UserCredentialsRequiredError();
        }
        const EmailVO = Email.create(email);
        const User = await this.userRepository.findByEmail(EmailVO);

        if (!User) throw new UserNotFoundError();
        if (User.isEmailVerified() === false) throw new UserEmailNotVerifiedError();
        if (User.isAccountLocked()) throw new userAccountLockedError();

        const isPasswordValid = await User.checkPassword(password);
        if (!isPasswordValid) {
            throw new InvalidUserCredentialsError();
        }
        const payload: TokenPayload = {
            sub: User.id,
            email: User.email.value,
            role: User.getRole(),
            status: User.getStatus()
        }
        this.tokenService.createAccessToken(payload);
        //now the access token is must revoke or not ?
    }
}
