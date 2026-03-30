const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema(
  {
    date: {
      type: String, // Keeping String for compatibility with your existing logic
      required: [true, "Holiday date is required"],
      unique: true,
      trim: true,
    },

    reason: {
      type: String,
      trim: true,
      minlength: [3, "Reason must be at least 3 characters"],
      default: "Clinic Closed",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Holiday", holidaySchema);