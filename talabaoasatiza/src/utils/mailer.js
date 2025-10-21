import "dotenv/config";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
export async function sendMail(to, subject, html) {
    const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html
    });
    return info;
}
//# sourceMappingURL=mailer.js.map