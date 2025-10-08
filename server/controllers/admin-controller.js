const Station = require("../models/station-model");
const User = require("../models/user-model");
const { addNotification } = require("./notification-controller");

// Get all pending stations
const getPendingStations = async (req, res) => {
  try {
    const pending = await Station.find({ status: "pending" }).populate("owner", "name email");
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending stations", error: error.message });
  }
};

// Approve a station
const approveStation = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await Station.findById(id);
    if (!station) return res.status(404).json({ message: "Station not found" });

    if (station.status !== "pending") {
      return res.status(400).json({ message: "Station is not pending approval" });
    }

    station.status = "accepted";
    await station.save();

    const user = await User.findById(station.owner);
    if (user) {
      user.stationRequests = user.stationRequests.filter(reqId => reqId.toString() !== id);
      if (!user.ownedStations.includes(id)) {
        user.ownedStations.push(id);
      }
      if (user.role !== "owner" && user.role !== "admin") {
        user.role = "owner";
      }
      await user.save();

      // ✅ Notify owner about approval
      await addNotification(
        user._id,
        "station",
        "Station Approved",
        `Your station "${station.name}" has been approved by the admin.`,
        station._id,
        "Station"
      );
    }

    res.json({ message: "Station approved", station });
  } catch (error) {
    res.status(500).json({ message: "Error approving station", error: error.message });
  }
};

// Reject a station
const rejectStation = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await Station.findById(id);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // 🚨 Only reject if station is still pending
    if (station.status !== "pending") {
      return res.status(400).json({ message: "Only pending stations can be rejected" });
    }

    const user = await User.findById(station.owner);

    // Remove from user's stationRequests
    if (user) {
      user.stationRequests = user.stationRequests.filter(
        (reqId) => reqId.toString() !== id
      );
      await user.save();

      // ✅ Notify owner about rejection
      await addNotification(
        user._id,
        "station",
        "Station Rejected",
        `Your station "${station.name}" was rejected by the admin.`,
        station._id,
        "Station"
      );
    }

    // Delete station
    await Station.findByIdAndDelete(id);

    res.json({ message: "Pending station rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting station", error: error.message });
  }
};

module.exports = { getPendingStations, approveStation, rejectStation };
