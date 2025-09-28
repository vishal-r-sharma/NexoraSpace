import React, { useState } from "react";

const CompanyReport = () => {
  const [issueTitle, setIssueTitle] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  const submitIssue = (e) => {
    e.preventDefault();
    alert(`
      Issue Reported ✅
      Title: ${issueTitle}
      Severity: ${severity}
      Project: ${project}
      Description: ${description}
      Screenshot: ${screenshot ? screenshot.name : "No file uploaded"}
    `);

    // Reset
    setIssueTitle("");
    setSeverity("Medium");
    setProject("");
    setDescription("");
    setScreenshot(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={submitIssue}
        className="bg-gray-800 p-6 sm:p-10 rounded-lg shadow-lg w-full max-w-2xl space-y-5"
      >
        <h1 className="text-2xl font-bold mb-4 text-purple-400">
          Report a Problem
        </h1>

        {/* Issue Title */}
        <div>
          <label className="block text-sm mb-1">Issue Title</label>
          <input
            type="text"
            value={issueTitle}
            onChange={(e) => setIssueTitle(e.target.value)}
            required
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            placeholder="Enter issue title"
          />
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm mb-1">Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Critical">Critical</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Project */}
        <div>
          <label className="block text-sm mb-1">Project</label>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            required
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">Select project</option>
            <option value="Project A">Project A</option>
            <option value="Project B">Project B</option>
            <option value="Project C">Project C</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
            placeholder="Describe the issue in detail..."
          />
        </div>

        {/* Upload Screenshot */}
        <div>
          <label className="block text-sm mb-1">Upload Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files[0])}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-300 focus:outline-none focus:border-purple-500"
          />
          {screenshot && (
            <p className="mt-2 text-xs text-gray-400">
              Uploaded: {screenshot.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-medium"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default CompanyReport;