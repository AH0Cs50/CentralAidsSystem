import {compare} from 'bcrypt'; // For password hashing in real app
import type { Email } from '../value-objects/Email.js';
import { stat } from 'node:fs';

export enum Status {
  active='ACTIVE',
  suspend='SUSPENDED',
  deleted='DELETED',
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
    private  status:Status,
    private  email_verified:boolean,

  ) {
  }

  async checkPassword(password: string): Promise<boolean> {
    return compare(password,this.passwordHash);
  }

  changePassword(newPassword: string) {
    //apply business rules for changing the password
    this.passwordHash = newPassword;
  }

  changeStatus(status:Status) {
    this.status=status;
  }

  getStatus ():string {
    return this.status;
  }

  verifyEmailStatus():void {
    this.email_verified=true;
  }

}
