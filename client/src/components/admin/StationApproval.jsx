import React, { useState, useEffect } from 'react';
import { stationService } from '../../services/stationService';
import { useToast } from '../common/Toast';
import PendingStationCard from './PendingStationCard';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const StationApproval = () => {
  const [pendingStations, setPendingStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingStations();
  }, []);

  const fetchPendingStations = async () => {
    try {
      setLoading(true);
      const stations = await stationService.getPendingStations();
      setPendingStations(stations);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pending stations');
      toast('Failed to load pending stations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStation = async (stationId) => {
    try {
      await stationService.approveStation(stationId);
      toast('Station approved successfully', 'success');
      
      // Remove the approved station from the list
      setPendingStations(prev => 
        prev.filter(station => station._id !== stationId)
      );
    } catch (err) {
      toast('Failed to approve station', 'error');
    }
  };

  const handleRejectStation = async (stationId) => {
    try {
      await stationService.rejectStation(stationId);
      toast('Station rejected successfully', 'warning');
      
      // Remove the rejected station from the list
      setPendingStations(prev => 
        prev.filter(station => station._id !== stationId)
      );
    } catch (err) {
      toast('Failed to reject station', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner text="Loading pending stations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
        <Button 
          variant="secondary" 
          onClick={fetchPendingStations}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Pending Station Approvals
        </h2>
        <div className="text-gray-600">
          Total Pending: {pendingStations.length}
        </div>
      </div>

      {pendingStations.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Pending Stations
          </h3>
          <p className="text-gray-600">
            All stations have been reviewed or there are no new stations to approve.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingStations.map(station => (
            <PendingStationCard
              key={station._id}
              station={station}
              onApprove={handleApproveStation}
              onReject={handleRejectStation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StationApproval;

