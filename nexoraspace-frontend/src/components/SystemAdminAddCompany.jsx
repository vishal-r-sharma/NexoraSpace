// SystemAdminAddCompany.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SystemAdminNavbar from "./SystemAdminNavbar";

/**
 * SystemAdminAddCompany
 * - Matches server routes: POST /api/company/add (server returns { success: true, company } on success)
 * - Sends withCredentials: true so auth cookie/token is sent
 * - Defensive normalization of server response shapes
 * - Handles 401 (redirect to login) and 409 (duplicate) specially
 * - Shows modal for success/error and uses inline messages
 */

const initialFormData = {
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
};

const initialFeatures = {
  employeeManagement: false,
  projectManagement: false,
  billingSystem: false,
};

const SystemAdminAddCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [features, setFeatures] = useState(initialFeatures);
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [clientError, setClientError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("info"); // 'success' | 'error' | 'info'
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(null);

  // lock body scroll when modal open
  useEffect(() => {
    if (showModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientError(null);
    setServerErrors(null);
    setSuccessMsg(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    if (!Object.prototype.hasOwnProperty.call(initialFeatures, name)) return;
    setFeatures((prev) => ({ ...prev, [name]: checked }));
    setClientError(null);
    setServerErrors(null);
    setSuccessMsg(null);
  };

  const validateClientSide = () => {
    const requiredKeys = [
      "companyName",
      "companyType",
      "registrationNumber",
      "panNumber",
      "gstNumber",
      "cinNumber",
      "dateOfIncorporation",
      "authorisedCapital",
      "paidUpCapital",
      "directors",
      "mainBusinessActivity",
      "numberOfEmployees",
      "description",
      "registeredAddress",
      "city",
      "state",
      "pincode",
      "country",
      "email",
      "phone",
      "website",
      "socialMedia",
      "bankName",
      "accountNumber",
      "ifscCode",
      "branch",
      "logoUrl",
      "status",
      "loginEmail",
      "loginPassword",
    ];

    for (const key of requiredKeys) {
      const val = formData[key];
      if (val === null || val === undefined || String(val).trim() === "") {
        return `Please fill '${key}'`;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email) || !emailRegex.test(formData.loginEmail)) {
      return "Please enter valid email(s).";
    }

    if (String(formData.loginPassword).length < 8) {
      return "Admin password must be at least 8 characters.";
    }

    if (isNaN(Number(formData.authorisedCapital)) || Number(formData.authorisedCapital) < 0) {
      return "Authorised capital must be a non-negative number.";
    }
    if (isNaN(Number(formData.paidUpCapital)) || Number(formData.paidUpCapital) < 0) {
      return "Paid-up capital must be a non-negative number.";
    }
    if (!Number.isInteger(Number(formData.numberOfEmployees)) || Number(formData.numberOfEmployees) < 0) {
      return "Number of employees must be a non-negative integer.";
    }

    const directorsArray = formData.directors
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    if (directorsArray.length < 1) {
      return "Please provide at least one director.";
    }

    if (
      typeof features.employeeManagement !== "boolean" ||
      typeof features.projectManagement !== "boolean" ||
      typeof features.billingSystem !== "boolean"
    ) {
      return "Invalid features selection.";
    }

    return null;
  };

  const preparePayload = () => {
    const directorsArray = formData.directors
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const payload = {
      companyName: String(formData.companyName).trim(),
      companyType: String(formData.companyType).trim(),
      registrationNumber: String(formData.registrationNumber).trim(),
      panNumber: String(formData.panNumber).trim(),
      gstNumber: String(formData.gstNumber).trim(),
      cinNumber: String(formData.cinNumber).trim(),
      dateOfIncorporation: formData.dateOfIncorporation,
      authorisedCapital: Number(formData.authorisedCapital),
      paidUpCapital: Number(formData.paidUpCapital),
      directors: directorsArray,
      mainBusinessActivity: String(formData.mainBusinessActivity).trim(),
      numberOfEmployees: Number(formData.numberOfEmployees),
      description: String(formData.description).trim(),
      registeredAddress: String(formData.registeredAddress).trim(),
      city: String(formData.city).trim(),
      state: String(formData.state).trim(),
      pincode: String(formData.pincode).trim(),
      country: String(formData.country).trim(),
      email: String(formData.email).trim(),
      phone: String(formData.phone).trim(),
      website: String(formData.website).trim(),
      socialMedia: String(formData.socialMedia).trim(),
      bankName: String(formData.bankName).trim(),
      accountNumber: String(formData.accountNumber).trim(),
      ifscCode: String(formData.ifscCode).trim(),
      branch: String(formData.branch).trim(),
      logoUrl: String(formData.logoUrl).trim(),
      status: String(formData.status).trim(),
      loginEmail: String(formData.loginEmail).trim(),
      loginPassword: String(formData.loginPassword),
      features: {
        employeeManagement: !!features.employeeManagement,
        projectManagement: !!features.projectManagement,
        billingSystem: !!features.billingSystem,
      },
    };

    return payload;
  };

  const openModal = ({ type = "info", title = "", body = null }) => {
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError(null);
    setServerErrors(null);
    setSuccessMsg(null);

    const clientValidationMsg = validateClientSide();
    if (clientValidationMsg) {
      setClientError(clientValidationMsg);
      openModal({ type: "error", title: "Validation error", body: clientValidationMsg });
      return;
    }

    const payload = preparePayload();

    setLoading(true);
    try {
      // Send with credentials so auth middleware can verify session
      const resp = await axios.post("/api/company/add", payload, {
        withCredentials: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      // Normalize server response: prefer { success:true, company: {...} }
      const data = resp?.data;
      if (data && data.success && data.company) {
        // success path (server returned created company)
        const created = data.company;
        if (created.loginPassword) delete created.loginPassword;

        setSuccessMsg("Company created successfully.");
        setFormData(initialFormData);
        setFeatures(initialFeatures);

        openModal({ type: "success", title: "Company Created", body: { message: data.message || "Created", company: created } });
      } else if (data && Array.isArray(data.companies)) {
        // improbable for POST, but handle gracefully
        setSuccessMsg("Company created (server returned companies array).");
        openModal({ type: "success", title: "Company Created", body: data });
        setFormData(initialFormData);
        setFeatures(initialFeatures);
      } else if (data && data.success) {
        // success with no company: still treat as success
        setSuccessMsg(data.message || "Company created.");
        openModal({ type: "success", title: "Company Created", body: data });
        setFormData(initialFormData);
        setFeatures(initialFeatures);
      } else {
        // unexpected shape but 2xx status
        openModal({ type: "success", title: "Company Created", body: data || "Company created." });
        setFormData(initialFormData);
        setFeatures(initialFeatures);
      }
    } catch (err) {
      // handle errors carefully
      const status = err?.response?.status;
      if (status === 401) {
        // unauthorized: redirect to login
        openModal({ type: "error", title: "Unauthorized", body: "You must be logged in to create a company." });
        navigate("/login");
        return;
      }
      if (status === 409 && err.response?.data) {
        // duplicate key or conflict
        const msg = err.response.data.message || "Duplicate value";
        setServerErrors([msg]);
        openModal({ type: "error", title: "Conflict", body: msg });
        setLoading(false);
        return;
      }

      // parse validation errors or arbitrary server shape
      let errorBody = "Unknown error occurred.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        // handle Joi-like details
        if (data.details && Array.isArray(data.details)) {
          errorBody = data.details.map((d) => d.message || JSON.stringify(d)).join("\n");
          setServerErrors(data.details.map((d) => d.message || JSON.stringify(d)));
        } else if (data.message) {
          errorBody = data.message;
          setServerErrors([data.message]);
        } else {
          errorBody = JSON.stringify(data);
          setServerErrors([JSON.stringify(data)]);
        }
      } else {
        errorBody = err.message || errorBody;
        setServerErrors([errorBody]);
      }

      openModal({ type: "error", title: "Failed to create company", body: errorBody });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setFeatures(initialFeatures);
    setClientError(null);
    setServerErrors(null);
    setSuccessMsg(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SystemAdminNavbar />

      <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-md rounded-xl p-6 md:p-8 col-span-1 lg:col-span-3 space-y-6"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
            Add New Company
          </h1>

          {/* show inline messages too (optional) */}
          {clientError && (
            <div className="bg-red-600/30 border border-red-500 text-red-100 p-3 rounded">
              {clientError}
            </div>
          )}
          {serverErrors && serverErrors.length > 0 && (
            <div className="bg-red-600/20 border border-red-500 text-red-100 p-3 rounded space-y-1">
              {serverErrors.map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-700/20 border border-green-500 text-green-100 p-3 rounded">
              {successMsg}
            </div>
          )}

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
                type="number"
                min="0"
                name="authorisedCapital"
                placeholder="Authorised Capital (INR)"
                value={formData.authorisedCapital}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
              />
              <input
                type="number"
                min="0"
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
              min="0"
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
                placeholder="Admin Password (min 8 chars)"
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
              disabled={loading}
              className="flex-1 py-2 bg-yellow-400 text-black rounded-md font-medium hover:bg-yellow-500 transition disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Company"}
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
            {Object.keys(initialFeatures).map((featureKey) => (
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />
          {/* modal panel */}
          <div className="relative z-10 max-w-2xl w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-md ${modalType === "success"
                        ? "bg-green-600/20 text-green-300"
                        : modalType === "error"
                          ? "bg-red-600/20 text-red-300"
                          : "bg-yellow-600/20 text-yellow-300"
                      }`}
                  >
                    {/* icon */}
                    {modalType === "success" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : modalType === "error" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{modalTitle}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {modalType === "success" ? "Operation completed." : "See details below."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="text-gray-300 hover:text-white rounded-md p-2"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 max-h-72 overflow-auto">
                {/* render modal body differently depending on content type */}
                {typeof modalBody === "string" || typeof modalBody === "number" ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-100 bg-gray-900/30 p-3 rounded">{String(modalBody)}</pre>
                ) : modalBody && typeof modalBody === "object" ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-100 bg-gray-900/30 p-3 rounded">
                    {JSON.stringify(modalBody, null, 2)}
                  </pre>
                ) : (
                  <div className="text-sm text-gray-300">No additional details provided.</div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                {/* on success maybe navigate */}
                <button
                  onClick={() => {
                    closeModal();
                  }}
                  className="px-4 py-2 rounded-md bg-gray-700 border border-gray-600 hover:bg-gray-600"
                >
                  Close
                </button>

                {modalType === "success" && (
                  <button
                    onClick={() => {
                      closeModal();
                      navigate("/system/dashboard");
                    }}
                    className="px-4 py-2 rounded-md bg-green-600 text-black font-medium hover:bg-green-700"
                  >
                    Go to Companies
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminAddCompany;
