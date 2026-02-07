import type { IUserRepository } from "../../domain/repositories/IUserRepository.js";
//entities
import { User } from "../../domain/entities/user.entity.js";
//value object
import { Email } from "../../domain/value-objects/Email.js";

import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt'; // for password hashing, if needed
import { HttpError } from "../../../shared/HttpError.js";

export class SignUpUser {
  constructor(private userRepo: IUserRepository) {}//inject the repository to access data layer

  async execute(name:string, email: string, password: string): Promise<User> {
    // Business rule: email must be unique
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) throw new HttpError(409, "Email already exists");
    // Create Email value object to apply own rules on their value;s
    const emailVO = Email.create(email); 
    //hashing password
    const hashedPassword = await this.hashPassword(password);
    // Create a new User entity with business rules applied
    const user = new User(uuidv4(), name, emailVO, hashedPassword);

    // Save entity to repository (infrastructure layer)
    await this.userRepo.save(user);

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    // business rule: store hashed password
    return hash(password, 10); // Use bcrypt to hash the password
  }
}
