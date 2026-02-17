const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addHoliday,
  getHolidays
} = require("../controllers/holidayController");

// Admin only
router.post("/", protect, addHoliday);
router.get("/", protect, getHolidays);

module.exports = router;
