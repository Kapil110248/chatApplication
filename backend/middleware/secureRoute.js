import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const secureRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // ✅ Check token match with DB (for single-login enforcement)
    if (user.currentToken !== token) {
      return res.status(401).json({ error: "Logged in from another device. Please logout from other device." });
    }

    req.user = user; // pass user to next route
    next();
  } catch (error) {
    console.error("Error in secureRoute middleware:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }

    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default secureRoute;
