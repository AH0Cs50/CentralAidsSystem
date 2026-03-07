// src/infrastructure/services/EmailService.ts
import nodemailer from 'nodemailer';
export class EmailService {
    transporter;
    constructor(config) {
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
    async sendVerificationEmail(to, userId) {
        const link = `${process.env.APP_URL}/verify-email?token=${userId}`;
        const subject = "Verify Your Account";
        const body = `<p>Please click the link to verify your account: <a href="${link}">Verify Account</a></p>`;
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
