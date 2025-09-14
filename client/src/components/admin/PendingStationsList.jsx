import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import Button  from "../ui/Button";

const PendingStationsList = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingStations();
      setStations(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch pending stations.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleApprove = async (id) => {
    await adminService.approveStation(id);
    fetchStations();
  };
  const handleReject = async (id) => {
    await adminService.rejectStation(id);
    fetchStations();
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!stations.length) return <div className="text-center py-8 text-gray-500">No pending stations.</div>;

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-blue-100">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Location</th>
            <th className="py-2 px-4">Owner</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station._id} className="border-b">
              <td className="py-2 px-4">{station.name}</td>
              <td className="py-2 px-4">{station.location}</td>
              <td className="py-2 px-4">{station.ownerName || "-"}</td>
              <td className="py-2 px-4 flex gap-2">
                <Button color="success" onClick={() => handleApprove(station._id)}>
                  Approve
                </Button>
                <Button color="danger" onClick={() => handleReject(station._id)}>
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingStationsList;


