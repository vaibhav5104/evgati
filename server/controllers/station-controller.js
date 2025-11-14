const Station = require("../models/station-model");
const User = require("../models/user-model");
const Availability = require("../models/availability-model");
const availabilityController = require("../controllers/availability-controller")
const {addNotification} = require("../controllers/notification-controller");

// Create a new station (goes to pending)
const createStation = async (req, res) => {
  try {
    // ✅ Extract authenticated user ID safely
    const userId = (req.user && (req.user._id || req.userID || req.user.userId)) || null;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // ✅ Get owner details to auto-fill contact info
    const owner = await User.findById(userId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // ✅ Validate location
    const { latitude, longitude, address } = req.body.location || {};
    if (!latitude || !longitude || !address) {
      return res.status(400).json({ message: "Location details are incomplete" });
    }

    // ✅ Prevent duplicate stations at same coordinates
    const existing = await Station.findOne({
      "location.latitude": latitude,
      "location.longitude": longitude,
    });

    if (existing) {
      return res.status(400).json({ message: "Station already exists at this location" });
    }

    // ✅ Auto-generate port array
    const totalPorts = req.body.totalPorts || 1;
    const ports = Array.from({ length: totalPorts }, (_, i) => ({
      portNumber: i + 1,
      bookings: [],
    }));

    // ✅ Create new station document
    const station = new Station({
      ...req.body,
      owner: userId,
      status: "pending",
      contact: {
        phone: owner.phone || "",
        email: owner.email || "",
      },
      ports,
    });

    await station.save();

    // ✅ Initialize station availability
    await Availability.create({
      stationId: station._id,
      bookings: [],
      occupiedPorts: [],
      is_available: true,
    });

    // ✅ Add request reference to user's profile
    await User.findByIdAndUpdate(userId, {
      $addToSet: { stationRequests: station._id }, // avoids duplicates
    });

    // ✅ Notify admin of new pending station (optional, if you use notifications)
    const admin = await User.findOne({ role: "admin" });
    if (admin && typeof addNotification === "function") {
      await addNotification(
        admin._id,
        "station",
        "New Station Request",
        `${owner.name || "A user"} submitted a new station "${station.name}" for approval.`,
        station._id,
        "Station"
      );
    }

    res.status(201).json({
      message: "Station submitted for review successfully.",
      station,
    });
  } catch (error) {
    console.error("Error Creating Stations:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
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
    console.error("Error getting stations:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

// Get a single station by ID
const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (error) {
    console.error("Error getting stations by id:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
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
    console.error("Error getting pending stations:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

const updateStation = async (req, res) => {
  try {
    const { id } = req.params;

    // Destructure possible fields from body
    const {
      name,
      location,
      totalPorts,
      description,
      city,
      state,
      pincode,
      pricing,
      chargerTypes,
      amenities,
      operatingHours,
      images,
    } = req.body;

    // 🔍 Find the station
    const station = await Station.findById(id);
    if (!station) return res.status(404).json({ message: "Station not found" });

    // 🔒 (Optional) Check if user owns this station or is admin
    if (
      req.user.role !== "admin" &&
      station.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Update allowed simple fields
    if (name) station.name = name;
    if (description) station.description = description;
    if (city) station.city = city;
    if (state) station.state = state;
    if (pincode) station.pincode = pincode;

    // ✅ Update location if provided
    if (location) {
      if (typeof location.latitude === "number")
        station.location.latitude = location.latitude;
      if (typeof location.longitude === "number")
        station.location.longitude = location.longitude;
      if (location.address) station.location.address = location.address;
    }

    // ✅ Update pricing if provided
    if (pricing) {
      if (typeof pricing.perHour === "number")
        station.pricing.perHour = pricing.perHour;
      if (typeof pricing.perKWh === "number")
        station.pricing.perKWh = pricing.perKWh;
    }

    // ✅ Update charger types and amenities if valid
    const validChargerTypes = ["Type1", "Type2", "CCS", "CHAdeMO", "AC", "DC"];
    const validAmenities = [
      "wifi",
      "restroom",
      "cafe",
      "parking",
      "wheelchair_accessible",
      "24x7",
      "etc",
    ];

    if (Array.isArray(chargerTypes)) {
      station.chargerTypes = chargerTypes.filter((t) =>
        validChargerTypes.includes(t)
      );
    }

    if (Array.isArray(amenities)) {
      station.amenities = amenities.filter((a) =>
        validAmenities.includes(a)
      );
    }

    // ✅ Update operating hours
    if (operatingHours) {
      if (typeof operatingHours.open === "string")
        station.operatingHours.open = operatingHours.open;
      if (typeof operatingHours.close === "string")
        station.operatingHours.close = operatingHours.close;
      if (typeof operatingHours.is24x7 === "boolean")
        station.operatingHours.is24x7 = operatingHours.is24x7;
    }

    // ✅ Update images if provided
    if (Array.isArray(images)) {
      station.images = images;
    }

    // ✅ Handle totalPorts expansion (not reduction)
    if (typeof totalPorts === "number") {
      if (totalPorts < station.totalPorts) {
        return res.status(400).json({
          message: "Reducing totalPorts is not allowed",
        });
      }
      if (totalPorts > station.totalPorts) {
        const portsToAdd = totalPorts - station.totalPorts;
        const currentMax = station.ports.length;

        for (let i = 1; i <= portsToAdd; i++) {
          station.ports.push({
            portNumber: currentMax + i,
            bookings: [],
          });
        }

        station.totalPorts = totalPorts;
      }
    }

    // ✅ Save changes
    await station.save();

    res.json({
      message: "Station updated successfully",
      station,
    });
  } catch (error) {
    console.error("Error updating station:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
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
    console.error("Error deleting stations:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
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
    res.status(500).json({ message: "Something went wrong. Please try again later." });
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
