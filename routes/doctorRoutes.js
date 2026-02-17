const express = require("express");
const router = express.Router();
const {
  addDoctor,
  getDoctors
} = require("../controllers/doctorController");

router.post("/", addDoctor);   // Add doctor
router.get("/", getDoctors);   // Get all doctors

module.exports = router;
