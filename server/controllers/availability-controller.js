const Availability = require("../models/availability-model");
const Station = require("../models/station-model");
const History = require("../models/history-model"); // adjust path as needed
const mongoose = require("mongoose");

const bookPort = async (req, res) => {
  try {
    const { stationId, portId, startTime, endTime } = req.body;
    const userId = req.user._id;

    if (!stationId || !portId || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });

    // ensure port exists
    const portIndex = station.ports.findIndex(
      (p) => p.portNumber.toString() === portId.toString()
    );
    if (portIndex === -1) {
      return res.status(404).json({ message: "Port not found in station" });
    }

    let availability = await Availability.findOne({ stationId });
    if (!availability) {
      availability = new Availability({ stationId, bookings: [], occupiedPorts: [] });
    }

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= now) {
      return res.status(400).json({ message: "End time must be in the future" });
    }
    if (start < now) {
      return res.status(400).json({ message: "Start time must be in the future" });
    }

    // 🔹 Check for conflicts only on the SAME port
    const hasConflict = availability.bookings.some((booking) => {
      return (
        booking.portId.toString() === portId.toString() &&
        (
          (start >= booking.startTime && start < booking.endTime) || // start overlaps
          (end > booking.startTime && end <= booking.endTime) ||     // end overlaps
          (start <= booking.startTime && end >= booking.endTime)     // wraps around
        )
      );
    });

    if (hasConflict) {
      return res.status(400).json({
        message: `Port ${portId} is already booked for the selected time range`
      });
    }

    // 🔑 Create a single ObjectId for both Availability + Station
    const bookingId = new mongoose.Types.ObjectId();

    const bookingRequest = {
      _id: bookingId,  // force same id
      portId,
      startTime: start,
      endTime: end,
      userId,
      status: "pending"
    };

    availability.bookings.push(bookingRequest);
    station.ports[portIndex].bookings.push(bookingRequest);

    await availability.save();
    await station.save();

    res.json({ message: "Booking request sent to station owner", bookingRequest });
  } catch (error) {
    res.status(500).json({ message: "Error requesting booking", error: error.message });
  }
};

// Approve booking request
const approveBookingRequest = async (req, res) => {
  try {
    const { stationId, bookingId } = req.params;
    const { ownerMessage } = req.body;

    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });

    if (station.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only station owner or admin can approve" });
    }

    const availability = await Availability.findOne({ stationId });
    if (!availability) return res.status(404).json({ message: "Availability not found" });

    // find booking in Availability
    const booking = availability.bookings.id(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if(booking.status === "accepted" ) return res.status(409).json({ message: "This booking has been already accepted" });
    if(booking.status === "rejected") return res.status(409).json({ message: "This booking has been already rejected" });
    // ✅ Approve booking
    booking.status = "accepted";
    booking.ownerMessage = ownerMessage || "";

    // directly update the port in station
    const port = station.ports.find(p => p.portNumber === booking.portId);
    if (port) {
      const portBooking = port.bookings.id(bookingId);
      if (portBooking) {
        portBooking.status = "accepted";
        portBooking.ownerMessage = booking.ownerMessage;
      }
    }

    await availability.save();
    await station.save();

    res.json({ message: "Booking approved", booking });
  } catch (error) {
    res.status(500).json({ message: "Error approving booking", error: error.message });
  }
};

// Reject booking request
const rejectBookingRequest = async (req, res) => {
  try {
    const { stationId, bookingId } = req.params;
    const { ownerMessage } = req.body;

    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });

    if (station.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only station owner or admin can reject" });
    }

    const availability = await Availability.findOne({ stationId });
    if (!availability) return res.status(404).json({ message: "Availability not found" });

    // find booking in Availability
    const booking = availability.bookings.id(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if(booking.status === "accepted" || booking.status === "rejected") return res.status(400).json({ message: "Only Pending bookings can be approved" });

    // ❌ Reject booking
    booking.status = "rejected";
    booking.ownerMessage = ownerMessage || "Booking rejected by owner";

    // directly update the port in station
    const port = station.ports.find(p => p.portNumber === booking.portId);
    if (port) {
      const portBooking = port.bookings.id(bookingId);
      if (portBooking) {
        portBooking.status = "rejected";
        portBooking.ownerMessage = booking.ownerMessage;
      }
    }

    await availability.save();
    await station.save();

    res.json({ message: "Booking rejected", booking });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting booking", error: error.message });
  }
};

