// SystemAdminCompanyProfile.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import SystemAdminNavbar from "./SystemAdminNavbar";
import axios from "axios";

/**
 * Company profile page:
 * - Loads company by id (GET /api/company/:id)
 * - Update (PUT /api/company/:id)
 * - Delete (DELETE /api/company/:id)
 * - All requests use withCredentials: true so cookie "token" is sent
 * - Shows modal for operation results
 *
 * NOTE: install axios and framer-motion if not installed
 */

const emptyForm = {
  companyName: "",
  companyType: "Private Limited",
  registrationNumber: "",
  panNumber: "",
  gstNumber: "",
  cinNumber: "",
  dateOfIncorporation: "",
  authorisedCapital: "",
  paidUpCapital: "",
  directors: "", // UI: comma separated
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
  createdAt: "",
  lastUpdated: "",
};

const allowedFeatures = {
  employeeManagement: false,
  projectManagement: false,
  billingSystem: false,
};

export default function SystemAdminCompanyProfile() {
  const { id } = useParams(); // company id from route
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [features, setFeatures] = useState(allowedFeatures);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("info"); // success | error | info
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(null);

  useEffect(() => {
    // fetch company by id
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/company/${id}`, { withCredentials: true });
        const company = res.data;

        // adapt returned model to form fields
        setFormData({
          companyName: company.companyName || "",
          companyType: company.companyType || "Private Limited",
          registrationNumber: company.registrationNumber || "",
          panNumber: company.panNumber || "",
          gstNumber: company.gstNumber || "",
          cinNumber: company.cinNumber || "",
          dateOfIncorporation: company.dateOfIncorporation
            ? new Date(company.dateOfIncorporation).toISOString().slice(0, 10)
            : "",
          authorisedCapital: company.authorisedCapital ?? "",
          paidUpCapital: company.paidUpCapital ?? "",
          directors: Array.isArray(company.directors) ? company.directors.join(", ") : company.directors || "",
          mainBusinessActivity: company.mainBusinessActivity || "",
          numberOfEmployees: company.numberOfEmployees ?? "",
          description: company.description || "",
          registeredAddress: company.registeredAddress || "",
          city: company.city || "",
          state: company.state || "",
          pincode: company.pincode || "",
          country: company.country || "India",
          email: company.email || "",
          phone: company.phone || "",
          website: company.website || "",
          socialMedia: company.socialMedia || "",
          bankName: company.bankName || "",
          accountNumber: company.accountNumber || "",
          ifscCode: company.ifscCode || "",
          branch: company.branch || "",
          logoUrl: company.logoUrl || "",
          status: company.status || "Active",
          loginEmail: company.loginEmail || "",
          loginPassword: "", // keep empty for safety; set new password if user changes it
          createdAt: company.createdAt ? new Date(company.createdAt).toLocaleString() : "",
          lastUpdated: company.updatedAt ? new Date(company.updatedAt).toLocaleString() : "",
        });

        setFeatures({
          employeeManagement: !!company.features?.employeeManagement,
          projectManagement: !!company.features?.projectManagement,
          billingSystem: !!company.features?.billingSystem,
        });
      } catch (err) {
        console.error("Error loading company:", err.response?.data || err.message);
        const status = err.response?.status;
        if (status === 401) {
          // not authenticated
          openModal({ type: "error", title: "Unauthorized", body: "Please login to access this page." });
          navigate("/login");
          return;
        }
        openModal({ type: "error", title: "Error loading company", body: err.response?.data?.message || err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openModal = ({ type = "info", title = "", body = null }) => {
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    if (!Object.prototype.hasOwnProperty.call(allowedFeatures, name)) return;
    setFeatures((p) => ({ ...p, [name]: checked }));
  };

  const validateBeforeSave = () => {
    // basic required checks (same as add)
    const required = [
      "companyName", "companyType", "registrationNumber", "panNumber", "gstNumber", "cinNumber",
      "dateOfIncorporation", "authorisedCapital", "paidUpCapital", "directors",
      "mainBusinessActivity", "numberOfEmployees", "description", "registeredAddress",
      "city", "state", "pincode", "country", "email", "phone", "website", "socialMedia",
      "bankName", "accountNumber", "ifscCode", "branch", "logoUrl", "status", "loginEmail"
    ];
    for (const key of required) {
      const v = formData[key];
      if (v === null || v === undefined || String(v).trim() === "") {
        return `Please provide ${key}`;
      }
    }
    // email checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email) || !emailRegex.test(formData.loginEmail)) {
      return "Please provide valid email addresses.";
    }
    // numeric checks
    if (isNaN(Number(formData.authorisedCapital)) || Number(formData.authorisedCapital) < 0) {
      return "Authorised capital must be a non-negative number.";
    }
    if (isNaN(Number(formData.paidUpCapital)) || Number(formData.paidUpCapital) < 0) {
      return "Paid up capital must be a non-negative number.";
    }
    if (!Number.isInteger(Number(formData.numberOfEmployees)) || Number(formData.numberOfEmployees) < 0) {
      return "Number of employees must be a non-negative integer.";
    }
    // directors
    const directorsArray = formData.directors
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    if (directorsArray.length < 1) return "Please provide at least one director.";
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
      // Only include loginPassword if user entered a new one
      ...(formData.loginPassword ? { loginPassword: formData.loginPassword } : {}),
      features: {
        employeeManagement: !!features.employeeManagement,
        projectManagement: !!features.projectManagement,
        billingSystem: !!features.billingSystem,
      },
    };

    return payload;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationError = validateBeforeSave();
    if (validationError) {
      openModal({ type: "error", title: "Validation error", body: validationError });
      return;
    }

    const payload = preparePayload();
    setSaving(true);
    try {
      const res = await axios.put(`/api/company/${id}`, payload, { withCredentials: true });
      openModal({ type: "success", title: "Saved", body: "Company updated successfully." });
      // update timestamp and lastUpdated shown
      setFormData((p) => ({ ...p, lastUpdated: new Date().toLocaleString() }));
      // optionally update features again from server response
      // if res.data.features then setFeatures...
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      const body = err.response?.data?.message || err.response?.data || err.message;
      openModal({ type: "error", title: "Update failed", body });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(`Delete company "${formData.companyName}"? This action cannot be undone.`);
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await axios.delete(`/api/company/${id}`, { withCredentials: true });
      openModal({ type: "success", title: "Deleted", body: res.data?.message || "Company deleted." });
      // redirect to dashboard after short delay to allow user to read modal
      setTimeout(() => {
        navigate("/system/dashboard");
      }, 900);
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      const body = err.response?.data?.message || err.message;
      openModal({ type: "error", title: "Delete failed", body });
    } finally {
      setDeleting(false);
    }
  };

  // Loading state render
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <SystemAdminNavbar />
        <div className="flex items-center justify-center h-64">
          <p>Loading company...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#101828" }}>
      <SystemAdminNavbar />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 text-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <motion.img
            src={formData.logoUrl || "/logo-white.svg"}
            alt={formData.companyName}
            className="h-16 w-auto sm:h-20 md:h-24 drop-shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-10 text-yellow-400">
          Manage Company Profile
        </h1>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm shadow-lg">
          <MetaItem label="Created At" value={formData.createdAt} />
          <MetaItem label="Last Updated" value={formData.lastUpdated || ""} />
          <MetaItem label="Date of Incorporation" value={formData.dateOfIncorporation} />
          <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-gray-300">Status</span>
            <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${formData.status === "Active" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
              {formData.status}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 text-sm sm:text-base">
          {/* Basic Information */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
              <Select name="companyType" value={formData.companyType} onChange={handleChange} options={["Private Limited", "Public Limited", "Partnership", "LLP", "Sole Proprietorship"]} />
              <Input type="date" name="dateOfIncorporation" value={formData.dateOfIncorporation} onChange={handleChange} />
              <Input name="mainBusinessActivity" value={formData.mainBusinessActivity} onChange={handleChange} placeholder="Main Business Activity" />
            </div>
          </Section>

          {/* Registration */}
          <Section title="Registration Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Registration Number" />
              <Input name="cinNumber" value={formData.cinNumber} onChange={handleChange} placeholder="CIN Number" />
              <Input name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="PAN Number" />
              <Input name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number" />
            </div>
          </Section>

          {/* Financial & Management */}
          <Section title="Financial & Management">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input type="number" name="authorisedCapital" value={formData.authorisedCapital} onChange={handleChange} placeholder="Authorised Capital" />
              <Input type="number" name="paidUpCapital" value={formData.paidUpCapital} onChange={handleChange} placeholder="Paid Up Capital" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input name="directors" value={formData.directors} onChange={handleChange} placeholder="Directors (comma separated)" />
              <Input type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} placeholder="Number of Employees" />
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full mt-3 px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white" placeholder="Company Description" />
          </Section>

          {/* Address */}
          <Section title="Registered Address">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input name="registeredAddress" value={formData.registeredAddress} onChange={handleChange} placeholder="Registered Address" />
              <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
              <Input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
              <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
            </div>
          </Section>

          {/* Admin Login */}
          <Section title="Admin Login">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input type="email" name="loginEmail" value={formData.loginEmail} onChange={handleChange} placeholder="Admin Email" />
              <Input type="password" name="loginPassword" value={formData.loginPassword} onChange={handleChange} placeholder="Admin Password (set only to change)" />
            </div>
          </Section>

          {/* Contact & Banking */}
          <Section title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Company Email" />
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
              <Input name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
              <Input name="socialMedia" value={formData.socialMedia} onChange={handleChange} placeholder="Social Media" />
            </div>
          </Section>

          <Section title="Banking Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" />
              <Input name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" />
              <Input name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account Number" />
              <Input name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
            </div>
          </Section>

          {/* Features */}
          <Section title="Features">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {Object.keys(features).map((featureKey) => (
                <label key={featureKey} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                  <input type="checkbox" name={featureKey} checked={features[featureKey]} onChange={handleFeatureChange} className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-yellow-400" />
                  <span className="capitalize">{featureKey.replace(/([A-Z])/g, " $1")}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Other */}
          <Section title="Other Details">
            <Select name="status" value={formData.status} onChange={handleChange} options={["Active", "Inactive"]} />
          </Section>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={handleDelete} className="px-4 sm:px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500">
              {deleting ? "Deleting..." : "Delete Company"}
            </motion.button>

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="px-4 sm:px-6 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400">
              {saving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
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
                    {modalType === "success" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    ) : modalType === "error" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /></svg>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">{modalTitle}</h3>
                    <p className="text-sm text-gray-200 mt-1">{modalType === "success" ? "Operation completed." : "See details below."}</p>
                  </div>
                </div>

                <button onClick={closeModal} className="text-gray-300 hover:text-white rounded-md p-2" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="mt-4 max-h-72 overflow-auto">
                {typeof modalBody === "string" || typeof modalBody === "number" ? (
                  <pre className="whitespace-pre-wrap text-sm text-white bg-gray-900/30 p-3 rounded">{String(modalBody)}</pre>
                ) : modalBody && typeof modalBody === "object" ? (
                  <pre className="whitespace-pre-wrap text-sm text-white bg-gray-900/30 p-3 rounded">{JSON.stringify(modalBody, null, 2)}</pre>
                ) : (
                  <div className="text-sm text-white">No additional details provided.</div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button onClick={() => closeModal()} className="px-4 py-2 rounded-md bg-gray-700 border border-gray-600 hover:bg-gray-600 text-white">Close</button>
                {modalType === "success" && <button onClick={() => { closeModal(); navigate("/system/dashboard"); }} className="px-4 py-2 rounded-md bg-green-600 text-black font-medium hover:bg-green-700">Go to Dashboard</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable small components */
const Section = ({ title, children }) => (
  <div>
    <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-yellow-400">{title}</h2>
    {children}
  </div>
);

const Input = ({ type = "text", name, value, onChange, placeholder, className = "" }) => (
  <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`px-3 sm:px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white text-sm sm:text-base w-full ${className}`} />
);

const Select = ({ name, value, onChange, options }) => (
  <select name={name} value={value} onChange={onChange} className="px-3 sm:px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white text-sm sm:text-base w-full">
    {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
  </select>
);

const MetaItem = ({ label, value }) => (
  <div className="flex flex-col items-center text-center">
    <span className="font-semibold text-gray-300">{label}</span>
    <span className="text-white">{value}</span>
  </div>
);
