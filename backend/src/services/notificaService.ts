import twilio from 'twilio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class NotificationService {
    private twilioClient: any;

    private emailTransporter: any;

    constructor() {
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
        ) {
            this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN
            );
        }

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.emailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        }
    }

    async sendSMS(to: string, message: string): Promise<boolean> {
        console.log(`to: ${to}, Message: ${message}`);

        if (
            !this.twilioClient ||
            !process.env.TWILIO_PHONE_NUMBER
        ) {
            console.warn(
                ` SMS provider not configured. Mock sending to ${to}`
            );
            return true; // Return true so it creates the user/code
        }

        try {

            let formattedTo = to;
            if (formattedTo.startsWith('0')) {
                formattedTo = '+84' + formattedTo.substring(1);
            }

            await this.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: formattedTo
            });

            return true;
        } catch (error) {
            console.error('Failed to send SMS:', error);
            console.log(`[SMS FALLBACK] Could not send SMS. Content: "${message}"`);
            return true; // Return true to allow flow to continue even if SMS fails
        }
    }

    async sendEmail(to: string, subject: string, html: string): Promise<boolean> {

        if (!this.emailTransporter) {
            console.warn(
                ` Email provider not configured. Mock sending to ${to}`
            );
            return false;
        }

        try {
            await this.emailTransporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                html
            });

            return true;
        } catch (error) {
            console.error('Failed to send Email:', error);
            return false;
        }
    }
}
