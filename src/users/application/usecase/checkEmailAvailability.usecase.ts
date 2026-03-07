import type { IUserRepository } from "../../domain/repositories/IUser.repository.js";
import { Email } from "../../domain/value-objects/Email.js";

export class CheckEmailAvailabilityUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(email: string): Promise<boolean> {
        const emailVo = Email.create(email);
        const user = await this.userRepository.findByEmail(emailVo);
        return !user;
    }
}