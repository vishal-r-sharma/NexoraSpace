const mongoose = require("mongoose");
const Joi = require("joi");

// --- Mongoose Schema ---
const systemUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // removes extra spaces
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // normalize
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // simple email regex
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // example constraint
  },
}, { timestamps: true });

const SystemUser = mongoose.model("SystemUser", systemUserSchema);

// --- Joi Validation ---
const validateSystemUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
};

module.exports = {
  SystemUser,
  validateSystemUser,
};
