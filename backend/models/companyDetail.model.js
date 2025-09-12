// companyDetail.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const FeaturesSchema = new mongoose.Schema({
  employeeManagement: { type: Boolean, required: true, default: false },
  projectManagement:  { type: Boolean, required: true, default: false },
  billingSystem:      { type: Boolean, required: true, default: false },
}, { _id: false });

const CompanyDetailSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  companyType: { type: String, required: true, trim: true }, // e.g. Private Limited
  registrationNumber: { type: String, required: true, trim: true },
  panNumber: { type: String, required: true, trim: true },
  gstNumber: { type: String, required: true, trim: true },
  cinNumber: { type: String, required: true, trim: true },

  dateOfIncorporation: { type: Date, required: true },

  authorisedCapital: { type: Number, required: true, min: 0 },
  paidUpCapital: { type: Number, required: true, min: 0 },

  directors: { type: [String], required: true }, // array of director names
  mainBusinessActivity: { type: String, required: true, trim: true },
  numberOfEmployees: { type: Number, required: true, min: 0 },

  description: { type: String, required: true, trim: true },

  registeredAddress: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },

  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },

  website: { type: String, required: true, trim: true },
  socialMedia: { type: String, required: true, trim: true },

  bankName: { type: String, required: true, trim: true },
  accountNumber: { type: String, required: true, trim: true },
  ifscCode: { type: String, required: true, trim: true },
  branch: { type: String, required: true, trim: true },

  logoUrl: { type: String, required: true, trim: true },

  status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },

  loginEmail: { type: String, required: true, trim: true, lowercase: true },
  loginPassword: { type: String, required: true }, // hashed before save

  features: { type: FeaturesSchema, required: true, default: () => ({}) },

}, { timestamps: true, collection: 'companydetails' });

/**
 * Indexes:
 * - companyName: text index to support text search
 * - registrationNumber, panNumber, gstNumber, cinNumber, email, loginEmail: unique where likely required
 * Adjust unique constraints to your business rules before enabling in production.
 */
CompanyDetailSchema.index({ companyName: 'text' });
CompanyDetailSchema.index({ registrationNumber: 1 }, { unique: true, name: 'idx_registrationNumber_unique' });
CompanyDetailSchema.index({ panNumber: 1 }, { unique: true, name: 'idx_pan_unique' });
CompanyDetailSchema.index({ gstNumber: 1 }, { unique: true, name: 'idx_gst_unique' });
CompanyDetailSchema.index({ cinNumber: 1 }, { unique: true, name: 'idx_cin_unique' });
CompanyDetailSchema.index({ email: 1 }, { unique: true, sparse: true, name: 'idx_email_unique' });
CompanyDetailSchema.index({ loginEmail: 1 }, { unique: true, name: 'idx_loginEmail_unique' });

/**
 * Pre-save: hash loginPassword if modified.
 * Note: ensure you call .save() on the Mongoose document; the hook will hash password automatically.
 */
CompanyDetailSchema.pre('save', async function (next) {
  try {
    if (this.isModified('loginPassword')) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      this.loginPassword = await bcrypt.hash(this.loginPassword, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Optional: method to compare password (useful when authenticating)
CompanyDetailSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.loginPassword);
};

const CompanyDetail = mongoose.model('CompanyDetail', CompanyDetailSchema);

module.exports = CompanyDetail;
