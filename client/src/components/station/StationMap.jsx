import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

// Custom marker icons based on station status
const createCustomIcon = (station) => {
  let color = '#10B981'; // Green for accepted
  let iconSymbol = '⚡';
  
  if (station.status === 'pending') {
    color = '#F59E0B'; // Yellow for pending
  } else if (station.status === 'rejected') {
    color = '#EF4444'; // Red for rejected
  }
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 16px;
        cursor: pointer;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        ${iconSymbol}
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const StationMap = ({ stations = [], onMarkerClick, center, zoom = 5 }) => {
  const mapCenter = center || [20.5937, 78.9629]; // Default to India center

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {stations.map((station) => (
          <Marker
            key={station._id}
            position={[station.location.latitude, station.location.longitude]}
            icon={createCustomIcon(station)}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(station),
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-2 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {station.name}
                  </h3>
                  <Badge variant={station.status || 'success'} size="sm">
                    {station.status || 'Active'}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {station.location.address}
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {station.totalPorts} {station.totalPorts === 1 ? "Port" : "Ports"}
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkerClick && onMarkerClick(station);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Legend</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs">⚡</div>
            <span>Accepted Station</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2 flex items-center justify-center text-white text-xs">⚡</div>
            <span>Pending Approval</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2 flex items-center justify-center text-white text-xs">⚡</div>
            <span>Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationMap;
