const express = require("express");
const router = express.Router();
const { getPendingStations, approveStation, rejectStation } = require("../controllers/admin-controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth-middleware");

// Admin-only routes
router.get("/stations/pending", authMiddleware, isAdmin, getPendingStations);
router.post("/stations/:id/approve", authMiddleware, isAdmin, approveStation);
router.post("/stations/:id/reject", authMiddleware, isAdmin, rejectStation);

module.exports = router;