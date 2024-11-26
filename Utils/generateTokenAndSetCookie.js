import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' }); // 7 days expiration
  res.cookie('token', token, {
    httpOnly: true, // Prevent JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie will expire in 7 days
    sameSite: 'strict', // Protects against CSRF attacks
  });
};
