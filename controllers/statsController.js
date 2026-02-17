const Appointment = require("../models/Appointment");

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Total appointments
    const totalAppointments = await Appointment.countDocuments();

    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      date: today,
      status: "booked"
    });

    // Cancelled appointments
    const cancelledAppointments = await Appointment.countDocuments({
      status: "cancelled"
    });

    // Doctor-wise booking count
    const doctorStats = await Appointment.aggregate([
  { $match: { status: "booked" } },

  {
    $group: {
      _id: "$doctor",
      totalBookings: { $sum: 1 }
    }
  },

  {
    $lookup: {
      from: "doctors",
      localField: "_id",
      foreignField: "_id",
      as: "doctorInfo"
    }
  },

  { $unwind: "$doctorInfo" },

  {
    $project: {
      doctorId: "$_id",
      doctorName: "$doctorInfo.name",
      specialization: "$doctorInfo.specialization",
      totalBookings: 1,
      _id: 0
    }
  }
]);


    res.json({
      totalAppointments,
      todayAppointments,
      cancelledAppointments,
      doctorStats
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
