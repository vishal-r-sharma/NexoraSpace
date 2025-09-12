// SystemAdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import SystemAdminNavbar from "./SystemAdminNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SystemAdminDashboard() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]); // expected array
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/company/all", {
          withCredentials: true,
          timeout: 10000,
        });

        // Normalize response: support multiple server shapes
        const payload = res && res.data;
        console.log("DEBUG: /api/company/all response:", payload);

        // Cases handled:
        // 1) payload is an array -> use it
        // 2) payload.data is an array -> use payload.data
        // 3) payload.companies is an array -> use payload.companies
        // 4) otherwise fallback to [] and log a warning
        let arr = [];
        if (Array.isArray(payload)) {
          arr = payload;
        } else if (payload && Array.isArray(payload.data)) {
          arr = payload.data;
        } else if (payload && Array.isArray(payload.companies)) {
          arr = payload.companies;
        } else if (payload && payload.success && Array.isArray(payload.result)) {
          // some APIs return { success:true, result: [...] }
          arr = payload.result;
        } else {
          // If server returned object with top-level company list keys, try to coerce:
          // If object looks like a single company, wrap it in array
          if (payload && typeof payload === "object" && !Array.isArray(payload)) {
            // Heuristic: if it has companyName or _id then assume single company
            if (payload.companyName || payload._id || payload.cinNumber) {
              arr = [payload];
              console.warn("API returned single company object — wrapped into array.");
            } else {
              // Not any recognized shape — warn and fallback to empty array
              console.warn("Unexpected /api/company/all response shape; expected array. Falling back to empty list.");
              arr = [];
            }
          } else {
            arr = [];
          }
        }

        setCompanies(arr);
      } catch (err) {
        console.error("Error fetching companies:", err && (err.response?.data || err.message));
        // If unauthorized, redirect to login
        const status = err?.response?.status;
        if (status === 401) {
          navigate("/login");
        } else {
          // show empty list but keep UI
          setCompanies([]);
        }
      }
    };

    fetchCompanies();
  }, [navigate]);

  // Defensive: ensure companies is an array before filtering
  const companiesArray = Array.isArray(companies) ? companies : [];

  // Filtering logic with guards for missing fields
  const filteredCompanies = companiesArray.filter((company) => {
    // guard getters and lowercase safely
    const safeToLower = (v) => (v ? String(v).toLowerCase() : "");

    const query = safeToLower(search);
    const name = safeToLower(company.companyName);
    const cin = safeToLower(company.cinNumber);
    const reg = safeToLower(company.registrationNumber);

    const matchFields = name.includes(query) || cin.includes(query) || reg.includes(query);

    const statusVal = safeToLower(company.status);
    const matchStatus = filter === "All" ? true : statusVal === filter.toLowerCase();

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
      <SystemAdminNavbar />

      <div className="flex justify-center items-center px-4 md:px-8 py-4">
        <h1 className="text-lg md:text-2xl font-bold text-center">
          SYSTEM ADMINISTRATOR DASHBOARD
        </h1>
      </div>

      <div className="flex justify-center mb-6 px-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-800 rounded-lg px-4 py-3 gap-3 w-full md:w-3/4 lg:w-2/3 shadow">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-4 md:px-8 pb-10">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.slice(0, visibleCount).map((company) => (
            <div
              key={company._id || company.id}
              className="bg-gray-800 rounded-xl p-5 shadow-md flex flex-col justify-between transition duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-400 border border-transparent"
            >
              <div className="flex justify-between items-start">
                <img
                  src={company.logoUrl || "/logo-white.svg"}
                  alt={company.companyName || "Company logo"}
                  className="h-10 w-auto object-contain"
                />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${company.status === "Active"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                    }`}
                >
                  {company.status || "Unknown"}
                </span>
              </div>

              <div className="mt-4 text-sm space-y-1">
                <p><span className="font-semibold">Name:</span> {company.companyName || "-"}</p>
                <p><span className="font-semibold">CIN:</span> {company.cinNumber || "-"}</p>
                <p><span className="font-semibold">Reg No:</span> {company.registrationNumber || "-"}</p>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  onClick={() => navigate(`/system/company/${company._id || company.id}`)}
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
