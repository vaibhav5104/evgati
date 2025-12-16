import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { stationService } from '../../services/stationService';
import LoadingSpinner from '../common/LoadingSpinner';
// import MapStationCard from './MapStationCard';
import { Button } from '../ui';
import { useNavigate } from "react-router-dom";

// Custom marker icon
const stationIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const StationMap = ({
  initialCenter = [20.5937, 78.9629],
  zoom = 5,
  onStationSelect,
  stations: stationsProp // ⬅ NEW
}) => {
  const [stations, setStations] = useState(stationsProp || []);
  const [loading, setLoading] = useState(!stationsProp);
  const navigate = useNavigate();

  const getActiveBookingsCount = (port) =>
  port.bookings?.filter(b => b.status === "active").length || 0;

  const getAvailablePorts = (station) => {
    if (!station.ports || station.ports.length === 0) return station.totalPorts;

    const busyPorts = station.ports.filter(
      port => getActiveBookingsCount(port) > 0
    ).length;

    return Math.max(station.totalPorts - busyPorts, 0);
  };

  const getStationAvailabilityStatus = (station) => {
    if (station.status !== "accepted") return "inactive";

    const availablePorts = getAvailablePorts(station);
    return availablePorts > 0 ? "available" : "full";
  };


  useEffect(() => {
    // If stations are passed via props, do not fetch
    if (stationsProp) {
      setStations(stationsProp);
      setLoading(false);
      return;
    }

    const fetchStations = async () => {
      try {
        const fetchedStations = await stationService.getAllStations();
        setStations(fetchedStations);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [stationsProp]);

  if (loading) {
    return <LoadingSpinner text="Loading stations..." />;
  }

  return (
    <div className="w-full h-[600px] relative">
      <MapContainer
        center={initialCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full z-10"
        minZoom={3}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          noWrap
        />

        {stations.map((station) => {
  const availablePorts = getAvailablePorts(station);
  const availabilityStatus = getStationAvailabilityStatus(station);

  return (
    <Marker
      key={station._id}
      position={[
        station.location.latitude,
        station.location.longitude
      ]}
      icon={stationIcon}
    >
      <Popup minWidth={280} maxWidth={320} className="custom-popup">
        <div className="p-2">

          {/* Station Name */}
          <h3 className="font-bold text-gray-900 text-base mb-1">
            {station.name}
          </h3>

          <p className="text-xs text-gray-600 mb-3">
            {station.location.address}
          </p>

          {/* Ports Info */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-green-50 rounded-lg p-2 border border-green-200/50">
              <div className="text-lg font-bold text-green-600">
                {station.totalPorts}
              </div>
              <div className="text-xs text-gray-600">Total Ports</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200/50">
              <div className="text-lg font-bold text-blue-600">
                {availablePorts}
              </div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
          </div>

          {/* Availability Badge */}
          {availabilityStatus === "available" && (
            <div className="flex items-center gap-2 px-2 py-1 bg-green-50 rounded-md border border-green-200 mb-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-green-700">
                Available Now
              </span>
            </div>
          )}

          {availabilityStatus === "full" && (
            <div className="flex items-center gap-2 px-2 py-1 bg-red-50 rounded-md border border-red-200 mb-3">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-xs font-semibold text-red-700">
                Fully Booked
              </span>
            </div>
          )}

          {availabilityStatus === "inactive" && (
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md border border-gray-300 mb-3">
              <span className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-xs font-semibold text-gray-700">
                Station Inactive
              </span>
            </div>
          )}

          {/* Pricing */}
          {(station.pricing?.perHour > 0 || station.pricing?.perKWh > 0) && (
            <div className="mb-3 text-sm font-semibold text-gray-800">
              {station.pricing.perHour > 0 && `₹${station.pricing.perHour}/hr `}
              {station.pricing.perKWh > 0 && `₹${station.pricing.perKWh}/kWh`}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => navigate(`/stations/${station._id}`)}
            className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
          >
            View Station
          </button>
        </div>
      </Popup>
    </Marker>
  );
})}

      </MapContainer>
    </div>
  );
};
export default StationMap;