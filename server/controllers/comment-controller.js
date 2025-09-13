const Comment = require("../models/comment-model");
const Station = require("../models/station-model");

// Add a comment to a station
const addComment = async (req, res) => {
    try {
        const { stationId, userId, text, rating } = req.body;

        const station = await Station.findById(stationId);
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        const comment = new Comment({ stationId, userId, text, rating });
        await comment.save();

        res.status(201).json({ message: "Comment added", comment });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

// Get comments for a station
const getStationComments = async (req, res) => {
    try {
        const { stationId } = req.params;
        const comments = await Comment.find({ stationId }).populate("userId", "name email");
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
};

module.exports = { addComment, getStationComments, deleteComment };