// Owner/Admin: Get pending booking requests for a station
const getPendingRequests = async (req, res) => {
  try {
    const { stationId } = req.params;

    // 1️⃣ Verify station
    const station = await Station.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // 2️⃣ Ensure only owner or admin can access
    if (
      station.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Access denied: only station owner or admin can view requests" });
    }

    // 3️⃣ Fetch availability
    const availability = await Availability.findOne({ stationId }).populate(
      "bookings.userId",
      "name email"
    );

    if (!availability) {
      return res.status(404).json({ message: "No availability info found" });
    }

    // 4️⃣ Filter pending requests
    const pendingRequests = availability.bookings.filter(
      (b) => b.status === "pending"
    );

    res.json({
      station: station._id,
      pendingRequests,
      count: pendingRequests.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending requests", error: error.message });
  }
};

// Get live availability with only accepted bookings
const getAvailability = async (req, res) => {
  try {
    const { stationId } = req.params;
    const now = new Date();

    const station = await Station.findById(stationId);
    const availability = await Availability.findOne({ stationId }).populate(
      "stationId",
      "name location totalPorts"
    );

    if (!availability || !station) {
      return res.status(404).json({ message: "Station or availability not found" });
    }

    // 1️⃣ Collect expired bookings (before deleting them)
    const expiredBookings = availability.bookings.filter(
      (b) => new Date(b.endTime) <= now
    );
    console.log(expiredBookings)

    // Archive expired bookings into History
    if (expiredBookings.length > 0) {
      const historyDocs = expiredBookings.map((b) => ({
        stationId: station._id,
        ownerId: station.owner,   // ✅ fixed
        userId: b.userId,
        portId: b.portId,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status          // ✅ keep original status (pending, accepted, rejected, etc.)
      }));

      await History.insertMany(historyDocs);
    }

    // 2️⃣ Remove expired bookings from availability
    availability.bookings = availability.bookings.filter(
      (b) => new Date(b.endTime) > now
    );

    // 3️⃣ Remove expired bookings from station ports
    station.ports.forEach((port) => {
      port.bookings = port.bookings.filter((b) => new Date(b.endTime) > now);
    });

    // 4️⃣ Only consider accepted bookings that are still active
    const activeBookings = availability.bookings.filter(
      (b) => b.status === "accepted" && now >= b.startTime && now <= b.endTime
    );

    // 5️⃣ Update occupiedPorts and status
    availability.occupiedPorts = activeBookings.map((b) => b.portId.toString());
    availability.is_available = activeBookings.length < availability.stationId.totalPorts;
    availability.last_updated = now;

    await availability.save();
    await station.save();

    res.json({
      station: availability.stationId,
      is_available: availability.is_available,
      occupiedPorts: availability.occupiedPorts,
      activeBookings,
      last_updated: availability.last_updated
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching availability", error: error.message });
  }
};

const getUserRequests = async (req, res) => {
  try {
    // console.log(req);
    const userId = (req.user && (req.user._id || req.userID || req.user.userId)) || null;

    // Find all availabilities where this user has bookings
    const availabilities = await Availability.find({ "bookings.userId": userId })
      .populate("stationId", "name location")
      .populate("bookings.userId", "name email");

    let requests = [];

    availabilities.forEach(av => {
      av.bookings.forEach(b => {
        if (String(b.userId?._id || b.userId) === String(userId)) {
          requests.push({
            station: av.stationId,
            portId: b.portId,
            startTime: b.startTime,
            endTime: b.endTime,
            status: b.status,
            ownerMessage: b.ownerMessage || ""
          });
        }
      });
    });

    res.json({
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user requests", error: error.message });
  }
};

// Clear past bookings (cron job or manual call)
const clearExpiredBookings = async (req, res) => {
    try {
        const { stationId } = req.params;
        const station = await Station.findById(stationId);
        let availability = await Availability.findOne({ stationId });

        if (!availability) {
            return res.status(404).json({ message: "No availability info found" });
        }

        const now = new Date();
        availability.bookings = availability.bookings.filter(b => b.endTime > now);

        availability.occupiedPorts = availability.bookings
            .filter(b => now >= b.startTime && now <= b.endTime)
            .map(b => b.portId);

        availability.is_available = availability.occupiedPorts.length === 0;
        availability.last_updated = now;

        station.ports.forEach(port => {
          port.bookings = port.bookings.filter(b => b.endTime > now);
        });

        await availability.save();

        res.json({ message: "Expired bookings cleared", availability });
    } catch (error) {
        res.status(500).json({ message: "Error clearing expired bookings", error: error.message });
    }
};

module.exports = { bookPort, getAvailability, clearExpiredBookings, approveBookingRequest, rejectBookingRequest, getPendingRequests, getUserRequests };