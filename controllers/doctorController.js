const Doctor = require("../models/Doctor");
const asyncHandler = require("../middleware/asyncHandler");

/* =========================================================
   ADD DOCTOR
========================================================= */
exports.addDoctor = asyncHandler(async (req, res) => {

  const {
    name,
    specialization,
    gender,
    startTime,
    endTime,
    workingDays
  } = req.body;

  if (!name || !specialization || !gender || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided"
    });
  }

  const doctor = await Doctor.create({
    name,
    specialization,
    gender,
    startTime,
    endTime,
    workingDays,
    profileImage: req.file
      ? `/uploads/${req.file.filename}`
      : ""
  });

  res.status(201).json({
    success: true,
    message: "Doctor added successfully",
    data: doctor
  });

});


/* =========================================================
   GET ALL DOCTORS
========================================================= */
exports.getDoctors = asyncHandler(async (req, res) => {

  const doctors = await Doctor.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors
  });

});