import nodemailer from "nodemailer";

const user = process.env.EMAIL_USER || process.env.EMAIL;
const pass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass
  }
});
