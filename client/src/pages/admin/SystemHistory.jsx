import React, { useEffect, useState } from "react";
import { historyService } from "../../services/historyService";
import { stationService } from "../../services/stationService";

const SystemHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch system history + station names
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await historyService.getAdminHistory();
        const historyArray = data.history || [];

        // No need to fetch station again because populate already gives stationId.name
        const logsWithStationNames = historyArray.map((log) => {
          return {
            ...log,
            stationName: log.stationId?.name ?? "Unknown Station"
          };
        });

        setLogs(logsWithStationNames);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch system history.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);


  if (loading) return <div className="p-6">Loading system history...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!logs.length)
    return <div className="p-6 text-gray-500">No history records found yet.</div>;

  return (
    <div className="min-h-screen bg-white p-6 md:mt-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        System History
      </h1>

      <ul className="divide-y divide-gray-200">
        {logs.map((log, idx) => (
          <li key={log._id || idx} className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* Station & Port */}
              <div>
                <p className="text-gray-800 font-semibold">
                  {log.stationName} — Port {log.portId}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      log.status === "accepted"
                        ? "text-green-600"
                        : log.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {log.status.toUpperCase()}
                  </span>
                </p>
              </div>

              {/* Time */}
              <div className="text-sm text-gray-400">
                {log.startTime && (
                  <p>
                    {new Date(log.startTime).toLocaleString()} →{" "}
                    {new Date(log.endTime).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Owner / User Info */}
            <div className="mt-2 text-sm text-gray-500">
              <p>
                <strong>Owner:</strong> {log.ownerId?.name} (
                {log.ownerId?.email})
              </p>
              <p>
                <strong>User:</strong> {log.userId?.name} ({log.userId?.email})
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemHistory;
