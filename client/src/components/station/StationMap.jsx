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
  initialCenter = [20.5937, 78.9629], // Default to India's center
  zoom = 5,
  onStationSelect
}) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const fetchedStations = await stationService.getAllStations();
        setStations(fetchedStations);
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleMarkerClick = (station) => {
    setSelectedStation(station);
    onStationSelect?.(station);
  };

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
      minZoom={3}                          // ⬅ PREVENT over-zoom-out
      maxBounds={[[-85, -180], [85, 180]]} // ⬅ Lock map inside world bounds
      maxBoundsViscosity={1.0}             // ⬅ Prevent dragging outside
    >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          noWrap={true}
        />
        
        {stations.map(station => {
  // Calculate available ports
  const availablePorts = station.totalPorts - (station.ports?.filter(p => 
    p.bookings?.some(b => b.status === 'active')
  ).length || 0);


  return (
    <Marker
      key={station._id}
      position={[
        station.location.latitude, 
        station.location.longitude
      ]}
      icon={stationIcon}
      eventHandlers={{
        click: () => handleMarkerClick(station)
      }}
    >
      <Popup
        minWidth={280}
        maxWidth={320}
        className="custom-popup"
      >
        <div className="p-1">
          {/* Header with Icon */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
                {station.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="line-clamp-2">{station.location.address}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200/50">
              <div className="text-lg font-bold text-green-600">{station.totalPorts}</div>
              <div className="text-xs text-gray-600">Total Ports</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-2 border border-blue-200/50">
              <div className="text-lg font-bold text-blue-600">{availablePorts}</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
          </div>

          {/* Status Badge */}
          {availablePorts > 0 ? (
            <div className="flex items-center gap-1.5 mb-3 px-2 py-1 bg-green-50 rounded-md border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-green-700">Available Now</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mb-3 px-2 py-1 bg-red-50 rounded-md border border-red-200">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xs font-semibold text-red-700">Fully Booked</span>
            </div>
          )}

          {/* Pricing */}
          {station.pricing?.perHour > 0 && (
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₹{station.pricing.perHour}
              </span>
              <span className="text-xs text-gray-500 font-medium">/hour</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const url = `https://www.google.com/maps?q=${station.location.latitude},${station.location.longitude}`;
                window.open(url, '_blank');
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-sm font-medium text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Navigate</span>
            </button>
            <Button
              onClick={() => navigate(`/stations/${station._id}`)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium text-white shadow-md hover:shadow-lg"
            >
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            {/* <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate(`/stations/${station._id}`)}
            >
              View Details
            </Button> */}
          </div>

          {/* Rating if available */}
          {station.rating?.average > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-3.5 h-3.5 ${
                      index < Math.floor(station.rating.average)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 fill-current'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-900">{station.rating.average.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({station.rating.count})</span>
            </div>
          )}
        </div>

        {/* Custom Styles for Leaflet Popup */}
        <style jsx>{`
          :global(.custom-popup .leaflet-popup-content-wrapper) {
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            padding: 8px;
          }
          :global(.custom-popup .leaflet-popup-content) {
            margin: 0;
            width: 100% !important;
          }
          :global(.custom-popup .leaflet-popup-tip) {
            box-shadow: 0 3px 14px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </Popup>
    </Marker>
  );
})}
      </MapContainer>

      {/* {selectedStation && (
      <div className="absolute bottom-4 left-4 right-4 z-50 w-fit">

          <MapStationCard
            station={selectedStation}
            onRemove={() => setSelectedStation(null)}
          />

      </div>
    )} */}
    </div>
  );
};

export default StationMap;
