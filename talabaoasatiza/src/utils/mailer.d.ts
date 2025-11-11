import "dotenv/config";
import nodemailer from "nodemailer";
export declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options>;
export declare function sendMail(to: string, subject: string, html: string, text?: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
/** public: send verification email for sign-up */
export declare function sendVerificationEmail(email: string, verificationToken: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
/** public: send verification email used for password recovery or second flow */
export declare function sendVerificationEmailTwo(email: string, verificationToken: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
export declare function sendWelcomeEmail(email: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
export declare function sendAdminNotificationEmail(adminEmail: string, userEmail: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
export declare function sendApprovalEmail(email: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
//# sourceMappingURL=mailer.d.ts.map