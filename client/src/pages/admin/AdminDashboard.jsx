import React from "react";
import AdminStats from "../../components/admin/AdminStats";
import SystemMetrics from "../../components/admin/SystemMetrics";
import PendingStationsList from "../../components/admin/PendingStationsList";
import UserManagement from "../../components/admin/UserManagement";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>
      <AdminStats />
      <SystemMetrics />
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Pending Station Approvals</h2>
        <PendingStationsList />
      </div>
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">User Management</h2>
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
