const Holiday = require("../models/Holiday");

// Add Holiday (Admin)
exports.addHoliday = async (req, res) => {
  try {
    const { date, reason } = req.body;

    const exists = await Holiday.findOne({ date });
    if (exists) {
      return res.status(400).json({ message: "Holiday already exists" });
    }

    const holiday = new Holiday({ date, reason });
    await holiday.save();

    res.status(201).json({ message: "Holiday added successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Holidays
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
