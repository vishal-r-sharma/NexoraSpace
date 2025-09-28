import React, { useState } from "react";

const CompanySetting = () => {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    autoAssignTasks: false,
    weeklySummaryEmail: true,
    darkTheme: true,
    showExperimentalFeatures: false,
    twoFactorAuth: false,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        enabled ? "bg-purple-600" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const SettingItem = ({ title, description, settingKey, enabled }) => (
    <div className="flex items-center justify-between p-6 bg-gray-800 rounded-lg shadow hover:shadow-xl transition">
      <div className="flex-1 pr-4">
        <h3 className="text-white font-medium mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <ToggleSwitch enabled={enabled} onChange={() => handleToggle(settingKey)} />
    </div>
  );

  return (
    <div className="text-white">
      {/* ✅ Profile Header */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between shadow-lg">
        {/* Profile Info */}
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-purple-600"
          />
          <div>
            <h2 className="text-2xl font-bold">John Smith</h2>
            <p className="text-purple-400 font-medium">Company Admin</p>
            <p className="text-sm text-gray-400">johnsmith@company.com</p>
          </div>
        </div>
        {/* Logout */}
        <button className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow">
          Logout
        </button>
      </div>

      {/* Settings */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Preferences and account options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-6">
          <SettingItem
            title="Enable Notifications"
            description="Email and in-app alerts"
            settingKey="enableNotifications"
            enabled={settings.enableNotifications}
          />
          <SettingItem
            title="Auto-assign new tasks"
            description="Distribute evenly across staff"
            settingKey="autoAssignTasks"
            enabled={settings.autoAssignTasks}
          />
          <SettingItem
            title="Weekly summary email"
            description="Sent every Monday"
            settingKey="weeklySummaryEmail"
            enabled={settings.weeklySummaryEmail}
          />
        </div>

        {/* Right */}
        <div className="space-y-6">
          <SettingItem
            title="Two-factor authentication"
            description="Protect your account with 2FA"
            settingKey="twoFactorAuth"
            enabled={settings.twoFactorAuth}
          />
          <SettingItem
            title="Dark theme"
            description="Default is enabled"
            settingKey="darkTheme"
            enabled={settings.darkTheme}
          />
          <SettingItem
            title="Show experimental features"
            description="Might be unstable"
            settingKey="showExperimentalFeatures"
            enabled={settings.showExperimentalFeatures}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanySetting;