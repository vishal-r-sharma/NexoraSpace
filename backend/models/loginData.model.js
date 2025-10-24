// ./models/loginData.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const SALT_ROUNDS = 10;

// ----------------------
// Sub-schema: individual company users
// ----------------------
const UserSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // ensure every user has its own ObjectId
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee"],
      default: "Employee",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { _id: true }
);

// ----------------------
// Main Login Data Schema
// ----------------------
const LoginDataSchema = new mongoose.Schema(
  {
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyDetail",
      required: true,
      unique: true, // only 1 login document per company
    },
    users: { type: [UserSchema], default: [] },
    totalUsers: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "logindata" }
);

// ----------------------
// Indexes
// ----------------------
// ❗ Allow duplicate emails across different companies
LoginDataSchema.index({ companyRef: 1 });
LoginDataSchema.index({ "users.email": 1 }); // removed unique:true

// ----------------------
// Hooks
// ----------------------
LoginDataSchema.pre("save", async function (next) {
  try {
    // Only hash if passwords are new or modified
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      // Assume passwords are already hashed before save
this.totalUsers = this.users.length;
this.lastUpdated = new Date();
next();

    }

    this.totalUsers = this.users.length;
    this.lastUpdated = new Date();
    next();
  } catch (err) {
    console.error("❌ Error hashing user passwords:", err.message);
    next(err);
  }
});

// ----------------------
// Instance Methods
// ----------------------
LoginDataSchema.methods.comparePassword = async function (email, candidatePassword) {
  const user = this.users.find((u) => u.email === email);
  if (!user) return false;
  return bcrypt.compare(candidatePassword, user.password);
};

// ----------------------
// Joi Validation
// ----------------------
const validateLoginData = (data) => {
  const schema = Joi.object({
    companyRef: Joi.string().required(),
    users: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
          role: Joi.string().valid("Admin", "Manager", "Employee").required(),
          isActive: Joi.boolean(),
        })
      )
      .min(1)
      .required(),
  });

  return schema.validate(data);
};

// ----------------------
// Export
// ----------------------
const LoginData = mongoose.model("LoginData", LoginDataSchema);
module.exports = { LoginData, validateLoginData };
