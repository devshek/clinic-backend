const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const Admin = require("../models/Admin");

/* =========================================================
   AUTH PROTECT MIDDLEWARE
========================================================= */

const protect = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  const admin = await Admin.findById(decoded.id).select("-password");

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Admin not found",
    });
  }

  req.admin = admin;
  next();

});

module.exports = protect;