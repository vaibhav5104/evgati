import React, { useState, useCallback, useEffect } from 'react';
import { useDebouncedCallback } from '../../hooks/useDebounce';
import { stationService } from '../../services/stationService';
import Input from '../ui/Input';

const StationSearch = ({ onSearchResults, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (term) => {
    if (!term || term.trim().length === 0) {
      onSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Use existing getAllStations and filter client-side
      const allStations = await stationService.getAllStations();
      
      // Filter stations based on search term
      const filteredStations = allStations.filter(station => 
        station.name.toLowerCase().includes(term.toLowerCase()) ||
        station.location.address.toLowerCase().includes(term.toLowerCase()) ||
        station.location.latitude.toString().includes(term) ||
        station.location.longitude.toString().includes(term)
      );
      
      onSearchResults(filteredStations);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [onSearchResults]);

  // Use the correct debounced callback hook
  const debouncedSearch = useDebouncedCallback(performSearch, 300);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Call the debounced search function
    debouncedSearch(term);
  };

  // Clear search when component unmounts or search term is cleared
  useEffect(() => {
    if (!searchTerm) {
      onSearchResults([]);
    }
  }, [searchTerm, onSearchResults]);

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder="Search stations by name, location, or address"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full"
        icon={
          loading ? (
            <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )
        }
      />
      
      {/* Search Results Count */}
      {searchTerm && (
        <div className="absolute top-full mt-1 text-xs text-gray-500">
          {loading ? 'Searching...' : ''}
        </div>
      )}
    </div>
  );
};

export default StationSearch;
