const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const URI = process.env.URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connection successful to DB");
    } catch (e) {
        console.error("Database connection failed:", e);
        process.exit(1);
    }
};

module.exports = connectDB;
