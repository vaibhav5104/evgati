import React from "react";

const metrics = [
  { label: "API Uptime", value: "99.98%" },
  { label: "Avg. Response Time", value: "120ms" },
  { label: "Active Sessions", value: 56 },
  { label: "Errors (24h)", value: 2 },
];

const SystemMetrics = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
    {metrics.map((metric) => (
      <div key={metric.label} className="bg-green-50 rounded-lg shadow p-4 flex flex-col items-center">
        <span className="text-2xl font-bold text-green-700">{metric.value}</span>
        <span className="text-gray-600 mt-1">{metric.label}</span>
      </div>
    ))}
  </div>
);

export default SystemMetrics;


