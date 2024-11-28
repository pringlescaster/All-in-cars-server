// Middleware to verify JWT token passed in the Authorization header
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  // Ensure this matches the userId from your token payload
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};
