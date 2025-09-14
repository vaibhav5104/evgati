import React, { useEffect, useState } from "react";
import { historyService } from "../../services/historyService";
import { BookingHistory as BookingHistoryComponent } from "../../components/booking";

const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await historyService.getUserHistory();
        setHistory(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch booking history.");
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">Booking History</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <BookingHistoryComponent bookings={history} />
      )}
    </div>
  );
};

export default BookingHistory;
