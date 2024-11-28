import jwt from "jsonwebtoken";

// Generates a JWT token and returns it
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expiration time
  });

  return token;
};
