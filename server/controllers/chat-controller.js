const ChatMessage = require("../models/chatmessage-model");

// Save a chat message
const saveMessage = async (data) => {
    try {
        const message = new ChatMessage(data);
        await message.save();
        return await message.populate("sender_id", "name email");
    } catch (error) {
        console.error("Error saving chat message:", error.message);
        throw error;
    }
};

// Fetch chat history for a station
const getChatHistory = async (req, res) => {
    try {
        const { stationId } = req.params;
        const messages = await ChatMessage.find({ stationId })
            .populate("sender_id", "name email")
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chat history", error: error.message });
    }
};

module.exports = { saveMessage, getChatHistory };
