const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require('cookie-parser');
const connectDB = require("./config/mongoose_connection");
const Company = require("./models/Company"); // import model
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();


// If behind proxy (Heroku / nginx), enable this so req.secure works
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));

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


app.get("/system/dashboard", authMiddleware)

// Test route
app.get("/", (req, res) => {
  res.send("🚀 NexoraSpace Backend Running...");
});

// Route to create sample company
app.get("/create-sample-company", async (req, res) => {
  try {
    const sampleCompany = new Company({
      companyName: "NexoraSpace Pvt Ltd.",
      companyType: "Private Limited",
      dateOfIncorporation: "2024-02-15",
      registrationNumber: "ROC123456",
      cinNumber: "U47734TS2024PTC182276",
      panNumber: "ABCDE1234F",
      gstNumber: "29ABCDE1234F2Z5",
      mainBusinessActivity: "SaaS Development",
      authorisedCapital: "10,00,000",
      paidUpCapital: "8,00,000",
      directors: "Vishal Sharma, John Doe",
      numberOfEmployees: 120,
      description: "NexoraSpace is a secure multi-tenant SaaS platform.",
      registeredAddress: "123 Tech Park, Hyderabad",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500001",
      country: "India",
      loginEmail: "admin@nexoraspace.com",
      loginPassword: "securePassword123", // ⚠️ Later hash this
      email: "info@nexoraspace.com",
      phone: "+91 9876543210",
      website: "https://nexoraspace.com",
      socialMedia: "https://linkedin.com/company/nexoraspace",
      bankName: "HDFC Bank",
      branch: "Tech Park Branch",
      accountNumber: "1234567890",
      ifscCode: "HDFC0001234",
      logoUrl: "/logo-white.svg",
      status: "Active",
      features: {
        employeeManagement: true,
        projectManagement: true,
        billingSystem: false,
        inventoryManagement: false,
        crm: true,
        analytics: true,
        hrManagement: false,
        payrollSystem: true,
      },
    });

    await sampleCompany.save();
    res.json({ success: true, message: "✅ Sample company created", data: sampleCompany });
  } catch (error) {
    console.error("❌ Error creating sample company:", error);
    res.status(500).json({ success: false, message: "Error creating company", error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
