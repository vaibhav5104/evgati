const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000 // ✅ ADD: Limit comment length
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true // ✅ CHANGE: Make rating required
  },

  // ✅ ADD: Review categories
  categories: {
    cleanliness: { type: Number, min: 1, max: 5 },
    accessibility: { type: Number, min: 1, max: 5 },
    chargingSpeed: { type: Number, min: 1, max: 5 },
    amenities: { type: Number, min: 1, max: 5 }
  },

  // ✅ ADD: Helpful votes
  helpfulCount: { type: Number, default: 0 },
  notHelpfulCount: { type: Number, default: 0 },

  // Optional moderation flag (can be used later if needed)
  isApproved: { type: Boolean, default: true }

}, { timestamps: true });

// ✅ ADD: Indexes for analytics and performance
commentSchema.index({ stationId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ rating: -1 });
commentSchema.index({ isApproved: 1 });

// ✅ ADD: One review per user per station
commentSchema.index({ stationId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Comment", commentSchema);
