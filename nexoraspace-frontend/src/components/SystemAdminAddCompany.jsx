import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SystemAdminNavbar from "./SystemAdminNavbar";

const SystemAdminAddCompany = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "Private Limited",
    registrationNumber: "",
    panNumber: "",
    gstNumber: "",
    cinNumber: "",
    dateOfIncorporation: "",
    authorisedCapital: "",
    paidUpCapital: "",
    directors: "",
    mainBusinessActivity: "",
    numberOfEmployees: "",
    description: "",
    registeredAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    email: "",
    phone: "",
    website: "",
    socialMedia: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    logoUrl: "",
    status: "Active",
    loginEmail: "",
    loginPassword: "",
  });

  const [features, setFeatures] = useState({
    employeeManagement: false,
    projectManagement: false,
    billingSystem: false,
    inventoryManagement: false,
    crm: false,
    analytics: false,
    hrManagement: false,
    payrollSystem: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setFeatures({ ...features, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Company Data:", formData);
    console.log("Features:", features);
  };

  const handleClear = () => {
    setFormData({
      companyName: "",
      companyType: "Private Limited",
      registrationNumber: "",
      panNumber: "",
      gstNumber: "",
      cinNumber: "",
      dateOfIncorporation: "",
      authorisedCapital: "",
      paidUpCapital: "",
      directors: "",
      mainBusinessActivity: "",
      numberOfEmployees: "",
      description: "",
      registeredAddress: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      email: "",
      phone: "",
      website: "",
      socialMedia: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      logoUrl: "",
      status: "Active",
      loginEmail: "",
      loginPassword: "",
    });
    setFeatures({
      employeeManagement: false,
      projectManagement: false,
      billingSystem: false,
      inventoryManagement: false,
      crm: false,
      analytics: false,
      hrManagement: false,
      payrollSystem: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <SystemAdminNavbar />

      {/* Main Content */}
      <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-md rounded-xl p-6 md:p-8 col-span-1 lg:col-span-3 space-y-6"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
            Add New Company
          </h1>

          {/* Basic Information */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Basic Information</h2>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              >
                <option>Private Limited</option>
                <option>Public Limited</option>
                <option>Partnership</option>
                <option>LLP</option>
                <option>Sole Proprietorship</option>
              </select>
              <input
                type="date"
                name="dateOfIncorporation"
                value={formData.dateOfIncorporation}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
          </div>

          {/* Registration Details */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Registration Details</h2>
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number (ROC)"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="cinNumber"
                placeholder="CIN Number"
                value={formData.cinNumber}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="panNumber"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
            <input
              type="text"
              name="mainBusinessActivity"
              placeholder="Main Business Activity"
              value={formData.mainBusinessActivity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
            />
          </div>

          {/* Financial & Management */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Financial & Management</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="authorisedCapital"
                placeholder="Authorised Capital (INR)"
                value={formData.authorisedCapital}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="paidUpCapital"
                placeholder="Paid-up Capital (INR)"
                value={formData.paidUpCapital}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
            <input
              type="text"
              name="directors"
              placeholder="Directors (comma separated)"
              value={formData.directors}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
            />
            <input
              type="number"
              name="numberOfEmployees"
              placeholder="Number of Employees"
              value={formData.numberOfEmployees}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
            />
            <textarea
              name="description"
              placeholder="Company Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white resize-none"
            />
          </div>

          {/* Registered Address */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Registered Address</h2>
            <input
              type="text"
              name="registeredAddress"
              placeholder="Registered Address"
              value={formData.registeredAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
          </div>

          {/* Admin Login */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Admin Login</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="loginEmail"
                placeholder="Admin Email"
                value={formData.loginEmail}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="password"
                name="loginPassword"
                placeholder="Admin Password"
                value={formData.loginPassword}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Contact Information</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                placeholder="Company Email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="website"
                placeholder="Website URL"
                value={formData.website}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="socialMedia"
                placeholder="Social Media Links"
                value={formData.socialMedia}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
          </div>

          {/* Banking Details */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Banking Details</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
            </div>
          </div>

          {/* Logo & Status */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Other Details</h2>
            <input
              type="text"
              name="logoUrl"
              placeholder="Company Logo URL"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition"
            >
              Add Company
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Features Sidebar */}
        <div className="w-full lg:w-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg rounded-2xl p-6 h-fit sticky top-6 self-start border border-gray-700">
          <h2 className="font-bold text-xl text-yellow-400 mb-5 tracking-wide">
            ⚡ Select Features
          </h2>

          <div className="space-y-3">
            {Object.keys(features).map((featureKey) => (
              <label
                key={featureKey}
                htmlFor={featureKey}
                className="flex items-center gap-3 cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition rounded-lg px-3 py-2 group"
              >
                <input
                  type="checkbox"
                  id={featureKey}
                  name={featureKey}
                  checked={features[featureKey]}
                  onChange={handleFeatureChange}
                  className="h-5 w-5 rounded-md border-gray-600 bg-gray-800 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 cursor-pointer"
                />
                <span className="capitalize text-gray-200 group-hover:text-yellow-300 transition">
                  {featureKey.replace(/([A-Z])/g, " $1")}
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemAdminAddCompany;
