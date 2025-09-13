const User = require("../models/user-model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vaibhavsharma5104@gmail.com",
        pass: "zjhi dvqe usfu lgbw", // move to env for security
    },
});

// Register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            message: "Registration successful",
            token: user.generateToken(),
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.json({
            message: "Login successful",
            token: user.generateToken(),
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get self
const user = async (req, res) => {
    try {
        const userData = await User.findById(req.userID).select("-password");
        if (!userData) return res.status(404).json({ message: "User not found" });
        res.json({ userData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update
const userById = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await User.findById(id, req.body).select("-password");
        if (!updated) return res.status(404).json({ message: "User not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all users (admin use-case)
const allUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Google Login
const googleLogin = async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                password: crypto.randomBytes(32).toString("hex"),
            });
        }

        res.json({
            message: "Google login successful",
            token: user.generateToken(),
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
        if (!updated) return res.status(404).json({ message: "User not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    user,
    userById,
    allUsers,
    updateUser,
    deleteUser,
    googleLogin,
};
