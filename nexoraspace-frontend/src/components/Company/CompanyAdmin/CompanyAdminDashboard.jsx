import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import SideMenu from './SideMenu';

function CompanyAdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const pieData = [
    { id: 'Active', label: 'Active Projects', value: 12 },
    { id: 'Completed', label: 'Completed Projects', value: 18 },
    { id: 'Pending', label: 'Pending Projects', value: 5 }
  ];

  const barData = [
    { month: 'Jan', income: 42000, expense: 32000 },
    { month: 'Feb', income: 38000, expense: 29000 },
    { month: 'Mar', income: 46000, expense: 34000 },
    { month: 'Apr', income: 52000, expense: 39000 }
  ];

  const lineData = [
    {
      id: 'Employee Growth',
      data: [
        { x: '2021', y: 20 },
        { x: '2022', y: 35 },
        { x: '2023', y: 50 },
        { x: '2024', y: 65 }
      ]
    }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <SideMenu />

      <div className="flex-1 p-4 pt-18 md:p-8 overflow-auto custom-scrollbar">
        
        {/* 🌟 Top Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow rounded-2xl p-4 mb-6 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-700">{greeting()}</h2>
          <div className="flex items-center text-gray-600 mt-2 md:mt-0">
            <Calendar className="mr-2 text-blue-500" />
            <span className="text-md font-medium">
              {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Dashboard Title */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
          Company Performance Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: 'Total Employees', value: '120', color: 'text-blue-500' },
            { label: 'Total Projects', value: '35', color: 'text-cyan-500' },
            { label: 'Active Projects', value: '12', color: 'text-yellow-500' },
            { label: 'Total Income', value: '₹52,00,000', color: 'text-lime-600' }
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 text-center"
              title={card.label}
            >
              <h3 className="text-lg font-semibold text-gray-700">{card.label}</h3>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pie Chart */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 md:p-6 rounded-3xl shadow h-[350px] md:h-[400px]">
            <h2 className="flex items-center text-lg md:text-xl font-semibold mb-4 text-gray-700 border-l-4 border-blue-400 pl-3">
              <PieChart className="mr-2 text-blue-500" /> Project Status Overview
            </h2>
            <ResponsivePie
              data={pieData}
              margin={{ top: 20, right: 60, bottom: 60, left: 60 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'paired' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableArcLinkLabels={true}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              tooltip={({ datum }) => (
                <div className="bg-white p-2 rounded shadow text-sm text-gray-700">
                  <strong>{datum.label}</strong>: {datum.value}
                </div>
              )}
            />
          </div>

          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-white to-green-50 p-4 md:p-6 rounded-3xl shadow h-[350px] md:h-[400px]">
            <h2 className="flex items-center text-lg md:text-xl font-semibold mb-4 text-gray-700 border-l-4 border-green-400 pl-3">
              <BarChart3 className="mr-2 text-green-500" /> Monthly Income vs Expense
            </h2>
            <ResponsiveBar
              data={barData}
              keys={["income", "expense"]}
              indexBy="month"
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'category10' }}
              axisBottom={{
                legend: 'Month',
                legendPosition: 'middle',
                legendOffset: 40
              }}
              axisLeft={{
                legend: 'Amount',
                legendPosition: 'middle',
                legendOffset: -50
              }}
              tooltip={({ id, value, indexValue }) => (
                <div className="bg-white p-2 rounded shadow text-sm text-gray-700">
                  <strong>{id}</strong> in {indexValue}: ₹{value}
                </div>
              )}
              enableGridY={true}
            />
          </div>

          {/* Line Chart */}
          <div className="bg-gradient-to-br from-white to-purple-50 p-4 md:p-6 rounded-3xl shadow h-[350px] md:h-[400px] lg:col-span-2">
            <h2 className="flex items-center text-lg md:text-xl font-semibold mb-4 text-gray-700 border-l-4 border-purple-400 pl-3">
              <TrendingUp className="mr-2 text-purple-500" /> Employee Growth Over Years
            </h2>
            <ResponsiveLine
              data={lineData}
              margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
              colors={{ scheme: 'set2' }}
              axisBottom={{
                legend: 'Year',
                legendPosition: 'middle',
                legendOffset: 40
              }}
              axisLeft={{
                legend: 'Employees',
                legendPosition: 'middle',
                legendOffset: -50
              }}
              pointSize={8}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enableGridX={false}
              enableGridY={true}
              useMesh={true}
              tooltip={({ point }) => (
                <div className="bg-white p-2 rounded shadow text-sm text-gray-700">
                  <strong>{point.data.xFormatted}</strong>: {point.data.yFormatted} employees
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyAdminDashboard;
