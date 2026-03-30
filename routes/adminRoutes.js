const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminController");

/* =========================================================
   ADMIN AUTH ROUTES
========================================================= */

// Register Admin (Use once - consider disabling in production)
router.post(
  "/register",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerAdmin
);

// Login Admin
router.post(
  "/login",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  loginAdmin
);

module.exports = router;