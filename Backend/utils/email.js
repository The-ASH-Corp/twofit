
import nodemailer from "nodemailer";

let transporter;
let initialized = false;

function initMailer() {
  if (initialized) return;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user) {
    throw new Error("EMAIL_USER missing");
  }

  if (!pass) {
    throw new Error("EMAIL_PASS missing");
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS — required for port 587; port 465 (SSL) is blocked on most cloud servers
    auth: {
      user,
      pass,
    },
  });

  initialized = true;
}

export async function sendEmail({ to, subject, html }) {
  initMailer();

  return transporter.sendMail({
    from: `TwoFit App <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}