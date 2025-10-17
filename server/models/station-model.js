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
    description: {type : String},
    city: { type: String }, // For filtering
    state: { type: String }, // For filtering
    pincode: { type: String }, // For verification
    
    pricing: {// Pricing structure, which can be modified in real time.
      perHour: { type: Number, default: 0 },
      perKWh: { type: Number, default: 0 },
    },
    chargerTypes: [{
      type: String,
      enum: ["Type1", "Type2", "CCS", "CHAdeMO", "AC", "DC","Bharat DC-001",]
    }],
    amenities: [{//can be used as tags
      type: String,
      enum: ["wifi", "restroom", "cafe", "parking", "24x7"],
      default : ["parking"]
    }],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    contact: {//Contact info (can also be referenced from phone and email of owner )
      phone: { type: String },
      email: { type: String }
    },
    operatingHours: {// Operating hours
      open: { type: String, default: "00:00" },
      close: { type: String, default: "23:59" },
      is24x7: { type: Boolean, default: false }
    },
    images: [{ type: String }],// Media(it is mendatory since customer wants to see the station)
    stats: {// Stats(need to think about it)
      totalBookings: { type: Number, default: 0 },
      completedBookings: { type: Number, default: 0 },
      cancelledBookings: { type: Number, default: 0 }
    },

    status: {// NEW FIELDS
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

stationSchema.index({ city: 1, state: 1 });
stationSchema.index({ status: 1 });
stationSchema.index({ owner: 1 });
stationSchema.index(
  { "location.latitude": 1, "location.longitude": 1 },
  { unique: true }
);

module.exports = mongoose.model("Station", stationSchema);