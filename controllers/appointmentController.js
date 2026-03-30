const { validationResult } = require("express-validator");
const asyncHandler = require("../middleware/asyncHandler");

const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Holiday = require("../models/Holiday");
const sendEmail = require("../utils/sendEmail");

/* =========================================================
   BOOK APPOINTMENT
========================================================= */
exports.bookAppointment = asyncHandler(async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  const { patientName, age, phone, email, doctor, date, timeSlot } = req.body;

  // Prevent past booking
  const today = new Date();
  const selectedDate = new Date(date);
  today.setHours(0,0,0,0);
  selectedDate.setHours(0,0,0,0);

  if (selectedDate < today) {
    res.status(400);
    throw new Error("Cannot book appointment for past date");
  }

  // Prevent holiday booking
  const holiday = await Holiday.findOne({ date });
  if (holiday) {
    res.status(400);
    throw new Error("Clinic is closed on this date");
  }

  // Check doctor
  const doctorExists = await Doctor.findById(doctor);
  if (!doctorExists) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  // Check working day
  const selectedDay = new Date(date).toLocaleString("en-US", {
    weekday: "long"
  });

  if (!doctorExists.workingDays.includes(selectedDay)) {
    res.status(400);
    throw new Error(`Doctor is not available on ${selectedDay}`);
  }

  // Convert time helper
  const convertToMinutes = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const appointmentTime = convertToMinutes(timeSlot);
  const doctorStart = convertToMinutes(doctorExists.startTime);
  const doctorEnd = convertToMinutes(doctorExists.endTime);

  if (appointmentTime < doctorStart || appointmentTime >= doctorEnd) {
    res.status(400);
    throw new Error("Selected time is outside doctor's working hours");
  }

  // Prevent double booking
  const existingAppointment = await Appointment.findOne({
    doctor,
    date,
    timeSlot,
    status: { $in: ["pending", "confirmed"] }
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error("This time slot is already booked");
  }

  // Create appointment
  const appointment = await Appointment.create({
    patientName,
    age,
    phone,
    email,
    doctor,
    date,
    timeSlot
  });

  /* ================= EMAIL SECTION ================= */

  // Email to patient
  await sendEmail({
    to: email,
    subject: "Appointment Confirmed - City Clinic",
    title: "Appointment Confirmation ✅",
    message: `Dear ${patientName}, your appointment has been successfully booked.`,
    details: `
      <li><strong>Doctor:</strong> ${doctorExists.name}</li>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${timeSlot}</li>
    `
  });

  // Email to admin
  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: "New Appointment Booked",
    title: "New Appointment Alert 📅",
    message: `A new appointment has been booked.`,
    details: `
      <li><strong>Patient:</strong> ${patientName}</li>
      <li><strong>Doctor:</strong> ${doctorExists.name}</li>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${timeSlot}</li>
    `
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    data: appointment
  });

});


/* =========================================================
   UPDATE STATUS
========================================================= */
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {

  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id).populate("doctor");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  appointment.status = status;
  await appointment.save();

  // If cancelled → send email
  if (status === "cancelled") {
    await sendEmail({
      to: appointment.email,
      subject: "Appointment Cancelled - City Clinic",
      title: "Appointment Cancelled ❌",
      message: `Dear ${appointment.patientName}, your appointment has been cancelled.`,
      details: `
        <li><strong>Doctor:</strong> ${appointment.doctor.name}</li>
        <li><strong>Date:</strong> ${appointment.date}</li>
        <li><strong>Time:</strong> ${appointment.timeSlot}</li>
      `
    });
  }

  res.status(200).json({
    success: true,
    message: "Status updated successfully"
  });

});