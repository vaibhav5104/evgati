// controllers/notification-controller.js
const User = require("../models/user-model");

// Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("notifications");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ notifications: user.notifications });
  } catch (error) {
    console.log("Error : ",error.message)
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user = await User.findById(req.userID);

    if (!user) return res.status(404).json({ message: "User not found" });

    const notification = user.notifications.id(notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.isRead = true;
    await user.save();
    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.log("Error : ",error.message)
    res.status(500).json({ message: "Error marking as read"});
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.userID },
      { $set: { "notifications.$[].isRead": true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.log("Error : ",error.message)
    res.status(500).json({ message: "Error updating notifications"});
  }
};

// Add new notification (for internal use when events happen)
exports.addNotification = async (userId, type, title, message, relatedId, onModel, stationId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          notifications: {
            type,
            title,
            message,
            relatedId,
            onModel,
            stationId
          },
        },
      },
      { new: true }
    );
  } catch (error) {
    console.log("Error adding notification:", error);
  }
};

// controllers/notification-controller.js
exports.createNotification = async (req, res) => {
    try {
      const { userId, type, title, message, relatedId, onModel } = req.body;
  
      if (!userId || !type || !title || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const notification = {
        type,
        title,
        message,
        relatedId,
        onModel,
        createdAt: new Date()
      };
  
      user.notifications.push(notification);
      await user.save();
  
      res.status(201).json({
        message: "Notification created successfully",
        notification
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Server error" });
    }
  };