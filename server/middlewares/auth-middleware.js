const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const Station = require("../models/station-model")
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    const jwtToken = authHeader.replace("Bearer ", "").trim();

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    const userData = await User.findById(decoded.userId).select("-password");
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach useful info
    req.user = userData;
    req.token = jwtToken;
    req.userID = userData._id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

const ensureOwnerOrAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // admin bypass
    if (user.role === "admin") return next();

    const stationId = req.params.id || req.body.stationId;
    if (!stationId) return res.status(400).json({ message: "Station id required" });

    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });

    if (station.owner && station.owner.toString() === user._id.toString()) {
      return next();
    }

    return res.status(403).json({ message: "Owner access required" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Role checkers
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

const isOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access required" });
  }
  next();
};

module.exports = { authMiddleware, isAdmin, isOwner, ensureOwnerOrAdmin };
