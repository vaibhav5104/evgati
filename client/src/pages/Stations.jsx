import React, { useState, useEffect, useCallback } from "react";
import { stationService } from "../services/stationService";
import { 
  StationCard, 
  StationSearch, 
  StationFilters, 
  StationMap, 
  NearestStations 
} from "../components/station";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/ui/Button";

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list');
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await stationService.getAllStations();
        setStations(data);
        setFilteredStations(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch stations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Wrap in useCallback to prevent infinite re-renders
  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
    setFilteredStations(results);
  }, []);

  // Also wrap handleApplyFilters in useCallback for consistency
  const handleApplyFilters = useCallback((filters) => {
    let filtered = stations;

    if (filters.portType) {
      filtered = filtered.filter(station => 
        station.ports && station.ports.some(port => port.type === filters.portType)
      );
    }

    if (filters.minPorts) {
      filtered = filtered.filter(station => 
        station.totalPorts >= filters.minPorts
      );
    }

    if (filters.status) {
      filtered = filtered.filter(station => 
        station.status === filters.status
      );
    }

    setFilteredStations(filtered);
  }, [stations]); // Add stations as dependency since we're filtering from it

  // Handle view changes
  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  // Handle station selection
  const handleStationSelect = useCallback((station) => {
    setSelectedStation(station);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setSelectedStation(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-10">{error}</div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Charging Stations</h1>
            <div className="flex space-x-2">
              <Button
                variant={view === 'list' ? 'primary' : 'secondary'}
                onClick={() => handleViewChange('list')}
              >
                List View
              </Button>
              <Button
                variant={view === 'map' ? 'primary' : 'secondary'}
                onClick={() => handleViewChange('map')}
              >
                Map View
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <StationSearch 
                onSearchResults={handleSearchResults} 
                className="mb-4" 
              />
              
              {view === 'list' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStations.length > 0 ? (
                    filteredStations.map((station) => (
                      <StationCard
                        key={station._id}
                        station={station}
                        isExpanded={false}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No stations found matching your criteria.</p>
                    </div>
                  )}
                </div>
              )}

              {view === 'map' && (
                <StationMap 
                  onStationSelect={handleStationSelect} 
                />
              )}
            </div>

            <div>
              <StationFilters 
                onApplyFilters={handleApplyFilters} 
                className="mb-6" 
              />
              
              <NearestStations 
                onStationSelect={handleStationSelect} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Selected Station Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={handleModalClose} 
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <StationCard
              station={selectedStation}
              isExpanded={true}
              onClose={handleModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Stations;