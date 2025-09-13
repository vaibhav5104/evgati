import React, { useState, useEffect } from 'react';
import { useStations } from '../hooks/useStations';
import { StationCard, StationMap } from '../components/station';
import { LoadingSpinner } from '../components/common';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Stations = () => {
  const { stations, loading, error, fetchStations } = useStations();
  const [view, setView] = useState('grid'); // 'grid', 'list', 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkerClick = (station) => {
    setSelectedStation(station);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Stations</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchStations}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Charging Stations
        </h1>
        <p className="text-gray-600 mb-6">
          Find and book electric vehicle charging stations near you
        </p>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search stations or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'grid' ? 'primary' : 'outline'}
              onClick={() => setView('grid')}
              size="sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'outline'}
              onClick={() => setView('list')}
              size="sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </Button>
            <Button
              variant={view === 'map' ? 'primary' : 'outline'}
              onClick={() => setView('map')}
              size="sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Map
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredStations.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No stations found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search terms' : 'No charging stations available yet'}
          </p>
        </Card>
      ) : (
        <>
          {view === 'map' ? (
            <div className="h-96 md:h-[600px] rounded-lg overflow-hidden shadow-sm">
              <StationMap
                stations={filteredStations}
                onMarkerClick={handleMarkerClick}
              />
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {filteredStations.length} charging station{filteredStations.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Stations Grid/List */}
              <div className={
                view === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {filteredStations.map((station) => (
                  <StationCard
                    key={station._id}
                    station={station}
                    isExpanded={false}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Selected Station Modal (for map view) */}
      {selectedStation && view === 'map' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedStation(null)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <StationCard
              station={selectedStation}
              isExpanded={true}
              onClose={() => setSelectedStation(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Stations;
