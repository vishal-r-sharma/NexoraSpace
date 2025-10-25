import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import { Calendar, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

function CompanyAdminDashboard() {
  const { userId, companyid } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    employees: [],
    projects: [],
    invoices: [],
    aiChats: [],
  });

  // ⏰ Live Clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 🎯 Greeting
  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  // 🧠 Fetch Dashboard Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [empRes, projRes, billRes, aiRes] = await Promise.all([
          api.get(`/api/company/data/employee/list/${companyid}`),
          api.get(`/api/company/data/projects`),
          api.get(`/api/company/data/billing/list/${companyid}`),
          api.get(`/api/company/data/aichat/history`),
        ]);

        setSummary({
          employees: empRes?.data?.employees || [],
          projects: projRes?.data?.projects || [],
          invoices: billRes?.data?.invoices || [],
          aiChats: aiRes?.data?.chats || [],
        });
      } catch (err) {
        console.error("❌ Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [companyid]);

  /* -------------------------------------------------
     🧮 Chart Data Computation
  ------------------------------------------------- */

  // 🥧 Project Status Pie Data
  const pieData = Object.entries(
    summary.projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    id: status,
    label: status,
    value: count,
  }));

  // 💰 Billing Bar Data (Paid vs Pending)
  const barData = [
    {
      label: "Invoices",
      paid: summary.invoices.filter((i) => i.status === "Paid").length,
      pending: summary.invoices.filter((i) => i.status !== "Paid").length,
    },
  ];

  // 📈 Employee Growth (By Joining Year)
  const growthCount = {};
  summary.employees.forEach((e) => {
    const year = new Date(e.joiningDate).getFullYear();
    growthCount[year] = (growthCount[year] || 0) + 1;
  });
  const lineData = [
    {
      id: "Employees",
      data: Object.entries(growthCount).map(([year, count]) => ({
        x: year,
        y: count,
      })),
    },
  ];

  // 🤖 AI Usage Over Time (by lastInteractionAt)
  const aiUsageCount = {};
  summary.aiChats.forEach((chat) => {
    const date = new Date(chat.lastInteractionAt).toLocaleDateString("en-GB");
    aiUsageCount[date] = (aiUsageCount[date] || 0) + 1;
  });
  const aiLineData = [
    {
      id: "AI Usage",
      data: Object.entries(aiUsageCount).map(([date, count]) => ({
        x: date,
        y: count,
      })),
    },
  ];

  // 💵 Income Summary
  const totalIncome = summary.invoices.reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );
  const totalPaid = summary.invoices.reduce(
    (sum, i) => sum + (i.paidAmount || 0),
    0
  );

  /* -------------------------------------------------
     🧩 UI
  ------------------------------------------------- */

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-700">
        <div className="text-lg font-semibold animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* 🌟 Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow rounded-2xl p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-700">{greeting()}</h2>
          <div className="flex items-center text-gray-600 mt-2 md:mt-0">
            <Calendar className="mr-2 text-blue-500" />
            <span>
              {currentTime.toLocaleDateString()} •{" "}
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Dashboard Title */}
        <h1 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
          Company Performance Dashboard
        </h1>

        {/* Summary Cards (OLD Design) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            {
              label: "Total Employees",
              value: summary.employees.length,
              color: "text-blue-500",
            },
            {
              label: "Total Projects",
              value: summary.projects.length,
              color: "text-cyan-500",
            },
            {
              label: "Total Invoices",
              value: summary.invoices.length,
              color: "text-yellow-500",
            },
            {
              label: "AI Sessions",
              value: summary.aiChats.length,
              color: "text-purple-500",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 text-center"
              title={card.label}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {card.label}
              </h3>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 🥧 Project Status Pie Chart */}
          <div className="bg-white p-5 rounded-3xl shadow h-[400px]">
            <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-700 border-l-4 border-blue-400 pl-3">
              <PieChart className="mr-2 text-blue-500" /> Project Status Overview
            </h2>
            {pieData.length > 0 ? (
              <ResponsivePie
                data={pieData}
                margin={{ top: 20, right: 60, bottom: 60, left: 60 }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={3}
                colors={{ scheme: "set2" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              />
            ) : (
              <p className="text-gray-500 text-center mt-10">
                No project data available
              </p>
            )}
          </div>

          {/* 💰 Billing Summary */}
          <div className="bg-white p-5 rounded-3xl shadow h-[400px]">
            <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-700 border-l-4 border-green-400 pl-3">
              <BarChart3 className="mr-2 text-green-500" /> Invoice Summary
            </h2>
            <ResponsiveBar
              data={barData}
              keys={["paid", "pending"]}
              indexBy="label"
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: "paired" }}
              axisBottom={{
                legend: "Invoices",
                legendPosition: "middle",
                legendOffset: 40,
              }}
              axisLeft={{
                legend: "Count",
                legendPosition: "middle",
                legendOffset: -50,
              }}
            />
            <div className="text-center mt-4 text-gray-600 text-sm">
              Total Income: ₹{totalIncome.toLocaleString()} | Paid: ₹
              {totalPaid.toLocaleString()}
            </div>
          </div>

          {/* 🤖 AI Usage Over Time */}
          <div className="bg-white p-5 rounded-3xl shadow h-[400px] lg:col-span-2">
            <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-700 border-l-4 border-indigo-400 pl-3">
              🤖 AI Usage Over Time
            </h2>
            {aiLineData[0].data.length > 0 ? (
              <ResponsiveLine
                data={aiLineData}
                margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto" }}
                colors={{ scheme: "category10" }}
                pointSize={8}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                useMesh={true}
              />
            ) : (
              <p className="text-gray-500 text-center mt-10">
                No AI usage data available
              </p>
            )}
          </div>

          {/* 📈 Employee Growth */}
          <div className="bg-white p-5 rounded-3xl shadow h-[400px] lg:col-span-2">
            <h2 className="flex items-center text-lg font-semibold mb-4 text-gray-700 border-l-4 border-purple-400 pl-3">
              <TrendingUp className="mr-2 text-purple-500" /> Employee Growth
              Over Years
            </h2>
            {lineData[0].data.length > 0 ? (
              <ResponsiveLine
                data={lineData}
                margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto" }}
                colors={{ scheme: "set2" }}
                pointSize={8}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                useMesh={true}
              />
            ) : (
              <p className="text-gray-500 text-center mt-10">
                Not enough employee data
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyAdminDashboard;
