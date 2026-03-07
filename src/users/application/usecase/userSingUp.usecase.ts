import type { IUserRepository } from "../../domain/repositories/IUser.repository.js";
import type { IpasswordHasher } from "../services/IpasswordHasher.js";
import { User, Status } from "../../domain/entities/user.entity.js";
import { Email } from "../../domain/value-objects/Email.js";
import { Role } from "../../../shared/types.js";
import { v4 as uuidv4 } from 'uuid';

import { UserAlreadyExistsError } from "../../domain/errors/user.error.js";

export class SignUpUser {

  constructor(private userRepo: IUserRepository, private passwordHasher: IpasswordHasher) { }

  async execute(first_name: string, last_name: string, email: string, password: string, adminSecret?: string): Promise<User> {
    // Create Email value object to apply own rules on their values-Business rule: email must be unique
    const emailVO = Email.create(email);
    const existingUser = await this.userRepo.findByEmail(emailVO);
    if (existingUser) throw new UserAlreadyExistsError();

    const hashedPassword = await this.passwordHasher.hash(password);
    const role = adminSecret === process.env.ADMIN_SECRET ? Role.admin : Role.organization;
    // Create a new User entity with business rules applied
    const user = new User(uuidv4(), first_name, last_name, emailVO, hashedPassword, Status.suspend, role, false);
    // Save entity to repository (infrastructure layer)
    await this.userRepo.save(user);

    return user;
  }

}
