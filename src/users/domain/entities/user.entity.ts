import {compare} from 'bcrypt'; // For password hashing in real app
import type { Email } from '../value-objects/Email.js';

export class User {
  //shorthand for define properties in the constructor
  constructor(
    public readonly id: string,
    public readonly name: string,
    //extract the primitive value (string) when saving, and recreate the VO when loading.
    public readonly email: Email,
    private passwordHash: string
  ) {
  }

  async checkPassword(password: string): Promise<boolean> {
    return compare(password,this.passwordHash);
  }

  changePassword(newPassword: string) {
    //apply business rules for changing the password
    this.passwordHash = newPassword;
  }
}
