import React, { useState, useEffect } from "react";
import SystemAdminNavbar from "./SystemAdminNavbar";

const companiesData = [
  {
    id: 1,
    name: "NexoraSpace Pvt Ltd.",
    uid: "U47734TS2024PTC182276",
    nid: "NEX123456",
    status: "Active",
    logo: "/logo-white.svg",
  },
  {
    id: 2,
    name: "InnoTech Solutions",
    uid: "U12345TS2024PTC182277",
    nid: "INO987654",
    status: "Active",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
  },
  {
    id: 3,
    name: "FutureX Pvt Ltd.",
    uid: "U54321TS2024PTC182278",
    nid: "FUT654321",
    status: "Inactive",
    logo: "/logo-white.svg",
  },
  {
    id: 4,
    name: "Global Ventures Ltd.",
    uid: "U67890TS2024PTC182279",
    nid: "GLO112233",
    status: "Active",
    logo: "/logo-white.svg",
  },
  {
    id: 5,
    name: "NextGen Pvt Ltd.",
    uid: "U13579TS2024PTC182280",
    nid: "NEX998877",
    status: "Inactive",
    logo: "/logo-white.svg",
  },
  {
    id: 6,
    name: "Alpha Technologies",
    uid: "U24680TS2024PTC182281",
    nid: "ALP445566",
    status: "Active",
    logo: "/logo-white.svg",
  },
  {
    id: 7,
    name: "Visionary Labs",
    uid: "U11223TS2024PTC182282",
    nid: "VIS778899",
    status: "Active",
    logo: "/logo-white.svg",
  },
  {
    id: 8,
    name: "BlueOcean Corp",
    uid: "U33445TS2024PTC182283",
    nid: "BLU223344",
    status: "Inactive",
    logo: "/logo-white.svg",
  },
  {
    id: 9,
    name: "GreenEnergy Pvt Ltd.",
    uid: "U55667TS2024PTC182284",
    nid: "GRE667788",
    status: "Active",
    logo: "/logo-white.svg",
  },
  {
    id: 10,
    name: "SkyHigh Enterprises",
    uid: "U77889TS2024PTC182285",
    nid: "SKY556677",
    status: "Inactive",
    logo: "/logo-white.svg",
  },
  {
    id: 11,
    name: "TechNova Systems",
    uid: "U99001TS2024PTC182286",
    nid: "TEC889900",
    status: "Active",
    logo: "/logo-white.svg",
  },
  {
    id: 12,
    name: "Quantum Softworks",
    uid: "U66666TS2024PTC182276",
    nid: "QNT123987",
    status: "Active",
    logo: "/logo-white.svg",
  },
];

export default function SystemAdminDashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);

  // Filtering logic
  const filteredCompanies = companiesData.filter((company) => {
    const query = search.toLowerCase();
    const matchFields =
      company.name.toLowerCase().includes(query) ||
      company.uid.toLowerCase().includes(query) ||
      company.nid.toLowerCase().includes(query);

    const matchStatus =
      filter === "All"
        ? true
        : company.status.toLowerCase() === filter.toLowerCase();

    return matchFields && matchStatus;
  });

  // Infinite scroll (load more)
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 50 &&
        !loading &&
        visibleCount < filteredCompanies.length
      ) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 3);
          setLoading(false);
        }, 800);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, visibleCount, filteredCompanies.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300">
      {/* Navbar */}
      <SystemAdminNavbar />

      {/* Title */}
      <h1 className="text-center text-lg sm:text-xl md:text-2xl font-bold my-3 text-gray-100">
        SYSTEM ADMINISTRATOR DASHBOARD
      </h1>

      {/* Search & Filter */}
      <div className="flex justify-center mb-6 px-3">
        <div className="flex flex-col md:flex-row items-center bg-gray-800 rounded-lg px-3 sm:px-4 py-2 space-y-2 md:space-y-0 md:space-x-3 w-full md:w-3/4 lg:w-2/3 shadow">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 sm:px-3 py-1.5 rounded-md border border-gray-600 bg-gray-700 text-white text-xs sm:text-sm md:text-base"
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
            className="flex-1 px-2 sm:px-3 py-1.5 rounded-md border border-gray-600 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-700 text-white"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 md:px-6 pb-10">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.slice(0, visibleCount).map((company) => (
            <div
              key={company.id}
              className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md flex flex-col justify-between 
                         transform transition duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-400 border border-transparent"
            >
              <div className="flex justify-between items-start">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-6 sm:h-8 md:h-10 w-auto"
                />
                <span
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    company.status === "Active"
                      ? "bg-green-700 text-white"
                      : "bg-red-700 text-white"
                  }`}
                >
                  {company.status}
                </span>
              </div>

              <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-200 space-y-1">
                <p>
                  <span className="font-semibold">Name:</span> {company.name}
                </p>
                <p>
                  <span className="font-semibold">UID:</span> {company.uid}
                </p>
                <p>
                  <span className="font-semibold">NID:</span> {company.nid}
                </p>
              </div>

              <div className="flex justify-end mt-3 sm:mt-4">
                <button className="border border-gray-600 px-2 sm:px-3 md:px-4 py-1 md:py-1.5 rounded-md text-xs sm:text-sm font-medium text-white hover:bg-yellow-400 hover:text-black transition">
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

      {/* Loading Indicator */}
      {loading && (
        <p className="text-center text-gray-400 pb-6">Loading more...</p>
      )}
    </div>
  );
}
