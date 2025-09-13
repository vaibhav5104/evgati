const express = require("express");
const { getAllHistory, getOwnerHistory, getUserHistory } = require("../controllers/history-controller");
const { authMiddleware, isAdmin, isOwner } = require("../middlewares/auth-middleware");

const router = express.Router();

// ADMIN: all history
router.get("/admin", authMiddleware, isAdmin, getAllHistory);

// OWNER: history of their stations
router.get("/owner", authMiddleware, isOwner, getOwnerHistory);

// USER: their personal booking history
router.get("/user", authMiddleware, getUserHistory);

module.exports = router;
