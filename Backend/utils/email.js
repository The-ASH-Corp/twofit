import nodemailer from "nodemailer";




console.log("ENV HOST:", process.env.BREVO_SMTP_HOST);
console.log("ENV PORT:", process.env.BREVO_SMTP_PORT);
console.log("ENV USER:", process.env.BREVO_SMTP_USER);
console.log("ENV KEY:", process.env.BREVO_SMTP_KEY ? "Loaded" : "Missing");

export const mailer = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,   // smtp-relay.brevo.com
  port: Number(process.env.BREVO_SMTP_PORT), // 587
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,  // Your Brevo email
    pass: process.env.BREVO_SMTP_KEY,   // Brevo SMTP Key
  },
   tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await mailer.sendMail({
      from: process.env.BREVO_SMTP_USER,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    throw new Error("Email sending failed");
  }
};
