const Doctor = require("../models/Doctor");

// Add Doctor
exports.addDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
