const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: Number,
  phone: { type: String, required: true },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
