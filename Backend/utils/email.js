import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export const sendEmail = async ({ to, subject, html }) => {
  try {
    await sgMail.send({
      from: `TwoFit App <${process.env.SENDGRID_FROM_EMAIL}>`,
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
