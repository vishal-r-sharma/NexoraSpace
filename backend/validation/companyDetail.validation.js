// companyDetail.validation.js
const Joi = require('joi');

const featuresSchema = Joi.object({
  employeeManagement: Joi.boolean().required(),
  projectManagement: Joi.boolean().required(),
  billingSystem: Joi.boolean().required(),
}).required();

const CompanyDetailJoiSchema = Joi.object({
  companyName: Joi.string().trim().required(),
  companyType: Joi.string().trim().required(),
  registrationNumber: Joi.string().trim().required(),
  panNumber: Joi.string().trim().required(),   // add regex if you want stricter validation
  gstNumber: Joi.string().trim().required(),
  cinNumber: Joi.string().trim().required(),

  dateOfIncorporation: Joi.date().required(),

  authorisedCapital: Joi.number().min(0).required(),
  paidUpCapital: Joi.number().min(0).required(),

  directors: Joi.array().items(Joi.string().trim().required()).min(1).required(),
  mainBusinessActivity: Joi.string().trim().required(),
  numberOfEmployees: Joi.number().integer().min(0).required(),

  description: Joi.string().trim().required(),

  registeredAddress: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  pincode: Joi.string().trim().required(),
  country: Joi.string().trim().required(),

  email: Joi.string().email().trim().required(),
  phone: Joi.string().trim().required(),

  website: Joi.string().uri().trim().required(),
  socialMedia: Joi.string().trim().required(),

  bankName: Joi.string().trim().required(),
  accountNumber: Joi.string().trim().required(),
  ifscCode: Joi.string().trim().required(),
  branch: Joi.string().trim().required(),

  logoUrl: Joi.string().uri().trim().required(),

  status: Joi.string().valid('Active', 'Inactive').required(),

  loginEmail: Joi.string().email().trim().required(),
  loginPassword: Joi.string().min(8).required(), // enforce min length

  features: featuresSchema
});

module.exports = { CompanyDetailJoiSchema };