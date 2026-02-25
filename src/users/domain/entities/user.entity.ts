import {compare} from 'bcrypt'; // For password hashing in real app
import type { Email } from '../value-objects/Email.js';

export enum Status {
  active='ACTIVE',
  suspend='SUSPENDED',
  deleted='DELETED',
}

export enum Role {
  admin='ADMIN',
  organization='ORGANIZATION',
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
    private role:Role,
    private  email_verified:boolean,

  ) {
  }

  async checkPassword(password: string): Promise<boolean> {
    return compare(password,this.passwordHash);
  }

  changePassword(newPassword: string) {
    if(newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    this.passwordHash = newPassword;
  }

  changeRole(role:Role) {
    this.role=role;
  }

  getRole():string {
    return this.role
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

  getUserData():object {
    return {
      id:this.id,
      first_name:this.first_name,
      last_name:this.last_name,
      email:this.email.value, // extract primitive value from VO
      status:this.status,
      email_verified:this.email_verified,
    }
  }

}
