//You extract the primitive value (string) when saving, and recreate the VO when loading.
//VO represent value domain with own rules for value in this case the email
export class Email {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(email) {
        if (!Email.isValid(email)) {
            throw new Error("Invalid email format");
        }
        return new Email(email);
    }
    static isValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
