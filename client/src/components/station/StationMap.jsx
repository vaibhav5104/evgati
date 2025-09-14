import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { stationService } from '../../services/stationService';
import StationCard from './StationCard';
import LoadingSpinner from '../common/LoadingSpinner';

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
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {stations.map(station => (
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
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{station.name}</h3>
                <p className="text-sm text-gray-600">{station.location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedStation && (
        <div className="absolute bottom-4 left-4 right-4 z-50">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <StationCard 
              station={selectedStation} 
              variant="compact" 
              onClose={() => setSelectedStation(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StationMap;
