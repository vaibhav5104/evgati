const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  portId: { type: Number, required: true },
  startTime: Date,
  endTime: Date,
  status: { type: String, enum: ["pending", "accepted", "rejected", "completed", "cancelled"], default: "pending" },

  // ✅ Charging details
  kWhConsumed: { type: Number },
  totalCost: { type: Number },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded", "failed"],
    default: "pending"
  },

  // ✅ Duration calculation
  durationMinutes: { type: Number },

  // ✅ User feedback after completion
  userRating: { type: Number, min: 1, max: 5 },
  userFeedback: { type: String },

  // ✅ Owner notes
  ownerNotes: { type: String }

}, { timestamps: true });

// ✅ Indexes for analytics
historySchema.index({ stationId: 1, createdAt: -1 });
historySchema.index({ userId: 1, createdAt: -1 });
historySchema.index({ ownerId: 1, createdAt: -1 });
historySchema.index({ status: 1 });
historySchema.index({ endTime: -1 });

module.exports = mongoose.model("History", historySchema);
