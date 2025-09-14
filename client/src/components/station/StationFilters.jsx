import React, { useState } from 'react';
import Button from '../ui/Button';
import Select from '../ui/Select';

const StationFilters = ({ onApplyFilters, className = '' }) => {
  const [filters, setFilters] = useState({
    portType: '',
    minPorts: 1,
    maxDistance: 50,
    priceRange: [0, 500],
    status: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onApplyFilters(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      portType: '',
      minPorts: 1,
      maxDistance: 50,
      priceRange: [0, 500],
      status: ''
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Filter Stations</h3>

      {/* Port Type Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Port Type</label>
        <Select
          value={filters.portType}
          onChange={(e) => handleFilterChange('portType', e.target.value)}
          className="w-full"
        >
          <option value="">All Port Types</option>
          <option value="AC">AC Charging</option>
          <option value="DC">DC Charging</option>
        </Select>
      </div>

      {/* Minimum Ports Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Minimum Ports</label>
        <input
          type="range"
          min="1"
          max="10"
          value={filters.minPorts}
          onChange={(e) => handleFilterChange('minPorts', e.target.value)}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          At least {filters.minPorts} port(s)
        </div>
      </div>

      {/* Maximum Distance Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Maximum Distance (km)</label>
        <input
          type="range"
          min="5"
          max="100"
          value={filters.maxDistance}
          onChange={(e) => handleFilterChange('maxDistance', e.target.value)}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          Within {filters.maxDistance} km
        </div>
      </div>

      {/* Station Status Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Station Status</label>
        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full"
        >
          <option value="">All Stations</option>
          <option value="accepted">Active</option>
          <option value="pending">Pending</option>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <Button 
          variant="primary" 
          onClick={applyFilters} 
          className="w-full"
        >
          Apply Filters
        </Button>
        <Button 
          variant="secondary" 
          onClick={resetFilters} 
          className="w-full"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default StationFilters;

