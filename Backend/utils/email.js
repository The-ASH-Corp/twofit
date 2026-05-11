// import nodemailer from "nodemailer";

// let transporter;
// let initialized = false;

// function initMailer() {
//   if (initialized) return;

//   const user = process.env.EMAIL_USER;
//   const pass = process.env.EMAIL_PASS;

//   if (!user) {
//     throw new Error("EMAIL_USER missing");
//   }

//   if (!pass) {
//     throw new Error("EMAIL_PASS missing");
//   }

//   transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // STARTTLS — required for port 587; port 465 (SSL) is blocked on most cloud servers
//     auth: {
//       user,
//       pass,
//     },
//   });

//   initialized = true;
// }

// export async function sendEmail({ to, subject, html }) {
//   initMailer();

//   return transporter.sendMail({
//     from: `TwoFit App <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// }

import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

export async function sendEmail({ email, password, fullName
  
}) {
  try {

    const response = await axios.post(
      "https://control.msg91.com/api/v5/email/send",
      {
        recipients: [
          {
            to: [{ email, fullName }],
            variables: {
              VAR1: fullName,
              VAR2: email,
              VAR3: password,
            },
          },
        ],
        from: {
          email: "noreply@twofit.co",
          name: "TwoFit Team",
        },
        domain: "twofit.co",
        template_id: "template_13_04_2026_23_04_3",
      },
      {
        headers: {
          authkey: process.env.MSG91_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log("FULL ERROR:", error.response?.data);
  }
}
 



export async function sendOTPEmail({ fullName, otp,email }) {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/email/send",
      {
        recipients: [
          {
            to: [{ email, fullName }],
            variables: {
              VAR1: fullName,
              VAR2: otp,
            },
          },
        ],
        from: {
          email: "noreply@twofit.co",
          name: "TwoFit Team",
        },
        domain: "twofit.co",
        template_id: "template_14_04_2026_15_04_3",
      },
      {
        headers: {
          authkey: process.env.MSG91_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("FULL ERROR:", error.response?.data);
  }
}