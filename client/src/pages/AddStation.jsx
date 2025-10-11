import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { stationService } from "../services/stationService";
import { useAuth } from "../hooks/useAuth";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for new station
const newStationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks
const LocationSelector = ({ position, setPosition }) => {
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? <Marker position={position} icon={newStationIcon} /> : null;
};

const AddStation = () => {
  const { user } = useAuth();
  const mapRef = useRef();
  const [form, setForm] = useState({
    name: "",
    location: {
      address: "",
      latitude: "",
      longitude: ""
    },
    totalPorts: "",
    pricing: {
      perHour: "",
      perKWh: ""
    },
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState([28.6139, 77.2090]); // Default to Delhi
  const [markerPosition, setMarkerPosition] = useState(null);

  // Update form when marker position changes
  React.useEffect(() => {
    if (markerPosition) {
      setForm(prev => ({
        ...prev,
        location: {
          ...prev.location,
          latitude: markerPosition[0].toFixed(6),
          longitude: markerPosition[1].toFixed(6)
        }
      }));
    }
  }, [markerPosition]);

  // Reverse geocoding to get address
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setForm(prev => ({
          ...prev,
          location: {
            ...prev.location,
            address: data.display_name
          }
        }));
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  React.useEffect(() => {
    if (markerPosition) {
      getAddressFromCoords(markerPosition[0], markerPosition[1]);
    }
  }, [markerPosition]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parsedValue
        }
      }));
    } else {
      setForm({ ...form, [name]: parsedValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construct payload
      const payload = {
        ...form,
        location: {
          ...form.location,
          latitude: Number(form.location.latitude),
          longitude: Number(form.location.longitude)
        },
        totalPorts: Number(form.totalPorts),
        pricing: {
          perHour: Number(form.pricing.perHour),
          perKWh: Number(form.pricing.perKWh)
        },
        ports: Array.from({ length: Number(form.totalPorts) }, (_, i) => ({
          portNumber: i + 1,
          bookings: []
        })),
        status: "pending",
        owner: user?._id
      };

      await stationService.createStation(payload);
      alert("Station added successfully! Waiting for admin approval.");

      // Reset form
      setForm({
        name: "",
        location: { address: "", latitude: "", longitude: "" },
        totalPorts: "",
        pricing: { perHour: "", perKWh: "" },
        description: ""
      });
      setMarkerPosition(null);
    } catch (error) {
      console.error("Add station error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add station");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" 
              alt="Add Station" 
              className="w-12 h-12 mr-3"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Add New Charging Station
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Expand the charging network by adding your station to our platform
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png" 
                  alt="Location" 
                  className="w-8 h-8 mr-3"
                />
                <h2 className="text-xl font-semibold">Select Station Location</h2>
              </div>
              <p className="text-blue-100 mt-2">
                Click on the map to choose the exact location for your charging station
              </p>
            </div>
            
            <div className="p-6">
              <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                <MapContainer 
                  center={mapPosition} 
                  zoom={12} 
                  scrollWheelZoom={true}
                  className="h-full w-full"
                  ref={mapRef}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationSelector 
                    position={markerPosition} 
                    setPosition={setMarkerPosition} 
                  />
                </MapContainer>
              </div>
              
              {markerPosition && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/535/535239.png" 
                      alt="Success" 
                      className="w-5 h-5 mr-2"
                    />
                    <span className="font-medium">Location Selected!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Coordinates: {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png" 
                  alt="Form" 
                  className="w-8 h-8 mr-3"
                />
                <h2 className="text-xl font-semibold">Station Information</h2>
              </div>
              <p className="text-green-100 mt-2">
                Fill in the details about your charging station
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Station Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                  <div className="flex items-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3176/3176366.png" 
                      alt="Station" 
                      className="w-4 h-4 mr-2"
                    />
                    Station Name *
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700"
                  placeholder="Enter station name"
                  required
                />
              </div>

              {/* Address */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                  <div className="flex items-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/684/684908.png" 
                      alt="Address" 
                      className="w-4 h-4 mr-2"
                    />
                    Address *
                  </div>
                </label>
                <textarea
                  name="location.address"
                  value={form.location.address}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 resize-none"
                  rows={3}
                  placeholder="Address will be auto-filled when you select location on map"
                  required
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="location.latitude"
                    value={form.location.latitude}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="28.6139"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="location.longitude"
                    value={form.location.longitude}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="77.2090"
                    required
                  />
                </div>
              </div>

              {/* Total Ports */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" 
                      alt="Ports" 
                      className="w-4 h-4 mr-2"
                    />
                    Total Charging Ports *
                  </div>
                </label>
                <input
                  type="number"
                  min="1"
                  name="totalPorts"
                  value={form.totalPorts}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="4"
                  required
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                        alt="Price" 
                        className="w-4 h-4 mr-2"
                      />
                      Price per Hour (₹)
                    </div>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="pricing.perHour"
                    value={form.pricing.perHour}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="50.00"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/3176/3176380.png" 
                        alt="kWh" 
                        className="w-4 h-4 mr-2"
                      />
                      Price per kWh (₹)
                    </div>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="pricing.perKWh"
                    value={form.pricing.perKWh}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="12.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3176/3176366.png" 
                      alt="Description" 
                      className="w-4 h-4 mr-2"
                    />
                    Description
                  </div>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 resize-none"
                  rows={4}
                  placeholder="Describe your station (amenities, accessibility, etc.)"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  <div className="flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Adding Station...
                      </>
                    ) : (
                      <>
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png" 
                          alt="Add" 
                          className="w-5 h-5 mr-3"
                        />
                        Add Station for Review
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828833.png" 
                    alt="Info" 
                    className="w-5 h-5 mr-3 mt-0.5"
                  />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Review Process</h4>
                    <p className="text-blue-600 text-sm">
                      Your station will be reviewed by our admin team before being published. 
                      You'll be notified once it's approved and live on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStation;