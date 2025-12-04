const jwt = require("jsonwebtoken");
const User = require("../models/UserModal");

// NOTE: In a real app, use a configuration file (like a .env)
// to load the JWT_SECRET securely.

// Middleware to protect routes (check for and verify JWT)
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token exists in the Authorization header
  // Standard format is: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (removes "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user from the decoded ID and attach it to the request object
      // We exclude the password field for security
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user exists (important if the user was deleted after the token was issued)
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user no longer exists" });
      }

      // Proceed to the next middleware or the controller function
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // If no token is provided at all
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

// Middleware to check user role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user exists (protect middleware should have run first)
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized, user not found" });
    }
    console.log("User Role:", req.user);
    // Check if user's role is in the allowed roles
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({
        error: `Access denied`,
      });
    }
  };
};

module.exports = { protect, authorize };
