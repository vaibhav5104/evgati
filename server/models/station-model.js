const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: Date,
  endTime: Date,
  status: {
  type: String,
  enum: ["pending", "accepted", "rejected", "active", "completed", "cancelled"],
  default: "pending"
  },
  ownerMessage: { type: String }
});

const portSchema = new mongoose.Schema({
  portNumber: { type: Number, required: true },
  bookings: [bookingSchema]
});

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true }
    },
    totalPorts: { type: Number, required: true },
    ports: [portSchema],

    // NEW FIELDS
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

stationSchema.index(
  { "location.latitude": 1, "location.longitude": 1 },
  { unique: true }
);

// stationSchema.index(
//   { "location.address": 1 },
//   { unique: true }
// );

module.exports = mongoose.model("Station", stationSchema);
