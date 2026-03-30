const asyncHandler = require("../middleware/asyncHandler");
const Holiday = require("../models/Holiday");

/* =========================================================
   ADD HOLIDAY (ADMIN)
========================================================= */
exports.addHoliday = asyncHandler(async (req, res) => {

  const { date, reason } = req.body;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Holiday date is required",
    });
  }

  const exists = await Holiday.findOne({ date });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Holiday already exists",
    });
  }

  const holiday = await Holiday.create({
    date,
    reason,
  });

  res.status(201).json({
    success: true,
    message: "Holiday added successfully",
    data: holiday,
  });

});


/* =========================================================
   GET ALL HOLIDAYS
========================================================= */
exports.getHolidays = asyncHandler(async (req, res) => {

  const holidays = await Holiday.find().sort({ date: 1 });

  res.status(200).json({
    success: true,
    count: holidays.length,
    data: holidays,
  });

});