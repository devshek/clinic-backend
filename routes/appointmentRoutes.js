const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getAvailableSlots
} = require("../controllers/appointmentController");


const protect = require("../middleware/authMiddleware");

// Public
router.post("/", bookAppointment);

// Admin Only
router.get("/", protect, getAppointments);

// Admin Only
router.put("/:id/cancel", protect, cancelAppointment);

router.get("/available-slots", getAvailableSlots);


module.exports = router;
