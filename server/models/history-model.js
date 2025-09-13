const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  portId: { type: Number, required: true },
  startTime: Date,
  endTime: Date,
  status: { type: String, enum: ["pending", "accepted", "rejected" ] }
}, { timestamps: true });

module.exports = mongoose.model("History", historySchema);