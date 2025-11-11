// ./src/utils/mailer.ts
import "dotenv/config";
import nodemailer from "nodemailer";
import { URL } from "url";

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

if (!MAIL_USER || !MAIL_PASS) {
  console.warn(
    "Warning: MAIL_USER or MAIL_PASS not set. Emails will fail until these environment variables are provided."
  );
}

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
  // tls fallback for some environments (optional)
  tls: {
    rejectUnauthorized: false,
  },
});


export async function sendMail(
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  if (!to) throw new Error("Recipient email is required");
  if (!MAIL_USER) throw new Error("MAIL_USER is not configured");

  const info = await transporter.sendMail({
    from: `${MAIL_FROM_NAME} <${MAIL_USER}>`,
    to,
    subject,
    text: text ?? stripHtml(html),
    html,
  });

  return info;
}

/** Simple helper to build a URL with query param "token" */
function buildVerificationUrl(route: string, token: string) {
  // Use FRONTEND_URL as base
  const base = new URL(FRONTEND_URL);
  const url = new URL(route, base);
  url.searchParams.append("token", token);
  return url.toString();
}

/** minimal html template for verification email */
function verificationHtmlTemplate(verificationUrl: string, messageTitle = "Verify your email") {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      <h2>${escapeHtml(messageTitle)}</h2>
      <p>Please click the button below to continue:</p>
      <p style="margin: 20px 0;">
        <a href="${verificationUrl}" style="display:inline-block;padding:10px 18px;border-radius:6px;text-decoration:none;border:1px solid #0b5ed7;">
          Verify Email
        </a>
      </p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <hr/>
      <small>If you didn't request this, ignore this message.</small>
    </div>
  `;
}

/** public: send verification email for sign-up */
export async function sendVerificationEmail(email: string, verificationToken: string) {
  if (!email) {
    console.error("No recipient email defined");
    return;
  }

  const verificationUrl = buildVerificationUrl("/verify-email", verificationToken);
  const subject = "Verify your Jamia-Tun-Noor account";
  const html = verificationHtmlTemplate(verificationUrl, "Activate your Jamia-Tun-Noor account");
  const text = `Activate your Jamia-Tun-Noor account by visiting: ${verificationUrl}`;

  try {
    const info = await sendMail(email, subject, html, text);
    console.log("Verification email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Failed to send verification email:", err);
    throw err;
  }
}

/** public: send verification email used for password recovery or second flow */
export async function sendVerificationEmailTwo(email: string, verificationToken: string) {
  if (!email) {
    console.error("No recipient email defined");
    return;
  }

  const verificationUrl = buildVerificationUrl("/verify-email-two", verificationToken);
  const subject = "Recover your Jamia-Tun-Noor password";
  const html = verificationHtmlTemplate(verificationUrl, "Recover your password");
  const text = `Recover your Jamia-Tun-Noor password by visiting: ${verificationUrl}`;

  try {
    const info = await sendMail(email, subject, html, text);
    console.log("Password recovery email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Failed to send password recovery email:", err);
    throw err;
  }
}

function stripHtml(html: string) {
  // very small fallback to create plain text from html
  return html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s{2,}/g, " ").trim();
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendWelcomeEmail(email: string) {
  if (!email) {
    console.error("No recipient email defined");
    return;
  }

  const subject = "Welcome to Jamia-Tun-Noor!";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      <h2>Welcome!</h2>
      <p>Your account has been approved by an administrator.</p>
      <p>You can now log in to your account.</p>
    </div>
  `;
  const text = `Your account has been approved. You can now log in.`;

  try {
    const info = await sendMail(email, subject, html, text);
    console.log("Welcome email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Failed to send welcome email:", err);
    throw err;
  }
}

export async function sendAdminNotificationEmail(adminEmail: string, userEmail: string) {
  if (!adminEmail) {
    console.error("No recipient email defined");
    return;
  }

  const subject = "New User Registration";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      <h2>New User Awaiting Approval</h2>
      <p>A new user with the email address ${userEmail} has registered and is waiting for admin approval.</p>
    </div>
  `;
  const text = `A new user with the email address ${userEmail} has registered and is waiting for admin approval.`;

  try {
    const info = await sendMail(adminEmail, subject, html, text);
    console.log("Admin notification email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Failed to send admin notification email:", err);
    throw err;
  }
}

export async function sendApprovalEmail(email: string) {
  if (!email) {
    console.error("No recipient email defined");
    return;
  }

  const subject = "Your Account has been Approved";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      <h2>Account Approved</h2>
      <p>Your account has been approved by an administrator. You can now log in.</p>
    </div>
  `;
  const text = `Your account has been approved. You can now log in.`;

  try {
    const info = await sendMail(email, subject, html, text);
    console.log("Approval email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Failed to send approval email:", err);
    throw err;
  }
}

/* Attempt to verify transporter at startup for better DX */
transporter.verify().then(
  () => console.log("Mail transporter is ready"),
  (err) => console.warn("Mail transporter verify failed (emails will error until configured).", err)
);
