// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  console.log('authMiddleware - cookies:', req.cookies);
  try {
    const token = req.cookies?.token;
    if (!token) {
      console.log('authMiddleware - no token');
      return res.status(401).json({ error: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    console.log('authMiddleware - token verify error', err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
