import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { stationService } from "../services/stationService";
import { bookingService } from "../services/bookingService";
import { availabilityService } from "../services/availabilityService";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { toast } from "react-toastify";

const BookingPage = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [station, setStation] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Booking form state
  const [form, setForm] = useState({
    portId: "",
    startTime: "",
    endTime: "",
    message: ""
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (stationId) {
      fetchStationData();
    }
  }, [stationId]);

  const fetchStationData = async () => {
    setLoading(true);
    try {
      const [stationData, availabilityData] = await Promise.all([
        stationService.getStationById(stationId),
        availabilityService.getAvailability(stationId)
      ]);
      
      setStation(stationData);
      setAvailability(availabilityData);
      console.log("Station Data:", stationData);
      console.log("Availability Data:", availabilityData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch station data");
      toast.error("Failed to load station information");
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.portId) {
      newErrors.portId = "Please select a port";
    }
    
    if (!form.startTime) {
      newErrors.startTime = "Start time is required";
    } else {
      const start = new Date(form.startTime);
      const now = new Date();
      if (start <= now) {
        newErrors.startTime = "Start time must be in the future";
      }
    }
    
    if (!form.endTime) {
      newErrors.endTime = "End time is required";
    } else if (form.startTime && form.endTime) {
      const start = new Date(form.startTime);
      const end = new Date(form.endTime);
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    if (!user) {
      toast.error("Please login to book a station");
      navigate("/login");
      return;
    }
    
    setBookingLoading(true);
    try {
      const bookingData = {
        stationId,
        portId: parseInt(form.portId),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString()
      };
      
      await bookingService.createBooking(bookingData);
      toast.success("Booking request sent successfully! Waiting for owner approval.");
      
      // Reset form
      setForm({
        portId: "",
        startTime: "",
        endTime: "",
        message: ""
      });
      
      // Refresh availability
      fetchStationData();
      
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to create booking");
    }
    setBookingLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const getPortStatus = (portNumber) => {
    if (!availability) return "available";
    
    const isOccupied = availability.occupiedPorts?.includes(portNumber.toString());
    const hasPendingBooking = availability.bookings?.some(
      booking => booking.portId === portNumber && booking.status === "pending"
    );
    
    if (isOccupied) return "occupied";
    if (hasPendingBooking) return "pending";
    return "available";
  };

  const getPortStatusColor = (status) => {
    switch (status) {
      case "available": return "success";
      case "occupied": return "danger";
      case "pending": return "warning";
      default: return "secondary";
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading station details..." />
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Station not found"}</p>
          <Button onClick={() => navigate("/stations")}>
            Back to Stations
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{station.name}</h1>
          <p className="text-gray-600">{station.location?.address}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Station Information */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Station Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Ports:</span>
                  <span className="font-medium">{station.totalPorts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={station.status === "accepted" ? "success" : "warning"}>
                    {station.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Ports:</span>
                  <span className="font-medium">
                    {station.totalPorts - (availability?.occupiedPorts?.length || 0)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Port Status */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Port Status</h2>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: station.totalPorts }, (_, i) => i + 1).map(portNumber => {
                  const status = getPortStatus(portNumber);
                  return (
                    <div
                      key={portNumber}
                      className={`p-3 rounded-lg border-2 ${
                        form.portId === portNumber.toString()
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Port {portNumber}</span>
                        <Badge variant={getPortStatusColor(status)}>
                          {status}
                        </Badge>
                      </div>
                      {status === "available" && (
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, portId: portNumber.toString() }))}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Current Bookings */}
            {availability?.bookings && availability.bookings.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold mb-4">Current Bookings</h2>
                <div className="space-y-2">
                  {availability.bookings.map((booking, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Port {booking.portId}</p>
                          <p className="text-sm text-gray-600">
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </p>
                        </div>
                        <Badge variant={getPortStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold mb-4">Book This Station</h2>
              
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Please login to book a station</p>
                  <Button onClick={() => navigate("/login")}>
                    Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Port Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Port *
                    </label>
                    <select
                      name="portId"
                      value={form.portId}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.portId ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Choose a port</option>
                      {Array.from({ length: station.totalPorts }, (_, i) => i + 1).map(portNumber => {
                        const status = getPortStatus(portNumber);
                        return (
                          <option
                            key={portNumber}
                            value={portNumber}
                            disabled={status !== "available"}
                          >
                            Port {portNumber} - {status}
                          </option>
                        );
                      })}
                    </select>
                    {errors.portId && (
                      <p className="text-red-500 text-sm mt-1">{errors.portId}</p>
                    )}
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.startTime ? "border-red-500" : "border-gray-300"
                      }`}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
                    )}
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        errors.endTime ? "border-red-500" : "border-gray-300"
                      }`}
                      min={form.startTime || new Date().toISOString().slice(0, 16)}
                      required
                    />
                    {errors.endTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="Any special requests or notes for the station owner..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    color="primary"
                    disabled={bookingLoading || !form.portId || !form.startTime || !form.endTime}
                    className="w-full"
                  >
                    {bookingLoading ? "Sending Request..." : "Request Booking"}
                  </Button>
                </form>
              )}
            </Card>

            {/* Booking Info */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Booking Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Your booking request will be sent to the station owner for approval</p>
                <p>• You'll receive a notification once the owner responds</p>
                <p>• You can cancel your request before it's approved</p>
                <p>• Make sure to arrive on time for your booking</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;


