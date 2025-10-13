import React, { useState } from "react";
import SideMenu from "./SideMenu";
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  Landmark,
  CreditCard,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function CompanySetting() {
  const [settings, setSettings] = useState({
    companyName: "NexoraSpace Pvt. Ltd.",
    companyType: "Private Limited",
    userName: "Vishal Sharma",
    email: "vishal@nexoraspace.com",
    password: "********",
    phone: "+91 98765 43210",
    companyEmail: "support@nexoraspace.com",
    website: "https://nexoraspace.com",
    bankName: "HDFC Bank",
    accountNumber: "12345678901234",
    ifscCode: "HDFC0000456",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = () => {
    alert("✅ Settings updated successfully!");
  };

  const featureList = [
    { name: "Employee Management", active: true },
    { name: "Project Management", active: false },
    { name: "Billing System", active: true },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SideMenu />

      <div className="flex-1 p-6 md:p-10 overflow-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Company Settings
          </h1>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow active:scale-95 transition"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ---------- Left Column ---------- */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card title="Company Information">
              <Input
                label="Company Name"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                icon={<Building2 />}
              />

              <Select
                label="Company Type"
                name="companyType"
                value={settings.companyType}
                onChange={handleChange}
                options={[
                  "Private Limited",
                  "Public Limited",
                  "LLP",
                  "Sole Proprietorship",
                  "Partnership",
                ]}
              />
            </Card>

            {/* Admin Info */}
            <Card title="Admin / CEO Profile">
              <Input
                label="Full Name"
                name="userName"
                value={settings.userName}
                onChange={handleChange}
                icon={<User />}
              />
              <Input
                label="Email Address"
                name="email"
                value={settings.email}
                onChange={handleChange}
                icon={<Mail />}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={settings.password}
                onChange={handleChange}
                icon={<Lock />}
              />
            </Card>
          </div>

          {/* ---------- Right Column ---------- */}
          <div className="space-y-6">
            {/* Bank Details */}
            <Card title="Bank Account Details">
              <Input
                label="Bank Name"
                name="bankName"
                value={settings.bankName}
                onChange={handleChange}
                icon={<Landmark />}
              />
              <Input
                label="Account Number"
                name="accountNumber"
                value={settings.accountNumber}
                onChange={handleChange}
                icon={<CreditCard />}
              />
              <Input
                label="IFSC Code"
                name="ifscCode"
                value={settings.ifscCode}
                onChange={handleChange}
              />
            </Card>

            {/* Contact Info */}
            <Card title="Contact Information">
              <Input
                label="Company Email"
                name="companyEmail"
                value={settings.companyEmail}
                onChange={handleChange}
                icon={<Mail />}
              />
              <Input
                label="Phone Number"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                icon={<Phone />}
              />
              <Input
                label="Website URL"
                name="website"
                value={settings.website}
                onChange={handleChange}
                icon={<Globe />}
              />
            </Card>
          </div>
        </div>

        {/* ---------- Feature Access ---------- */}
        <Card title="Feature Access Overview">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureList.map((feature, i) => (
              <div
                key={i}
                className={`flex items-center justify-between border rounded-xl px-4 py-3 transition-all ${
                  feature.active
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 bg-gray-50 text-gray-600"
                }`}
              >
                <p className="font-medium text-base">{feature.name}</p>
                {feature.active ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-gray-400" size={20} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg mt-5 p-3">
            To activate additional features, contact{" "}
            <a
              href="mailto:contact@vishalsharmadev.in"
              className="font-semibold underline text-blue-600"
            >
              contact@vishalsharmadev.in
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */
const Card = ({ title, children }) => (
  <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ label, name, value, onChange, type = "text", icon }) => (
  <div>
    <label className="block text-sm text-gray-500 mb-1">{label}</label>
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition">
      {icon && <span className="text-blue-500">{icon}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-gray-800 font-medium"
      />
    </div>
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm text-gray-500 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium outline-none"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default CompanySetting;
