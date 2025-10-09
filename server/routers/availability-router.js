const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/availability-controller");
const validate = require("../middlewares/validate");
const { bookPortSchema } = require("../validators/availability-validator");
const { authMiddleware } = require("../middlewares/auth-middleware");

// Book a charging port (creates pending request)
router.post(
  "/book",
  validate(bookPortSchema),
  authMiddleware,
  availabilityController.bookPort
);

// Approve booking
router.patch(
  "/:stationId/approve/:bookingId",
  authMiddleware,
  availabilityController.approveBookingRequest
);

// Reject booking
router.patch(
  "/:stationId/reject/:bookingId",
  authMiddleware,
  availabilityController.rejectBookingRequest
);

// User: get all their booking requests
router.get(
  "/myrequests",
  authMiddleware,
  availabilityController.getUserRequests
);

// Get live availability
router.get("/:stationId", availabilityController.getAvailability);

// Owner/Admin: get pending requests for a station
router.get(
  "/:stationId/requests",
  authMiddleware,
  availabilityController.getPendingRequests
);

router.get("/:stationId/bookings/:bookingId/status", authMiddleware, availabilityController.isPending);

router.post("/clear-notifications", authMiddleware,availabilityController.clearUserNotifications);


router.post('/:stationId/clear-notifications', authMiddleware, availabilityController.clearStationNotifications);

// Clear expired bookings
router.delete("/:stationId/clear", availabilityController.clearExpiredBookings);

router.delete("/cron/clear-expired", availabilityController.clearExpiredBookingsForAllStations);

module.exports = router;