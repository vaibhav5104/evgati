const express = require("express");
const router = express.Router();
const stationController = require("../controllers/station-controller");
const validate = require("../middlewares/validate");
const { createStationSchema } = require("../validators/station-validator");
const { authMiddleware } = require("../middlewares/auth-middleware");
const { ensureOwnerOrAdmin } = require("../middlewares/auth-middleware");

// Create (authenticated user submits a request)
router.post("/", authMiddleware, validate(createStationSchema), stationController.createStation);

// Public read (only accepted shown)
router.get("/", stationController.getAllStations);
router.get("/nearest/search", stationController.findNearestStation);
router.get("/:id", stationController.getStationById);

// Update/Delete by owner or admin
router.put("/:id", authMiddleware, ensureOwnerOrAdmin, stationController.updateStation);
router.delete("/:id", authMiddleware, ensureOwnerOrAdmin, stationController.deleteStation);

module.exports = router;