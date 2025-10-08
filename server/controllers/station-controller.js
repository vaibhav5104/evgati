const Station = require("../models/station-model");
const User = require("../models/user-model");
const Availability = require("../models/availability-model");
const availabilityController = require("../controllers/availability-controller")
const {addNotification} = require("../controllers/notification-controller");
// Create a new station (goes to pending)
const createStation = async (req, res) => {
  try {
    // robust user id extraction:
    const userId = (req.user && (req.user._id || req.userID || req.user.userId)) || null;
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const { latitude, longitude, address } = req.body.location;

    const existing = await Station.findOne({
      $or: [
        { "location.latitude": latitude, "location.longitude": longitude }
      ]
    });
    if (existing) {
      return res.status(400).json({ message: "Station already exists at this location" });
    }

    const station = new Station({ ...req.body, owner: userId, status: "pending" });
    await station.save();

    console.log(req.user);

    // create availability for this station
    await Availability.create({
      stationId: station._id,
      bookings: [],
      occupiedPorts: [],
      is_available: true
    });

    // Add request to user profile (ensure user model has stationRequests array)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { stationRequests: station._id } // addToSet prevents duplicates
    });

    // ✅ Notify admin about new pending station
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await addNotification(
        admin._id,
        "station",
        "New Station Request",
        `${req.user.name} submitted a new station "${station.name}" for approval.`,
        station._id,
        "Station"
      );
    }

    res.status(201).json({ message: "Station submitted for review", station });
  } catch (error) {
    res.status(500).json({ message: "Error creating station", error: error.message });
  }
};

// Get all stations (only accepted for normal users)
const getAllStations = async (req, res) => {
  try {
    let query = { status: "accepted" };

    // if request has user and user is admin, allow all
    if (req.user && req.user.role === "admin") {
      query = {};
    }

    const stations = await Station.find(query);

    res.json(stations);

  } catch (error) {
    res.status(500).json({ message: "Error fetching stations", error: error.message });
  }
};

// Get a single station by ID
const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: "Error fetching station", error: error.message });
  }
};

// Get all pending stations (only accepted for normal users)
const getAllPendingStations = async (req, res) => {
  try {
    let query = { status: "pending" };

    // if request has user and user is admin, allow all
    if (req.user && req.user.role === "admin") {
      query = {};
    }

    const stations = await Station.find(query);
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stations", error: error.message });
  }
};

// Update a station
const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { name, location, totalPorts } = req.body;

    const station = await Station.findById(id);
    if (!station) return res.status(404).json({ message: "Station not found" });

    // 🔹 Update only allowed fields
    if (name) station.name = name;
    if (location) {
      if (location.latitude) station.location.latitude = location.latitude;
      if (location.longitude) station.location.longitude = location.longitude;
      if (location.address) station.location.address = location.address;
    }

    // 🔹 Handle totalPorts update
    if (totalPorts !== undefined) {
      if (totalPorts < station.totalPorts) {
        return res.status(400).json({
          message: "Reducing totalPorts is not allowed"
        });
      }
      if (totalPorts > station.totalPorts) {
        const portsToAdd = totalPorts - station.totalPorts;
        const currentMax = station.ports.length;

        for (let i = 1; i <= portsToAdd; i++) {
          station.ports.push({
            portNumber: currentMax + i,
            bookings: []
          });
        }

        station.totalPorts = totalPorts;
      }
    }

    await station.save();

    res.json({ message: "Station updated successfully", station });
  } catch (error) {
    res.status(500).json({ message: "Error updating station", error: error.message });
  }
};

// Delete a station (only by owner or admin)
const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user._id; // from auth-middleware

    // ✅ First fetch the station
    const station = await Station.findById(id);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // ✅ Delete after checks
    await Station.findByIdAndDelete(id);

    // Update owner’s profile if not admin
    if (station.owner) {
      const owner = await User.findById(station.owner);
      if (owner) {
        // Remove station from ownedStations
        owner.ownedStations = owner.ownedStations.filter(
          (s) => s.toString() !== id
        );

        // If no more stations owned, downgrade role to "user"
        if (owner.ownedStations.length === 0 && owner.role === "owner") {
          owner.role = "user";
        }

        await owner.save();
      }
    }

    res.json({ message: "Station deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Find nearest station using coordinates
const findNearestStation = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const stations = await Station.find({ status: "accepted" });
    if (!stations.length) {
      return res.status(404).json({ message: "No stations found" });
    }

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km

    const nearest = stations.reduce(
      (prev, curr) => {
        const dLat = toRad(curr.location.latitude - latitude);
        const dLon = toRad(curr.location.longitude - longitude);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(latitude)) *
            Math.cos(toRad(curr.location.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return distance < prev.distance ? { station: curr, distance } : prev;
      },
      { station: null, distance: Infinity }
    );

    res.json({ nearestStation: nearest.station, distanceKm: nearest.distance });
  } catch (error) {
    res.status(500).json({ message: "Error finding nearest station", error: error.message });
  }
};

module.exports = {
  createStation,
  getAllStations,
  getStationById,
  getAllPendingStations,
  updateStation,
  deleteStation,
  findNearestStation
};
