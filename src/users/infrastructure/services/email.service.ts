// src/infrastructure/services/EmailService.ts
import nodemailer from 'nodemailer';
import { type IEmailService } from "../../domain/services/IEmailService.js";

interface SMPTConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export class EmailService implements IEmailService {
  private transporter;

  constructor(config: SMPTConfig) {
    // Configure your SMTP transporter
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async sendVerificationEmail(to: string, userId: string): Promise<void> {
    const link = `${process.env.APP_URL}/verify-email?token=${userId}`;
    const subject = "Verify Your Account";
    const body = `<p>Please click the link to verify your account: <a href="${link}">Verify Account</a></p>`;

    await this.sendEmail(to, subject, body);
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const link = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    const subject = "Reset Your Password";
    const body = `<p>Click here to reset your password: <a href="${link}">${link}</a></p>`;

    await this.sendEmail(to, subject, body);
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"My App" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html: body,
    });
  }
}