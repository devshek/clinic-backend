const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  workingDays: [String],
  startTime: String,
  endTime: String
});

module.exports = mongoose.model("Doctor", doctorSchema);
