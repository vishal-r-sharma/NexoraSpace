// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { LoginData } = require("../models/loginData.model");
const { CompanyDetail } = require("../models/companyDetail.model");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_company_key";
const TOKEN_EXPIRY = "2d"; // token expires in 2 days

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const companyLoginDoc = await LoginData.findOne({
      "users.email": email.toLowerCase(),
    }).lean();

    if (!companyLoginDoc) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const userObj = companyLoginDoc.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!userObj) {
      return res
        .status(401)
        .json({ success: false, message: "User not found in records." });
    }

    const isMatch = await bcrypt.compare(password, userObj.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password." });
    }

    const company = await CompanyDetail.findById(companyLoginDoc.companyRef)
      .select("companyName status")
      .lean();

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found." });
    }

    // ⚙️ Prepare JWT payload
    const payload = {
      userId: userObj._id,
      role: userObj.role,
      companyRef: companyLoginDoc.companyRef,
      email: userObj.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    // 🍪 Auto environment-safe cookie config
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // only HTTPS in prod
      sameSite: isProd ? "None" : "Lax", // allow local dev + cross-origin prod
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      path: "/",
    };

    res.cookie("companytoken", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: userObj._id,
        email: userObj.email,
        role: userObj.role,
        companyRef: companyLoginDoc.companyRef,
        companyName: company.companyName,
      },
    });
  } catch (err) {
    console.error("❌ Error in login:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("companytoken", {
      path: "/",
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    console.error("❌ Error in logout:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};
