import { compare } from 'bcrypt'; // For password hashing in real app
import type { Email } from '../value-objects/Email.js';
import type { Role } from '../../../shared/types.js';

export enum Status {
  active = 'ACTIVE',
  suspend = 'SUSPENDED',
  deleted = 'DELETED',
}

export class User {
  //shorthand for define properties in the constructor
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    //extract the primitive value (string) when saving, and recreate the VO when loading.
    public readonly email: Email,
    private passwordHash: string,
    private status: Status,
    private role: Role,
    private email_verified: boolean,

  ) {
  }

  async checkPassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  changePassword(hashedPassword: string) {
    if (!hashedPassword) throw new Error("Password cannot be empty");
    this.passwordHash = hashedPassword;
  }

  changeRole(role: Role): boolean {
    this.role = role;
    return true;
  }

  getRole(): string {
    return this.role
  }

  changeStatus(status: Status): boolean {
    this.status = status;
    return true;
  }

  getStatus(): string {
    return this.status;
  }

  isAccountLocked(): boolean {
    return this.status === Status.suspend;
  }

  verifyEmailStatus(): boolean {
    this.email_verified = true;
    return true;
  }

  isEmailVerified(): boolean {
    return this.email_verified;
  }

  getUserData(): object {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email.value, // extract primitive value from VO
      status: this.status,
      email_verified: this.email_verified,
    }
  }

}
