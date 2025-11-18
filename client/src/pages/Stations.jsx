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
import { MapIcon, ListIcon, FilterIcon } from "lucide-react";

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list');
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
    setFilteredStations(results);
  }, []);

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
  }, [stations]);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleStationSelect = useCallback((station) => {
    setSelectedStation(station);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedStation(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20">
      {/* Hero Header with Gradient Overlay */}
      <div 
        className="relative bg-cover bg-center h-72 overflow-hidden"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1119976/pexels-photo-1119976.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl mt-5">
              Find Your Charging Station
            </h1>
            <p className="text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto">
              Discover {filteredStations.length} charging stations near you
            </p>
          </div>

          {/* Search Bar Overlay */}
          <div className="mt-8 max-w-4xl mx-auto w-full">
            <StationSearch 
              onSearchResults={handleSearchResults} 
              className="shadow-2xl" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* View Controls & Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl shadow-md p-4 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    {filteredStations.length} Stations Available
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <FilterIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>

                {/* View Switcher */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
                  <button
                    onClick={() => handleViewChange('list')}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm
                      ${view === 'list' 
                        ? 'bg-white text-green-600 shadow-md' 
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <ListIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button
                    onClick={() => handleViewChange('map')}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm
                      ${view === 'map' 
                        ? 'bg-white text-green-600 shadow-md' 
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <MapIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" >
              {/* Stations List/Map - Main Area */}
              <div className="lg:col-span-3">
                {view === 'list' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredStations.length > 0 ? (
                      filteredStations.map((station) => (
                        <StationCard
                          key={station._id}
                          station={station}
                          isExpanded={false}
                        />
                      ))
                    ) : (
                      <div className="col-span-full">
                        <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No stations found</h3>
                          <p className="text-gray-600">Try adjusting your search or filters to find more stations.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {view === 'map' && (
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                    <StationMap 
                      onStationSelect={handleStationSelect} 
                    />
                  </div>
                )}
              </div>

              {/* Sidebar - Filters & Nearest Stations */}
              <div className={`lg:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FilterIcon className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  </div>
                  <StationFilters 
                    onApplyFilters={handleApplyFilters} 
                  />
                </div>
                
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Nearest Stations</h3>
                  <NearestStations 
                    onStationSelect={handleStationSelect} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Station Modal with Backdrop */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={handleModalClose} 
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <StationCard
              station={selectedStation}
              isExpanded={true}
              onClose={handleModalClose}
            />
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Stations;