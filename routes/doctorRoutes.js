const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");

const {
  addDoctor,
  getDoctors,
} = require("../controllers/doctorController");

/* =========================================================
   DOCTOR ROUTES
========================================================= */

// Get all doctors (Public)
router.get("/", getDoctors);

// Add doctor (Admin only)
router.post(
  "/",
  protect,
  upload.single("profileImage"),
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Doctor name is required"),

    body("specialization")
      .trim()
      .notEmpty()
      .withMessage("Specialization is required"),

    body("gender")
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(["male", "female"])
      .withMessage("Gender must be male or female"),

    body("startTime")
      .notEmpty()
      .withMessage("Start time is required"),

    body("endTime")
      .notEmpty()
      .withMessage("End time is required"),
  ],
  addDoctor
);

module.exports = router;