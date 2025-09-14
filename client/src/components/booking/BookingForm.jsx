import React, { useState } from "react";
import { bookingService } from "../../services/bookingService";
import Button from "../ui/Button";

const BookingForm = ({ stationId, onSuccess }) => {
  const [form, setForm] = useState({
    requestedTime: "",
    duration: 1,
    portType: "AC",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookingService.createBooking({ ...form, stationId });
      onSuccess?.();
    } catch (error) {
      console.error("Booking error:", error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Requested Time</label>
        <input
          type="datetime-local"
          className="w-full border rounded px-3 py-2"
          value={form.requestedTime}
          onChange={(e) => setForm({...form, requestedTime: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Duration (hours)</label>
        <input
          type="number"
          min="1"
          className="w-full border rounded px-3 py-2"
          value={form.duration}
          onChange={(e) => setForm({...form, duration: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Port Type</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.portType}
          onChange={(e) => setForm({...form, portType: e.target.value})}
        >
          <option value="AC">AC</option>
          <option value="DC">DC</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message (optional)</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={form.message}
          onChange={(e) => setForm({...form, message: e.target.value})}
          rows={3}
        />
      </div>
      <Button type="submit" color="primary" disabled={loading}>
        {loading ? "Booking..." : "Request Booking"}
      </Button>
    </form>
  );
};

export default BookingForm;


