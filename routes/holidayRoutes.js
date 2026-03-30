const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const protect = require("../middleware/authMiddleware");
const {
  addHoliday,
  getHolidays,
} = require("../controllers/holidayController");

/* =========================================================
   HOLIDAY ROUTES (ADMIN ONLY)
========================================================= */

// Add Holiday
router.post(
  "/",
  protect,
  [
    body("date")
      .notEmpty()
      .withMessage("Holiday date is required"),

    body("reason")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Reason must be at least 3 characters"),
  ],
  addHoliday
);

// Get All Holidays
router.get("/", protect, getHolidays);

module.exports = router;