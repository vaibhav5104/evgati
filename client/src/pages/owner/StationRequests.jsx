import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { bookingService } from "../../services/bookingService";
import { stationService } from "../../services/stationService";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const StationRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
  const [processingActions, setProcessingActions] = useState(new Set());

  const fetchOwnerStationRequests = async () => {
    setLoading(true);
    try {
      // Step 1: Get all stations owned by current user
      const allStations = await stationService.getAllStations();
      const ownerStations = allStations.filter(station => 
        station.owner && station.owner.toString() === user._id.toString()
      );

      console.log("Owner's stations:", ownerStations);

      if (ownerStations.length === 0) {
        setRequests([]);
        setError(null);
        return;
      }

      // Step 2: Get pending requests for each owned station
      const allRequests = [];
      
      for (const station of ownerStations) {
        try {
          const stationRequests = await bookingService.getStationBookings(station._id);
          console.log(`Requests for station ${station.name}:`, stationRequests);
          
          // Add station info to each request
          const requestsWithStationInfo = (stationRequests.pendingRequests || []).map(request => ({
            ...request,
            stationId: station._id,
            stationName: station.name,
            stationLocation: station.location.address
          }));
          
          allRequests.push(...requestsWithStationInfo);
        } catch (stationError) {
          console.warn(`Failed to fetch requests for station ${station.name}:`, stationError);
        }
      }

      console.log("All combined requests:", allRequests);
      setRequests(allRequests);
      setError(null);
    } catch (err) {
      console.error("Error fetching owner station requests:", err);
      setError("Failed to fetch booking requests.");
      toast.error("Failed to load booking requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && (user.role === 'owner' || user.role === 'admin')) {
      fetchOwnerStationRequests();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const handleApprove = async (stationId, bookingId, requestIndex) => {
    const actionKey = `${stationId}-${bookingId}-approve`;
    setProcessingActions(prev => new Set([...prev, actionKey]));
    
    try {
      const ownerMessage = prompt("Add a message for the user (optional):");
      await bookingService.approveBooking(stationId, bookingId, ownerMessage || '');
      toast.success('Booking request approved successfully!');
      
      // Update local state immediately for better UX
      setRequests(prev => prev.filter((_, index) => index !== requestIndex));
      
      // Refresh data from server
      setTimeout(() => fetchOwnerStationRequests(), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve booking');
      console.error('Approve error:', error);
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  const handleReject = async (stationId, bookingId, requestIndex) => {
    const ownerMessage = prompt("Please provide a reason for rejection:");
    if (!ownerMessage) {
      toast.warning("Rejection reason is required");
      return;
    }

    const actionKey = `${stationId}-${bookingId}-reject`;
    setProcessingActions(prev => new Set([...prev, actionKey]));
    
    try {
      await bookingService.rejectBooking(stationId, bookingId, ownerMessage);
      toast.success('Booking request rejected');
      
      // Update local state immediately for better UX
      setRequests(prev => prev.filter((_, index) => index !== requestIndex));
      
      // Refresh data from server
      setTimeout(() => fetchOwnerStationRequests(), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject booking');
      console.error('Reject error:', error);
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status?.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading booking requests..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Requests</h1>
          <p className="text-gray-600">Manage booking requests for your stations</p>
        </div>
        <Button
          onClick={fetchOwnerStationRequests}
          variant="outline"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {requests.length}
          </div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {requests.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {requests.filter(r => r.status === 'accepted').length}
          </div>
          <div className="text-sm text-gray-600">Accepted</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {requests.filter(r => r.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {['all', 'pending', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                {status === 'all' ? requests.length : requests.filter(r => r.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchOwnerStationRequests}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <Card key={`${request.stationId}-${request._id}`} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-electric-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.userId?.name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.userId?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 font-medium">Station:</span>
                        <p className="text-gray-900">{request.stationName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Port:</span>
                        <p className="text-gray-900">Port {request.portId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">Start Time:</span>
                        <p className="text-gray-900">{formatDate(request.startTime)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium">End Time:</span>
                        <p className="text-gray-900">{formatDate(request.endTime)}</p>
                      </div>
                    </div>
                  </div>

                  {request.stationLocation && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {request.stationLocation}
                    </div>
                  )}

                  {request.ownerMessage && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-sm text-blue-700 font-medium">Previous Response:</span>
                      <p className="text-sm text-blue-800 mt-1">{request.ownerMessage}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-3 ml-4">
                  <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1">
                    {getStatusIcon(request.status)}
                    <span>{request.status}</span>
                  </Badge>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(request.stationId, request._id, index)}
                        disabled={processingActions.has(`${request.stationId}-${request._id}-approve`)}
                        loading={processingActions.has(`${request.stationId}-${request._id}-approve`)}
                        icon={
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(request.stationId, request._id, index)}
                        disabled={processingActions.has(`${request.stationId}-${request._id}-reject`)}
                        loading={processingActions.has(`${request.stationId}-${request._id}-reject`)}
                        icon={
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No booking requests found
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? "You don't have any booking requests yet for your stations."
              : `No ${filter} booking requests found.`
            }
          </p>
          <Button
            variant="outline"
            onClick={fetchOwnerStationRequests}
            size="sm"
          >
            Refresh List
          </Button>
        </Card>
      )}
    </div>
  );
};

export default StationRequests;