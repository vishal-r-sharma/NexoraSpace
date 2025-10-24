// SystemAdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import SystemAdminNavbar from "./SystemAdminNavbar";
import { useNavigate } from "react-router-dom";
// use your configured axios instance
import api from "../api/axios";

export default function SystemAdminDashboard() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]); // expected array from API: { success:true, companies: [...] }
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  // <-- default visible cards when page first shows (changed to 8)
  const [visibleCount, setVisibleCount] = useState(8);
  const [isFetching, setIsFetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCompanies = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const url = "/api/company/all";

        // helpful debug: compute full URL for logging (works with baseURL or relative)
        const fullUrl = api.defaults.baseURL ? `${api.defaults.baseURL.replace(/\/$/, "")}${url}` : url;
        // eslint-disable-next-line no-console
        console.debug("[API] GET", fullUrl);

        // use the configured instance (withCredentials/proxy/timeout etc)
        const res = await api.get(url, { signal: controller.signal });

        const payload = res?.data;

        // Normal / expected server shape: { success: true, companies: [...] }
        if (payload && payload.success && Array.isArray(payload.companies)) {
          const sanitized = payload.companies.map((c) => {
            const copy = { ...c };
            if (copy.loginPassword) delete copy.loginPassword;
            return copy;
          });
          setCompanies(sanitized);
          return;
        }

        // fallback: maybe the API returned array directly
        if (Array.isArray(payload)) {
          setCompanies(payload);
          return;
        }

        // detect HTML returned (index.html) — common when proxy/baseURL misconfigured
        if (typeof payload === "string" && payload.trim().toLowerCase().startsWith("<!doctype")) {
          console.warn("Received HTML (index.html) from API request — frontend is hitting the SPA server, not the backend API.");
          setError("Bad API response: received HTML. Check API base URL or dev proxy.");
          setCompanies([]);
          return;
        }

        // Other fallback shapes
        if (payload && payload.success && Array.isArray(payload.result)) {
          setCompanies(payload.result);
          return;
        }
        if (payload && Array.isArray(payload.data)) {
          setCompanies(payload.data);
          return;
        }
        if (payload && Array.isArray(payload.companies)) {
          setCompanies(payload.companies);
          return;
        }

        if (payload && typeof payload === "object" && (payload.companyName || payload._id || payload.cinNumber)) {
          setCompanies([payload]);
          console.warn("API returned single company object — wrapped into array.");
          return;
        }

        console.warn("Unexpected /api/company/all response shape. Falling back to empty list.", payload);
        setError("Unexpected API response shape.");
        setCompanies([]);
      } catch (err) {
        if (api.isCancel?.(err) || err?.name === "CanceledError") {
          return;
        }

        // if the response body is HTML string (index.html) detect and show helpful message
        if (err?.response && typeof err.response.data === "string" && err.response.data.trim().toLowerCase().startsWith("<!doctype")) {
          console.error("API returned HTML page (index.html). You probably need to set API_BASE or dev proxy.");
          setError("API returned HTML page. Check API_BASE or dev proxy (see console).");
          setCompanies([]);
          setIsFetching(false);
          return;
        }

        const status = err?.response?.status;
        if (status === 401) {
          navigate("/system/login");
          return;
        }

        const serverMsg = err?.response?.data?.message || err?.response?.data || err.message;
        console.error("Error fetching companies:", serverMsg);
        setError(String(serverMsg || "Failed to load companies"));
        setCompanies([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCompanies();
    return () => controller.abort();
  }, [navigate]);

  // Defensive: ensure companies is an array before filtering
  const companiesArray = Array.isArray(companies) ? companies : [];

  // derive status options from returned companies for filter select
  const derivedStatuses = Array.from(
    new Set(companiesArray.map((c) => (c.status ? String(c.status).trim() : "Unknown")))
  ).filter(Boolean);
  const statusOptions = ["All", ...derivedStatuses];

  // Filtering logic with guards for missing fields
  const filteredCompanies = companiesArray.filter((company) => {
    const safeToLower = (v) => (v ? String(v).toLowerCase() : "");

    const query = safeToLower(search);
    const name = safeToLower(company.companyName);
    const cin = safeToLower(company.cinNumber);
    const reg = safeToLower(company.registrationNumber);

    const matchFields = name.includes(query) || cin.includes(query) || reg.includes(query);

    const statusVal = safeToLower(company.status);
    const matchStatus = filter === "All" ? true : statusVal === safeToLower(filter);

    return matchFields && matchStatus;
  });

  // Infinite scroll: observe loaderRef and reveal more items
  useEffect(() => {
    if (loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredCompanies.length) {
          setLoadingMore(true);
          // small simulated delay for UX
          setTimeout(() => {
            // add 4 more on each scroll intersection
            setVisibleCount((prev) => prev + 4);
            setLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredCompanies.length, loadingMore]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SystemAdminNavbar />

      <div className="flex justify-center items-center px-4 md:px-8 py-4">
        <h1 className="text-lg md:text-2xl font-bold text-center">SYSTEM ADMINISTRATOR DASHBOARD</h1>
      </div>

      <div className="flex justify-center mb-6 px-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-800 rounded-lg px-4 py-3 gap-3 w-full md:w-3/4 lg:w-2/3 shadow">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              // reset visibleCount to initial 8 when filter changes
              setVisibleCount(8);
            }}
            className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-sm md:text-base w-full sm:w-auto"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by Name, CIN, or Registration No."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // reset visibleCount to initial 8 when search changes
              setVisibleCount(8);
            }}
            className="flex-1 px-3 py-2 rounded-md border border-gray-600 text-sm md:text-base focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 w-full"
          />
        </div>
      </div>

      {/* Error or loading */}
      <div className="px-4 md:px-8">
        {isFetching && <p className="text-gray-400 text-sm md:text-base text-center">Loading companies...</p>}
        {error && !isFetching && <p className="text-red-400 text-sm md:text-base text-center">Error: {error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-4 md:px-8 pb-10">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.slice(0, visibleCount).map((company) => (
            <div
              key={company._id || company.id}
              className="bg-gray-800 rounded-xl p-5 shadow-md flex flex-col justify-between transition duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-400 border border-transparent"
            >
              <div className="flex justify-between items-start">
                <img src={company.logoUrl || "/logo-white.svg"} alt={company.companyName || "Company logo"} className="h-10 w-auto object-contain" />
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${String(company.status).toLowerCase() === "active" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                  {company.status || "Unknown"}
                </span>
              </div>

              <div className="mt-4 text-sm space-y-1">
                <p><span className="font-semibold">Name:</span> {company.companyName || "-"}</p>
                <p><span className="font-semibold">CIN:</span> {company.cinNumber || "-"}</p>
                <p><span className="font-semibold">Reg No:</span> {company.registrationNumber || "-"}</p>
              </div>

              <div className="flex justify-end mt-5">
                <button onClick={() => navigate(`/system/company/${company._id || company.id}`)} className="border border-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black transition">
                  Manage
                </button>
              </div>
            </div>
          ))
        ) : (
          !isFetching &&
          !error && <p className="text-center col-span-full text-gray-400 text-sm md:text-base">No companies found.</p>
        )}
      </div>

      <div ref={loaderRef} className="flex justify-center">
        {loadingMore && <p className="text-gray-400 pb-6">Loading more...</p>}
      </div>

      {visibleCount < filteredCompanies.length && !loadingMore && (
        <div className="flex justify-center pb-10">
          <button onClick={() => setVisibleCount((prev) => prev + 4)} className="px-5 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
