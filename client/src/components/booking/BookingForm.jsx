import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import { toast } from "react-toastify";

const BookingForm = ({ stationId, station, onSuccess, onClose }) => {
  const { API, authorizationToken } = useAuth();
  const [form, setForm] = useState({
    portId: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [availablePorts, setAvailablePorts] = useState([]);

  // Get current date for min datetime input
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const adjustedDate = new Date(now.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().slice(0, 16);
  };

  // Get available ports from station
  useEffect(() => {
    console.log("Station totalPorts:", station.totalPorts);//undefined
    if (station?.ports) {
      setAvailablePorts(station.ports);
      if (station.ports.length > 0) {
        console.log("Setting port ID to:", station.ports[0].portNumber);
        setForm(prev => ({ ...prev, portId: station.ports[0].portNumber }));
      }
    } else if (station?.totalPorts) {
      console.log("Generating port numbers for total ports:", station.totalPorts);
      // Generate port numbers if ports array not available
      const ports = Array.from({ length: station.totalPorts }, (_, i) => ({
        portNumber: i + 1
      }));
      setAvailablePorts(ports);
      setForm(prev => ({ ...prev, portId: 1 }));
    }
  }, [station]);

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime, durationHours) => {
    if (!startTime || !durationHours) return "";
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (durationHours * 60 * 60 * 1000));
    const offset = end.getTimezoneOffset();
    const adjustedEnd = new Date(end.getTime() - (offset * 60 * 1000));
    return adjustedEnd.toISOString().slice(0, 16);
  };

  // Handle duration change
  const handleDurationChange = (duration) => {
    if (form.startTime) {
      const endTime = calculateEndTime(form.startTime, parseInt(duration));
      setForm(prev => ({ ...prev, endTime }));
    }
  };

  // Handle start time change
  const handleStartTimeChange = (startTime) => {
    setForm(prev => ({ ...prev, startTime }));
    // If we have the current end time, calculate duration and maintain it
    if (form.endTime) {
      const start = new Date(startTime);
      const end = new Date(form.endTime);
      const duration = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
      const newEndTime = calculateEndTime(startTime, duration);
      setForm(prev => ({ ...prev, endTime: newEndTime }));
    }
  };

  const formatDateTimeForAPI = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    
    // Ensure the date is valid
    if (isNaN(date.getTime())) {
      toast.error("Invalid date selected");
      return '';
    }

    // Convert to ISO 8601 format with timezone (Z for UTC)
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.portId || !form.startTime || !form.endTime) {
      toast.error("Please fill all required fields");
      return;
    }

    const startTime = new Date(form.startTime);
    const endTime = new Date(form.endTime);
    const now = new Date();

    if (startTime < now) {
      toast.error("Start time must be in the future");
      return;
    }

    if (endTime <= startTime) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/api/availability/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          stationId,
          portId: parseInt(form.portId),
          startTime: formatDateTimeForAPI(form.startTime),
          endTime: formatDateTimeForAPI(form.endTime),
        }),
      });

      const data = await response.json();
      console.log("Booking data:", data);

      if (response.ok) {
        toast.success("Booking request sent successfully!");
        setForm({ portId: availablePorts[0]?.portNumber || "", startTime: "", endTime: "" });
        onSuccess?.();
        onClose?.();
      } else {
        toast.error(data.message || "Failed to create booking request");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickDurationButtons = [1, 2, 4, 6, 8, 12];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Book Charging Port</h3>
            <p className="text-sm text-gray-500">{station?.name || "Charging Station"}</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Port Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Port
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={form.portId}
              onChange={(e) => setForm({ ...form, portId: e.target.value })}
              required
            >
              <option value="">Choose a port</option>
              {availablePorts.map((port) => (
                <option key={port.portNumber} value={port.portNumber}>
                  Port {port.portNumber}
                </option>
              ))}
            </select>
            <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            min={getCurrentDateTime()}
            required
          />
        </div>

        {/* Quick Duration Selection */}
        {form.startTime && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (hours)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {quickDurationButtons.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => handleDurationChange(hours)}
                  className="py-2 px-3 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            min={form.startTime || getCurrentDateTime()}
            required
          />
        </div>

        {/* Duration Display */}
        {form.startTime && form.endTime && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-blue-800 font-medium">
                Duration: {Math.ceil((new Date(form.endTime) - new Date(form.startTime)) / (1000 * 60 * 60))} hours
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-3">
          {onClose && (
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !form.portId || !form.startTime || !form.endTime}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Booking...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Request Booking</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;