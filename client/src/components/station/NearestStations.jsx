import React, { useState, useEffect } from 'react';
import { stationService } from '../../services/stationService';
import { useLocation } from '../../hooks/useLocation';
import StationCard from './StationCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../ui/Button';

const NearestStations = ({ 
  maxStations = 5, 
  maxDistance = 50, 
  onStationSelect 
}) => {
  const { location, error: locationError } = useLocation();
  const [nearestStations, setNearestStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNearestStations = async () => {
      if (!location) return;

      setLoading(true);
      try {
        // Use the existing findNearestStations method
        const result = await stationService.findNearestStations(
          location.latitude, 
          location.longitude
        );
        
        // Handle different response formats from your backend
        let stations = [];
        if (result.nearestStation) {
          // If backend returns single nearest station
          stations = [result.nearestStation];
        } else if (Array.isArray(result)) {
          // If backend returns array of stations
          stations = result;
        } else if (result.stations) {
          // If backend returns object with stations array
          stations = result.stations;
        }

        // Apply client-side filtering for maxStations and maxDistance
        const filteredStations = stations
          .filter(station => {
            // Calculate distance if not provided by backend
            if (result.distanceKm !== undefined) {
              return result.distanceKm <= maxDistance;
            }
            return true; // Skip distance filter if not available
          })
          .slice(0, maxStations);

        setNearestStations(filteredStations);
        setError(null);
      } catch (err) {
        console.error('Error fetching nearest stations:', err);
        
        // Fallback: get all stations and calculate distance client-side
        try {
          const allStations = await stationService.getAllStations();
          const stationsWithDistance = allStations
            .map(station => {
              const distance = calculateDistance(
                location.latitude,
                location.longitude,
                station.location.latitude,
                station.location.longitude
              );
              return { ...station, distance };
            })
            .filter(station => station.distance <= maxDistance)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, maxStations);

          setNearestStations(stationsWithDistance);
          setError(null);
        } catch (fallbackErr) {
          setError('Failed to fetch nearest stations');
          console.error('Fallback error:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNearestStations();
  }, [location, maxDistance, maxStations]);

  // Helper function to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const handleRetry = () => {
    if (location) {
      // Re-fetch data
      setError(null);
      setLoading(true);
      // The useEffect will handle the retry
    } else {
      // Reload to re-request location permission
      window.location.reload();
    }
  };

  if (locationError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="font-medium">Location access denied</p>
            <p className="text-sm mt-1">Please enable location services to find nearby stations.</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRetry}
              className="mt-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner size="md" text="Finding nearest stations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">{error}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRetry}
              className="mt-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Nearest Charging Stations</h2>
        {location && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Within {maxDistance} km
          </div>
        )}
      </div>
      
      {nearestStations.length === 0 ? (
        <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-gray-600 font-medium">No stations found nearby</p>
          <p className="text-gray-500 text-sm mt-1">
            No stations found within {maxDistance} km of your location.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRetry}
            className="mt-3"
          >
            Search Again
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {nearestStations.map((station, index) => (
            <div key={station._id} className="relative">
              <StationCard
                station={station}
                onSelect={() => onStationSelect?.(station)}
                variant="compact"
                className="cursor-pointer hover:shadow-md transition-shadow"
              />
              {station.distance && (
                <div className="absolute top-2 right-2 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                  {station.distance.toFixed(1)} km
                </div>
              )}
            </div>
          ))}
          
          {nearestStations.length === maxStations && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Showing {maxStations} nearest stations
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearestStations;
