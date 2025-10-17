const Comment = require("../models/comment-model");
const Station = require("../models/station-model");

// ✅ Add a comment to a station
const addComment = async (req, res) => {
  try {
    const { stationId, userId, text, rating, categories } = req.body;

    // Check if station exists
    const station = await Station.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // Prevent duplicate review
    const existing = await Comment.findOne({ stationId, userId });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this station" });
    }

    // Create and save comment
    const comment = new Comment({
      stationId,
      userId,
      text,
      rating,
      categories
    });

    await comment.save();
    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    // Handle duplicate key error from index constraint
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this station" });
    }
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// ✅ Get all comments for a specific station
const getStationComments = async (req, res) => {
  try {
    const { stationId } = req.params;
    const comments = await Comment.find({ stationId, isApproved: true })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: comments.length, comments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// ✅ Delete a comment
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

// ✅ Increment helpful / not helpful votes
const voteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body; // true = helpful, false = not helpful

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (helpful === true) comment.helpfulCount += 1;
    else comment.notHelpfulCount += 1;

    await comment.save();
    res.json({ message: "Vote recorded", helpfulCount: comment.helpfulCount, notHelpfulCount: comment.notHelpfulCount });
  } catch (error) {
    res.status(500).json({ message: "Error voting on comment", error: error.message });
  }
};

// ✅ Update an existing comment (only author can update)
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, rating, categories } = req.body;
    const userId = req.user._id; // assuming user is authenticated

    // Find the comment
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the comment owner can update it
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" });
    }

    // Apply updates with validation
    if (text !== undefined) {
      if (text.length > 1000)
        return res.status(400).json({ message: "Comment text exceeds 1000 characters" });
      comment.text = text;
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5)
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      comment.rating = rating;
    }

    if (categories) {
      const { cleanliness, accessibility, chargingSpeed, amenities } = categories;
      if (cleanliness) comment.categories.cleanliness = cleanliness;
      if (accessibility) comment.categories.accessibility = accessibility;
      if (chargingSpeed) comment.categories.chargingSpeed = chargingSpeed;
      if (amenities) comment.categories.amenities = amenities;
    }

    await comment.save();
    res.json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

module.exports = {
  addComment,
  getStationComments,
  deleteComment,
  voteComment,
};
