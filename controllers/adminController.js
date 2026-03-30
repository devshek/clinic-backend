const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");
const Admin = require("../models/Admin");

/* =========================================================
   GENERATE JWT
========================================================= */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* =========================================================
   REGISTER ADMIN (Use Once Only)
========================================================= */
exports.registerAdmin = asyncHandler(async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  const adminExists = await Admin.findOne({ username });

  if (adminExists) {
    return res.status(400).json({
      success: false,
      message: "Admin already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    username,
    password: hashedPassword
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully"
  });

});


/* =========================================================
   LOGIN ADMIN
========================================================= */
exports.loginAdmin = asyncHandler(async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(admin._id)
  });

});