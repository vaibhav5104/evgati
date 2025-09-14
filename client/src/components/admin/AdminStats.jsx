import React from "react";

const stats = [
  { label: "Total Users", value: 1200 },
  { label: "Total Stations", value: 85 },
  { label: "Pending Approvals", value: 7 },
  { label: "Bookings Today", value: 34 },
];

const AdminStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
    {stats.map((stat) => (
      <div key={stat.label} className="bg-blue-50 rounded-lg shadow p-4 flex flex-col items-center">
        <span className="text-2xl font-bold text-blue-700">{stat.value}</span>
        <span className="text-gray-600 mt-1">{stat.label}</span>
      </div>
    ))}
  </div>
);

export default AdminStats;


