import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    lineData: null,
    doughnutData: null,
    barData: null,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      // Original raw inputs (same as your Chart.js data)
      const lineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const lineValues = [1000, 2000, 1500, 3000, 2500];

      const pieLabels = ['Completed', 'Ongoing', 'Pending'];
      const pieValues = [12, 5, 3];
      const pieColors = ['#4ade80', '#60a5fa', '#facc15'];

      const barLabels = ['January', 'February', 'March', 'April', 'May'];
      const barValues = [5000, 7000, 6000, 8000, 7500];
      const barKey = 'Income Over Time'; // keep legend text identical

      // Transform for Nivo
      const nivoLine = [
        {
          id: 'Spending Over Time',
          data: lineLabels.map((x, i) => ({ x, y: lineValues[i] })),
        },
      ];

      const nivoPie = pieLabels.map((label, i) => ({
        id: label,
        label,
        value: pieValues[i],
        color: pieColors[i],
      }));

      const nivoBar = barLabels.map((label, i) => ({
        month: label,
        [barKey]: barValues[i],
      }));

      setData({
        lineData: nivoLine,
        doughnutData: nivoPie,
        barData: { rows: nivoBar, key: barKey },
      });
      setLoading(false);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Responsive chart container classes
  const chartContainerClass = 'w-full h-[200px] sm:h-[250px] md:h-[300px]';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-white text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-1 md:mb-2 text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm sm:text-base">Here's what's happening with your company today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 md:mb-6">
        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm sm:text-base mb-2">Total Employees</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-white">248</span>
            <span className="text-purple-500 text-lg sm:text-xl">👥</span>
          </div>
          <p className="text-xs sm:text-sm text-green-500 mt-1">+5% from last month</p>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm sm:text-base mb-2">Total Projects</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-white">32</span>
            <span className="text-blue-500 text-lg sm:text-xl">📋</span>
          </div>
          <p className="text-xs sm:text-sm text-green-500 mt-1">4 completed this month</p>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm sm:text-base mb-2">Total Spendings</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg sm:text-2xl font-bold text-white">$429,340</span>
            <span className="text-green-500 text-lg sm:text-xl">💰</span>
          </div>
          <p className="text-xs sm:text-sm text-green-500 mt-1">+8.2% from last quarter</p>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm sm:text-base mb-2">Active Projects</h3>
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-white">18</span>
            <span className="text-purple-500 text-lg sm:text-xl">🎯</span>
          </div>
          <p className="text-xs sm:text-sm text-green-500 mt-1">3 due this week</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4 text-white">Total Spendings Over Time</h3>
          <div className={chartContainerClass}>
            <ResponsiveLine
              data={data.lineData}
              margin={{ top: 10, right: 20, bottom: 40, left: 45 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', stacked: false }}
              axisBottom={{ tickSize: 0, tickPadding: 8 }}
              axisLeft={{ tickSize: 0, tickPadding: 8 }}
              enablePoints={true}
              pointSize={6}
              useMesh={true}
              enableArea={true}
              // Keep same colours as Chart.js
              colors={['rgba(75,192,192,1)']}
              areaOpacity={0.2}
              lineWidth={2}
              theme={{
                tooltip: { container: { background: '#1f2937', color: '#fff', border: '1px solid #374151' } },
                axis: { ticks: { text: { fill: '#9CA3AF' } }, legend: { text: { fill: '#9CA3AF' } } },
                grid: { line: { stroke: 'rgba(255,255,255,0.08)' } },
              }}
              gridXValues={[]}
              gridYValues={5}
            />
          </div>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4 text-white">Project Status Distribution</h3>
          <div className={chartContainerClass}>
            <ResponsivePie
              data={data.doughnutData}
              margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
              innerRadius={0.6} // donut
              padAngle={1.5}
              cornerRadius={3}
              activeOuterRadiusOffset={6}
              enableArcLinkLabels={false}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#1f2937"
              colors={{ datum: 'data.color' }} // preserve original colors
              theme={{
                tooltip: { container: { background: '#1f2937', color: '#fff', border: '1px solid #374151' } },
                labels: { text: { fill: '#e5e7eb' } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Full Width Chart */}
      <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold mb-3 md:mb-4 text-white">Total Income Over Time</h3>
        <div className={chartContainerClass}>
          <ResponsiveBar
            data={data.barData.rows}
            keys={[data.barData.key]} // "Income Over Time"
            indexBy="month"
            margin={{ top: 10, right: 20, bottom: 40, left: 45 }}
            padding={0.3}
            colors={() => 'rgba(59, 130, 246, 0.7)'} // keep original bar color
            axisBottom={{ tickSize: 0, tickPadding: 8 }}
            axisLeft={{ tickSize: 0, tickPadding: 8 }}
            enableLabel={false}
            theme={{
              tooltip: { container: { background: '#1f2937', color: '#fff', border: '1px solid #374151' } },
              axis: { ticks: { text: { fill: '#9CA3AF' } }, legend: { text: { fill: '#9CA3AF' } } },
              grid: { line: { stroke: 'rgba(255,255,255,0.08)' } },
            }}
            gridYValues={5}
            role="application"
            ariaLabel="Income Over Time bar chart"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;