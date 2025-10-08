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
  ownerMessage: { type: String ,required : false}
});


const availabilitySchema = new mongoose.Schema({
    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        required: true
    },
    bookings: [bookingSchema],

    occupiedPorts: {
        type: [Number], // match station.ports.portNumber
        default: []
    },
    is_available: {
        type: Boolean,
        default: true
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Availability", availabilitySchema);
