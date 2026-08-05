
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
          email: "no-reply@app.twofit.in",
          name: "TwoFit Team",
        },
        domain: "app.twofit.in",
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
          email: "no-reply@app.twofit.in",
          name: "TwoFit Team",
        },
        domain: "app.twofit.in",
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