import { compare } from 'bcrypt'; // For password hashing in real app
export var Status;
(function (Status) {
    Status["active"] = "ACTIVE";
    Status["suspend"] = "SUSPENDED";
    Status["deleted"] = "DELETED";
})(Status || (Status = {}));
export var Role;
(function (Role) {
    Role["admin"] = "ADMIN";
    Role["organization"] = "ORGANIZATION";
})(Role || (Role = {}));
export class User {
    id;
    first_name;
    last_name;
    email;
    passwordHash;
    status;
    role;
    email_verified;
    //shorthand for define properties in the constructor
    constructor(id, first_name, last_name, 
    //extract the primitive value (string) when saving, and recreate the VO when loading.
    email, passwordHash, status, role, email_verified) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.status = status;
        this.role = role;
        this.email_verified = email_verified;
    }
    async checkPassword(password) {
        return compare(password, this.passwordHash);
    }
    changePassword(newPassword) {
        if (newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        this.passwordHash = newPassword;
    }
    changeRole(role) {
        this.role = role;
    }
    getRole() {
        return this.role;
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
    getUserData() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email.value, // extract primitive value from VO
            status: this.status,
            email_verified: this.email_verified,
        };
    }
}
