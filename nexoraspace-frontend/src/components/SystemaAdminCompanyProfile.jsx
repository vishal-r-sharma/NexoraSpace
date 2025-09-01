import React, { useState } from "react";
import { motion } from "framer-motion";
import SystemAdminNavbar from "./SystemAdminNavbar";

export default function SystemAdminCompanyProfile() {
    // Example company data
    const [formData, setFormData] = useState({
        companyName: "NexoraSpace Pvt Ltd.",
        companyType: "Private Limited",
        registrationNumber: "ROC123456",
        panNumber: "ABCDE1234F",
        gstNumber: "29ABCDE1234F2Z5",
        cinNumber: "U47734TS2024PTC182276",
        dateOfIncorporation: "2024-02-15",
        authorisedCapital: "10,00,000",
        paidUpCapital: "8,00,000",
        directors: "Vishal Sharma, John Doe",
        mainBusinessActivity: "SaaS Development",
        numberOfEmployees: "120",
        description:
            "NexoraSpace is a secure multi-tenant SaaS platform for enterprises and startups.",
        registeredAddress: "123 Tech Park, Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        country: "India",
        email: "info@nexoraspace.com",
        phone: "+91 9876543210",
        website: "https://nexoraspace.com",
        socialMedia: "https://linkedin.com/company/nexoraspace",
        bankName: "HDFC Bank",
        accountNumber: "1234567890",
        ifscCode: "HDFC0001234",
        branch: "Tech Park Branch",
        logoUrl: "/logo-white.svg",
        status: "Active",
        loginEmail: "admin@nexoraspace.com",
        loginPassword: "********",
        createdAt: "2024-02-20",
        expiryDate: "2025-02-20",
        lastUpdated: "2024-09-01",
    });

    const [features, setFeatures] = useState({
        employeeManagement: true,
        projectManagement: true,
        billingSystem: false,
        inventoryManagement: false,
        crm: true,
        analytics: true,
        hrManagement: false,
        payrollSystem: true,
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
        console.log("Updated Company Data:", formData);
        console.log("Updated Features:", features);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#101828" }}>
            <SystemAdminNavbar />

            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 text-gray-100">
                {/* Logo */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <motion.img
                        src={formData.logoUrl}
                        alt={formData.companyName}
                        className="h-16 w-auto sm:h-20 md:h-24 drop-shadow-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-10 text-yellow-400">
                    Manage Company Profile
                </h1>

                {/* Company Metadata */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-8 sm:mb-10 
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs sm:text-sm 
                        shadow-lg hover:shadow-yellow-500/10 transition">
                    <MetaItem label="Created At" value={formData.createdAt} />
                    <MetaItem label="Expiry Date" value={formData.expiryDate} />
                    <MetaItem label="Last Updated" value={formData.lastUpdated} />
                    <div className="flex flex-col items-center text-center">
                        <span className="font-semibold text-gray-300">Status</span>
                        <span
                            className={`mt-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-center w-fit ${formData.status === "Active"
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white"
                                }`}
                        >
                            {formData.status}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 shadow-lg hover:shadow-yellow-500/10 transition text-sm sm:text-base"
                >
                    {/* Sections */}
                    <Section title="Basic Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
                            <Select name="companyType" value={formData.companyType} onChange={handleChange} options={["Private Limited", "Public Limited", "Partnership", "LLP", "Sole Proprietorship"]} />
                            <Input type="date" name="dateOfIncorporation" value={formData.dateOfIncorporation} onChange={handleChange} />
                            <Input name="mainBusinessActivity" value={formData.mainBusinessActivity} onChange={handleChange} placeholder="Main Business Activity" />
                        </div>
                    </Section>

                    <Section title="Registration Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            <Input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Registration Number" />
                            <Input name="cinNumber" value={formData.cinNumber} onChange={handleChange} placeholder="CIN Number" />
                            <Input name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="PAN Number" />
                            <Input name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number" />
                        </div>
                    </Section>

                    <Section title="Financial & Management">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Input name="authorisedCapital" value={formData.authorisedCapital} onChange={handleChange} placeholder="Authorised Capital" />
                            <Input name="paidUpCapital" value={formData.paidUpCapital} onChange={handleChange} placeholder="Paid Up Capital" />
                            <Input name="directors" value={formData.directors} onChange={handleChange} placeholder="Directors" className="sm:col-span-2" />
                            <Input type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} placeholder="Number of Employees" />
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white text-sm sm:text-base"
                            placeholder="Company Description"
                        />
                    </Section>

                    <Section title="Registered Address">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Input name="registeredAddress" value={formData.registeredAddress} onChange={handleChange} placeholder="Registered Address" className="sm:col-span-2" />
                            <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                            <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                            <Input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
                            <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                        </div>
                    </Section>

                    <Section title="Admin Login">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Input type="email" name="loginEmail" value={formData.loginEmail} onChange={handleChange} placeholder="Admin Email" />
                            <Input type="password" name="loginPassword" value={formData.loginPassword} onChange={handleChange} placeholder="Admin Password" />
                        </div>
                    </Section>

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

                    <Section title="Features">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {Object.keys(features).map((featureKey) => (
                                <label key={featureKey} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                                    <input
                                        type="checkbox"
                                        name={featureKey}
                                        checked={features[featureKey]}
                                        onChange={handleFeatureChange}
                                        className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-600 bg-gray-900 text-yellow-400"
                                    />
                                    <span className="capitalize">{featureKey.replace(/([A-Z])/g, " $1")}</span>
                                </label>
                            ))}
                        </div>
                    </Section>

                    <Section title="Other Details">
                        <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={["Active", "Inactive"]}
                        />
                    </Section>

                    <div className="flex gap-3 sm:gap-4 justify-end">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="px-4 sm:px-6 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition text-sm sm:text-base"
                        >
                            Save Changes
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* 🔹 Reusable Components */
const Section = ({ title, children }) => (
    <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-yellow-400">{title}</h2>
        {children}
    </div>
);

const Input = ({ type = "text", name, value, onChange, placeholder, className = "" }) => (
    <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 sm:px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white text-sm sm:text-base w-full ${className}`}
    />
);

const Select = ({ name, value, onChange, options }) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className="px-3 sm:px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white text-sm sm:text-base w-full"
    >
        {options.map((opt) => (
            <option key={opt}>{opt}</option>
        ))}
    </select>
);

const MetaItem = ({ label, value }) => (
    <div className="flex flex-col items-center text-center">
        <span className="font-semibold text-gray-300">{label}</span>
        <span>{value}</span>
    </div>
);
