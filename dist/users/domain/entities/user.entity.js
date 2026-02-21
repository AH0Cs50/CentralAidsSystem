import { compare } from 'bcrypt'; // For password hashing in real app
import { stat } from 'node:fs';
export var Status;
(function (Status) {
    Status["active"] = "ACTIVE";
    Status["suspend"] = "SUSPENDED";
    Status["deleted"] = "DELETED";
})(Status || (Status = {}));
export class User {
    id;
    first_name;
    last_name;
    email;
    passwordHash;
    status;
    email_verified;
    //shorthand for define properties in the constructor
    constructor(id, first_name, last_name, 
    //extract the primitive value (string) when saving, and recreate the VO when loading.
    email, passwordHash, status, email_verified) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.status = status;
        this.email_verified = email_verified;
    }
    async checkPassword(password) {
        return compare(password, this.passwordHash);
    }
    changePassword(newPassword) {
        //apply business rules for changing the password
        this.passwordHash = newPassword;
    }
    changeStatus(status) {
        this.status = status;
    }
    getStatus() {
        return this.status;
    }
    verifyEmailStatus() {
        this.email_verified = true;
    }
}
