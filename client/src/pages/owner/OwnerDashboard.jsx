import React from "react";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

const OwnerDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <h1 className="text-3xl font-bold text-green-700 mb-6">Owner Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-green-50 rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-2xl font-bold text-green-700">12</span>
        <span className="text-gray-600 mt-1">My Stations</span>
      </div>
      <div className="bg-green-50 rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-2xl font-bold text-green-700">5</span>
        <span className="text-gray-600 mt-1">Pending Requests</span>
      </div>
      <div className="bg-green-50 rounded-lg shadow p-6 flex flex-col items-center">
        <span className="text-2xl font-bold text-green-700">₹8,200</span>
        <span className="text-gray-600 mt-1">Revenue</span>
      </div>
    </div>
    <div className="flex gap-4">
      <Link to="/owner/stations"><Button color="primary">My Stations</Button></Link>
      <Link to="/owner/requests"><Button color="secondary">Booking Requests</Button></Link>
      <Link to="/owner/analytics"><Button color="success">Analytics</Button></Link>
    </div>
  </div>
);

export default OwnerDashboard;
