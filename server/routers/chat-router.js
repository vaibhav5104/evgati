const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat-controller");

// GET chat history for a station
router.get("/history/:stationId", chatController.getChatHistory);

module.exports = router;