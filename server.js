const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* =========================================================
   SECURITY MIDDLEWARE
========================================================= */

// 1️⃣ Secure HTTP headers
app.use(helmet());

// 2️⃣ Global Rate limiting (100 req / 15 min)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use(globalLimiter);

// 3️⃣ Login-specific Rate limiting (5 attempts / 10 min)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  }
});

// Restrict CORS to frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

/* =========================================================
   ROUTES
========================================================= */

app.get("/", (req, res) => {
  res.send("Clinic API Running");
});

app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/admin/login", loginLimiter); // 🔐 Apply login limiter

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/holidays", require("./routes/holidayRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

/* =========================================================
   ERROR HANDLER
========================================================= */

const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

/* =========================================================
   SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});