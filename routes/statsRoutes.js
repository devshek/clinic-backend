const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { getDashboardStats } = require("../controllers/statsController");

// Admin only
router.get("/", protect, getDashboardStats);

module.exports = router;
