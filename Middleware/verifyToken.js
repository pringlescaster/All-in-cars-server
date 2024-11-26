import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret key
    req.userId = decoded.userId; // Store user ID from the token for further use
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
  }
};
