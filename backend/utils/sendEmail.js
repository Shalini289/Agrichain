import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const user = process.env.EMAIL_USER || process.env.EMAIL;
  const pass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error("Email credentials are not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject,
    text,
  });
};
