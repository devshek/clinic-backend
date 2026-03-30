const asyncHandler = require("../middleware/asyncHandler");
const Appointment = require("../models/Appointment");

/* =========================================================
   DASHBOARD STATS
========================================================= */
exports.getDashboardStats = asyncHandler(async (req, res) => {

  const today = new Date().toISOString().split("T")[0];

  // Total appointments
  const totalAppointments = await Appointment.countDocuments();

  // Today's appointments (pending + confirmed)
  const todayAppointments = await Appointment.countDocuments({
    date: today,
    status: { $in: ["pending", "confirmed"] }
  });

  // Cancelled appointments
  const cancelledAppointments = await Appointment.countDocuments({
    status: "cancelled"
  });

  // Doctor-wise booking stats
  const doctorStats = await Appointment.aggregate([
    {
      $match: {
        status: { $in: ["pending", "confirmed"] }
      }
    },
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
    },
    { $sort: { totalBookings: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalAppointments,
      todayAppointments,
      cancelledAppointments,
      doctorStats
    }
  });

});