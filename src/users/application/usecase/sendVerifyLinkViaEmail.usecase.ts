import type { IUserRepository } from "../../domain/repositories/IUser.repository.js";
import type { IEmailService } from "../../domain/services/IEmailService.js";
import { Email } from "../../domain/value-objects/Email.js";
import { UserNotFoundError } from "../../domain/errors/user.error.js";


export class SendVerifyLinkViaEmailUseCase {
    constructor(private readonly userRepository: IUserRepository,
        private readonly emailService: IEmailService
    ) { }

    async execute(email: string): Promise<void> {
        const emailValue = Email.create(email);
        const User = await this.userRepository.findByEmail(emailValue);
        if (!User) throw new UserNotFoundError();
        const userId = User.id;
        //need to make access token for email with some time differ than the time of access token 
        //after make it generate the like at query param then send it via email service 
        //i use the specified payload for this 
    }
}