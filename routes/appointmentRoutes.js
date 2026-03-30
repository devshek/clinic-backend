const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  bookAppointment,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

const protect = require("../middleware/authMiddleware");

// Public - Book appointment
router.post(
  "/",
  [
    body("patientName").notEmpty().withMessage("Name is required"),
    body("age")
      .notEmpty().withMessage("Age is required")
      .isNumeric().withMessage("Age must be a number"),
    body("phone")
      .notEmpty().withMessage("Phone number is required")
      .isNumeric().withMessage("Phone number must be numeric"),
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Enter valid email"),
    body("date").notEmpty().withMessage("Date is required"),
    body("timeSlot").notEmpty().withMessage("Time slot is required"),
  ],
  bookAppointment
);

// Admin - Update status
router.put("/:id/status", protect, updateAppointmentStatus);

module.exports = router;