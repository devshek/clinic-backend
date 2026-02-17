const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Holiday = require("../models/Holiday");


// Book Appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { patientName, age, phone, doctor, date, timeSlot } = req.body;

    // Prevent booking past dates
 const today = new Date();
 const selectedDate = new Date(date);

 today.setHours(0,0,0,0);
 selectedDate.setHours(0,0,0,0);

if (selectedDate < today) {
  return res.status(400).json({
    message: "Cannot book appointment for past date"
  });
}


// Prevent booking on holiday
const holiday = await Holiday.findOne({ date });

if (holiday) {
  return res.status(400).json({
    message: "Clinic is closed on this date"
  });
}



    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctor);

    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Validate doctor working days
const selectedDay = new Date(date).toLocaleString("en-US", {
  weekday: "long"
});

if (!doctorExists.workingDays.includes(selectedDay)) {
  return res.status(400).json({
    message: `Doctor is not available on ${selectedDay}`
  });
}


    // Convert time string (e.g., "09:30 AM") to minutes
const convertToMinutes = (time) => {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

const appointmentTime = convertToMinutes(timeSlot);
const doctorStart = convertToMinutes(doctorExists.startTime);
const doctorEnd = convertToMinutes(doctorExists.endTime);

if (appointmentTime < doctorStart || appointmentTime > doctorEnd) {
  return res.status(400).json({
    message: "Selected time is outside doctor's working hours"
  });
}


    // Check for double booking
    const existingAppointment = await Appointment.findOne({
      doctor,
      date,
      timeSlot,
      status: "booked"
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked"
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      patientName,
      age,
      phone,
      doctor,
      date,
      timeSlot
    });

    const savedAppointment = await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialization");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Available Slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const convertToMinutes = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    };

    const convertToTimeString = (minutes) => {
      let hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      const modifier = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${modifier}`;
    };

    const start = convertToMinutes(doctor.startTime);
    const end = convertToMinutes(doctor.endTime);

    const allSlots = [];

    // 30-minute slot interval
    for (let time = start; time < end; time += 30) {
      allSlots.push(convertToTimeString(time));
    }

    // Get booked appointments for that doctor & date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date,
      status: "booked"
    });

    const bookedSlots = bookedAppointments.map(a => a.timeSlot);

    // Remove booked slots
    const availableSlots = allSlots.filter(
      slot => !bookedSlots.includes(slot)
    );

    res.json({ availableSlots });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
