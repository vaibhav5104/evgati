const mongoose = require("mongoose");

// each booking is tied to a port and has a time window
const bookingSchema = new mongoose.Schema({
  portId: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "active", "completed", "cancelled"],
    default: "pending"
  },
  ownerMessage: { type: String, required: false },

  // ✅ New Fields
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String } // Optional reason text
}, { timestamps: true });

const availabilitySchema = new mongoose.Schema({
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true
  },
  bookings: [bookingSchema],

  occupiedPorts: {
    type: [Number],
    default: []
  },
  is_available: {
    type: Boolean,
    default: true
  },
  last_updated: {
    type: Date,
    default: Date.now
  },

  // ✅ Added fields for live capacity
  currentAvailable: { type: Number, default: 0 },
  currentOccupied: { type: Number, default: 0 }

}, { timestamps: true });

// ✅ Indexes for better query performance
availabilitySchema.index({ stationId: 1 });
availabilitySchema.index({ "bookings.userId": 1 });
availabilitySchema.index({ "bookings.status": 1 });
availabilitySchema.index({ "bookings.startTime": 1, "bookings.endTime": 1 });

module.exports = mongoose.model("Availability", availabilitySchema);
