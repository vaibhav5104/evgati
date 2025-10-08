const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
} = require("../controllers/notification-controller");
// const authMiddleware = require("../middlewares/auth-middleware");
const {authMiddleware} = require("../middlewares/auth-middleware");

// Get all user notifications
router.get("/",authMiddleware, getNotifications);

// Mark single notification as read
router.put("/:notificationId/read", authMiddleware, markAsRead);

// Mark all as read
router.put("/read/all", authMiddleware, markAllAsRead);

// ✅ Create new notification (POST)
router.post("/", createNotification);

module.exports = router;
