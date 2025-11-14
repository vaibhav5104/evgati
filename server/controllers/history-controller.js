const History = require("../models/history-model");

// ADMIN: get all history
const getAllHistory = async (req, res) => {
  try {
    const history = await History.find()
      .populate("stationId", "name location")
      .populate("ownerId", "name email")
      .populate("userId", "name email")
      .sort({ endTime: -1 });

    res.json({ count: history.length, history });
  } catch (error) {
    console.error("Error fetching all history:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

// OWNER: get history for owned stations
const getOwnerHistory = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const history = await History.find({ ownerId })
      .populate("stationId", "name location")
      .populate("userId", "name email")
      .sort({ endTime: -1 });

    res.json({ count: history.length, history });
  } catch (error) {
    console.error("Error fetching owner history:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

// USER: get their own booking history
const getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await History.find({ userId })
      .populate("stationId", "name location")
      .populate("ownerId", "name email")
      .sort({ endTime: -1 });

    res.json({ count: history.length, history });
  } catch (error) {
    console.error("Error fetching user history:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

module.exports = { getAllHistory, getOwnerHistory, getUserHistory };
