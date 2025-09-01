import React, { useState, useEffect, useRef } from "react";
import SystemAdminNavbar from "./SystemAdminNavbar";

const companiesData = [
  { id: 1, name: "NexoraSpace Pvt Ltd.", uid: "U47734TS2024PTC182276", nid: "NEX123456", status: "Active", logo: "/logo-white.svg" },
  { id: 2, name: "InnoTech Solutions", uid: "U12345TS2024PTC182277", nid: "INO987654", status: "Active", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { id: 3, name: "FutureX Pvt Ltd.", uid: "U54321TS2024PTC182278", nid: "FUT654321", status: "Inactive", logo: "/logo-white.svg" },
  { id: 4, name: "Global Ventures Ltd.", uid: "U67890TS2024PTC182279", nid: "GLO112233", status: "Active", logo: "/logo-white.svg" },
  { id: 5, name: "NextGen Pvt Ltd.", uid: "U13579TS2024PTC182280", nid: "NEX998877", status: "Inactive", logo: "/logo-white.svg" },
  { id: 6, name: "Alpha Technologies", uid: "U24680TS2024PTC182281", nid: "ALP445566", status: "Active", logo: "/logo-white.svg" },
  { id: 7, name: "Visionary Labs", uid: "U11223TS2024PTC182282", nid: "VIS778899", status: "Active", logo: "/logo-white.svg" },
  { id: 8, name: "BlueOcean Corp", uid: "U33445TS2024PTC182283", nid: "BLU223344", status: "Inactive", logo: "/logo-white.svg" },
  { id: 9, name: "GreenEnergy Pvt Ltd.", uid: "U55667TS2024PTC182284", nid: "GRE667788", status: "Active", logo: "/logo-white.svg" },
];

export default function SystemAdminDashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  // Filtering logic
  const filteredCompanies = companiesData.filter((company) => {
    const query = search.toLowerCase();
    const matchFields =
      company.name.toLowerCase().includes(query) ||
      company.uid.toLowerCase().includes(query) ||
      company.nid.toLowerCase().includes(query);

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

  // Auto-fill for big screens
  useEffect(() => {
    if (
      document.documentElement.scrollHeight <= window.innerHeight &&
      visibleCount < filteredCompanies.length
    ) {
      setVisibleCount((prev) => prev + 4);
    }
  }, [visibleCount, filteredCompanies.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300">
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
            className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 
                       text-sm md:text-base w-full sm:w-auto"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input
            type="text"
            placeholder="Search by Name, UID or NID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-gray-600 
                       text-sm md:text-base focus:ring-2 focus:ring-yellow-400 outline-none 
                       bg-gray-700 w-full"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-4 md:px-8 pb-10">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.slice(0, visibleCount).map((company) => (
            <div
              key={company.id}
              className="bg-gray-800 rounded-xl p-5 shadow-md flex flex-col justify-between 
                         transition duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-400 border border-transparent"
            >
              <div className="flex justify-between items-start">
                <img src={company.logo} alt={company.name} className="h-10 w-auto object-contain" />
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
                <p><span className="font-semibold">Name:</span> {company.name}</p>
                <p><span className="font-semibold">UID:</span> {company.uid}</p>
                <p><span className="font-semibold">NID:</span> {company.nid}</p>
              </div>

              <div className="flex justify-end mt-5">
                <button className="border border-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 hover:text-black transition">
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
