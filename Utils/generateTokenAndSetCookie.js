import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie('token', token, {
    httpOnly: true, // Make the cookie inaccessible to JavaScript
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Prevent the cookie from being sent with cross-site requests
    maxAge: 3600000,
  });
   
  return token;
};
