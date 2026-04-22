import { transporter } from "../config/mail.js";

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"AgriChain" <${process.env.EMAIL}>`,
      to,
      subject,
      text
    });

    console.log("Email sent");
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

export default sendEmail;