import type { IUserRepository } from "../../domain/repositories/IUser.repository.js";
import { Email } from "../../domain/value-objects/Email.js";
import { UserNotFoundError } from "../../domain/errors/user.error.js";
export class VerifyUserEmailUseCase {

    constructor(private readonly userRepository: IUserRepository) { }

    async execute(userId: string) {
        const User = await this.userRepository.findById(userId);
        if (!User) throw new UserNotFoundError();
        User.verifyEmailStatus();
        await this.userRepository.update(User);
        return true;
    }
}