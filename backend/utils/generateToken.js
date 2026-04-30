import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET missing in .env");
  }

  return jwt.sign({ id }, secret, {
    expiresIn: "7d",
  });
};
