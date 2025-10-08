const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ["booking", "station", "system"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" }, // link to booking/station
  onModel: { type: String, enum: ["Booking", "Station"], default: "Station" },
  stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required : false},  
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["user", "admin", "owner"],
      default: "user"
    },
    stationRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Station" }
    ],
    ownedStations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Station" }
    ],
    notifications: [notificationSchema]
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// JWT
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
