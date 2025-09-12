const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require('cookie-parser');
const connectDB = require("./config/mongoose_connection");
const Company = require("./models/Company"); // import model
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const companyRoutes = require("./routes/companyRoutes");


const app = express();


// If behind proxy (Heroku / nginx), enable this so req.secure works
// app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// Allow the frontend origin and credentials
app.use(cors({
  origin: [
    'http://localhost:5173',                 // dev frontend
    'https://nexoraspace.vishalsharmadev.in' // prod frontend
  ],
  credentials: true,
}));

// Connect to MongoDB
connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);

app.get("/system/dashboard", authMiddleware)


// Test route
app.get("/", (req, res) => {
  res.send("🚀 NexoraSpace Backend Running...");
});



// after `app.use('/api/company', companyRoutes)` and other api routers

// 404 for API routes -> always JSON
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// global error handler (ensures JSON for errors)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  next(err); // allow non-api requests (e.g., SPA fallback) to be handled elsewhere
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
