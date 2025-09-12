// SystemAdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import SystemAdminNavbar from "./SystemAdminNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Dashboard Component
export default function SystemAdminDashboard() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  // Fetch all companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/company/all", {
          withCredentials: true, // ✅ ensures cookies (token) are sent
        });
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          // not authenticated -> redirect to login
          navigate("/login");
        }
      }
    };
    fetchCompanies();
  }, [navigate]);

  // Filtering logic
  const filteredCompanies = companies.filter((company) => {
    const query = search.toLowerCase();
    const matchFields =
      company.companyName.toLowerCase().includes(query) ||
      company.cinNumber.toLowerCase().includes(query) ||
      company.registrationNumber.toLowerCase().includes(query);

    const matchStatus =
      filter === "All" ? true : company.status.toLowerCase() === filter.toLowerCase();

    return matchFields && matchStatus;
  });

  // Infinite scroll
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredCompanies.length) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 4);
            setLoading(false);
          }, 600);
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredCompanies.length, loading]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <SystemAdminNavbar />

      {/* Header */}
      <div className="flex justify-center items-center px-4 md:px-8 py-4">
        <h1 className="text-lg md:text-2xl font-bold text-center">
          SYSTEM ADMINISTRATOR DASHBOARD
        </h1>
      </div>

      {/* Search & Filter */}
      <div className="flex justify-center mb-6 px-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center 
                        bg-gray-800 rounded-lg px-4 py-3 gap-3 w-full md:w-3/4 lg:w-2/3 shadow">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-sm md:text-base w-full sm:w-auto"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input
            type="text"
            placeholder="Search by Name, CIN, or Registration No."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-gray-600 text-sm md:text-base focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 w-full"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-4 md:px-8 pb-10">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.slice(0, visibleCount).map((company) => (
            <div
              key={company._id}
              className="bg-gray-800 rounded-xl p-5 shadow-md flex flex-col justify-between 
                         transition duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-400 border border-transparent"
            >
              <div className="flex justify-between items-start">
                <img
                  src={company.logoUrl || "/logo-white.svg"}
                  alt={company.companyName}
                  className="h-10 w-auto object-contain"
                />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${company.status === "Active"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                    }`}
                >
                  {company.status}
                </span>
              </div>

              <div className="mt-4 text-sm space-y-1">
                <p><span className="font-semibold">Name:</span> {company.companyName}</p>
                <p><span className="font-semibold">CIN:</span> {company.cinNumber}</p>
                <p><span className="font-semibold">Reg No:</span> {company.registrationNumber}</p>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  onClick={() => navigate(`/system/company/${company._id}`)}
                  className="border border-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black transition"
                >
                  Manage
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400 text-sm md:text-base">
            No companies found.
          </p>
        )}
      </div>

      {/* Loading & Load More */}
      <div ref={loaderRef} className="flex justify-center">
        {loading && <p className="text-gray-400 pb-6">Loading more...</p>}
      </div>

      {visibleCount < filteredCompanies.length && !loading && (
        <div className="flex justify-center pb-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-5 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
