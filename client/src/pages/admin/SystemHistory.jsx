import React, { useEffect, useState } from "react";
import { historyService } from "../../services/historyService";

const SystemHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await historyService.getAdminHistory();
        setLogs(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch system history.");
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">System History</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {logs.map((log, idx) => (
            <li key={idx} className="py-2">
              <span className="font-semibold text-gray-700">{log.action}</span> -
              <span className="text-gray-500 ml-2">{log.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SystemHistory;
