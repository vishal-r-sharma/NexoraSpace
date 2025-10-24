const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/mongoose_connection");

const authRoutes = require("./routes/authRoutes");
const SystemRoutes = require("./routes/SystemRoutes");
const systemAuthRoutes = require("./routes/systemAuthRoutes")
const companyRoutes = require("./routes/companyRoutes")
const companyEmployeeRoutes = require("./routes/companyEmployeeRoutes");
const companyBillingRoutes = require("./routes/companyBillingRoutes");

const app = express();

// ✅ CORS setup (must be before routes)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://nexoraspace.vishalsharmadev.in",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/company/data", companyRoutes);
app.use("/api/company/data/employee", companyEmployeeRoutes);
app.use("/api/company/data/billing", companyBillingRoutes);


//system admin ka all routes
app.use("/api/company", SystemRoutes); // routes of all update delete etc
app.use("/api/auth/systemadmin", systemAuthRoutes);// system admin login logout routes

app.get("/", (req, res) => res.send("🚀 NexoraSpace Backend Running..."));

// 404 handler for APIs
app.use("/api", (req, res) =>
  res.status(404).json({ success: false, message: "API endpoint not found" })
);

// global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (req.path.startsWith("/api")) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
