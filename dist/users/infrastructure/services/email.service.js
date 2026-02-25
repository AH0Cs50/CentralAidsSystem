// src/infrastructure/services/EmailService.ts
import nodemailer from 'nodemailer';
import {} from "../../domain/services/IEmailService.js";
export class EmailService {
    transporter;
    constructor() {
        // Configure your SMTP transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendVerificationEmail(to, token) {
        const link = `${process.env.APP_URL}/verify-email?token=${token}`;
        const subject = "Verify Your Account";
        const body = `<p>Please click the link to verify your account: <a href="${link}">${link}</a></p>`;
        await this.sendEmail(to, subject, body);
    }
    async sendPasswordResetEmail(to, resetToken) {
        const link = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
        const subject = "Reset Your Password";
        const body = `<p>Click here to reset your password: <a href="${link}">${link}</a></p>`;
        await this.sendEmail(to, subject, body);
    }
    async sendEmail(to, subject, body) {
        await this.transporter.sendMail({
            from: `"My App" <${process.env.SMTP_FROM}>`,
            to,
            subject,
            html: body,
        });
    }
}
