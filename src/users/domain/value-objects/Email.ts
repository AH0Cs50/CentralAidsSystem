//You extract the primitive value (string) when saving, and recreate the VO when loading.
//VO represent value domain with own rules for value in this case the email
export class Email {
  private constructor(public readonly value: string) {}

  static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new Error("Invalid email format");
    }
    return new Email(email);
  }

  private static isValid(email: string): boolean {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
