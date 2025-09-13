const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
        type: String,
        enum: ["user", "admin", "owner"],
        default: "user"
    },
    // bookingRequests: [
    //   {
    //     stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station" },
    //     portId: Number,
    //     startTime: Date,
    //     endTime: Date,
    //     status: {
    //       type: String,
    //       enum: ["pending", "accepted", "rejected"],
    //       default: "pending"
    //     },
    //     ownerMessage: { type: String } // message from owner if rejected
    //   }
    // ],
    stationRequests: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Station" }
    ],
    ownedStations: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Station" }
    ]
}, { timestamps: true });

// Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
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
