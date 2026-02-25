// users/domain/services/IEmailService.ts

export interface IEmailService {
  /**
   * Send an email to verify a user account.
   * @param to Recipient email address
   * @param token Verification token
   */
  sendVerificationEmail(to: string, token: string): Promise<void>;

  /**
   * Send a password reset email.
   * @param to Recipient email address
   * @param resetToken Token used for resetting password
   */
  sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;

  /**
   * Send a generic email with custom subject and body.
   * @param to Recipient email address
   * @param subject Email subject
   * @param body HTML or plain text content
   */
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}