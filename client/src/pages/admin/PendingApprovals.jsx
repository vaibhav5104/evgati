import React from "react";
import PendingStationsList from "../../components/admin/PendingStationsList";

const PendingApprovals = () => (
  <div className="min-h-screen bg-white p-6">
    <h1 className="text-2xl font-bold text-blue-600 mb-4">Pending Approvals</h1>
    <PendingStationsList />
  </div>
);

export default PendingApprovals;
