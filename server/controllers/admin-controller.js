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


// ✅ Approve a station
const approveStation = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await Station.findById(id);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    if (station.status !== "pending") {
      return res.status(400).json({ message: "Station is not pending approval" });
    }

    // ✅ Update station status
    station.status = "accepted";
    await station.save();

    // ✅ Find owner
    const user = await User.findById(station.owner);
    if (!user) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // ✅ Remove from pending requests
    user.stationRequests = user.stationRequests.filter(
      (reqId) => reqId.toString() !== id
    );

    // ✅ Add to owned stations (avoid duplicate ObjectId)
    const isAlreadyOwned = user.ownedStations.some(
      (ownedId) => ownedId.toString() === id
    );

    if (!isAlreadyOwned) {
      user.ownedStations.push(station._id);
    }

    // ✅ Update user role if necessary
    if (user.role === "user") {
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

    res.json({ message: "Station approved successfully", station });
  } catch (error) {
    console.error("Error approving station:", error);
    res.status(500).json({ message: "Error approving station", error: error.message });
  }
};

// ❌ Reject a station
const rejectStation = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await Station.findById(id);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    if (station.status !== "pending") {
      return res.status(400).json({ message: "Only pending stations can be rejected" });
    }

    const user = await User.findById(station.owner);
    if (user) {
      // ✅ Remove from station requests
      user.stationRequests = user.stationRequests.filter(
        (reqId) => reqId.toString() !== id
      );

      // ✅ Ensure it's not in ownedStations (cleanup if it somehow exists)
      user.ownedStations = user.ownedStations.filter(
        (ownedId) => ownedId.toString() !== id
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

    // ✅ Delete the rejected station
    await Station.findByIdAndDelete(id);

    res.json({ message: "Pending station rejected and removed" });
  } catch (error) {
    console.error("Error rejecting station:", error);
    res.status(500).json({ message: "Error rejecting station", error: error.message });
  }
};

module.exports = { getPendingStations, approveStation, rejectStation };
