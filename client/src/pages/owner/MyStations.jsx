import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { stationService } from "../../services/stationService";
import { useAuth } from "../../hooks/useAuth";
import StationCard from "../../components/station/StationCard";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Table  from "../../components/ui/Table";

const MyStations = () => {
  const { user } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tableData = stations.map(station => ({
  ...station,
  id: station._id,   // For selection + keys
}));


  const fetchMyStations = async () => {
    setLoading(true);
    try {
      const data = await stationService.getAllStations();
      // console.log("All stations:", data);
      // console.log("Current user ID:", user._id);
      
      // Debug: Log each station's owner
      // data.forEach(station => {
        // console.log(`Station: ${station.name}, Owner: ${station.owner}, Match: ${station.owner === user._id}`);
      // });
      
      const myStations = data.filter(station => {
        // Handle both string and ObjectId comparisons
        const stationOwner = station.owner?.toString() || station.owner;
        const currentUserId = user._id?.toString() || user._id;
        return stationOwner === currentUserId;
      });
      
      // console.log("Filtered stations:", myStations);
      setStations(myStations);
      setError(null);
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Failed to fetch your stations.");
      toast.error("Failed to load your stations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyStations();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const handleEditStation = (station) => {
    toast.info(`Edit functionality for ${station.name} - Coming soon!`);
  };

  const handleDeleteStation = async (station) => {
    if (window.confirm(`Are you sure you want to delete "${station.name}"?`)) {
      try {
        await stationService.deleteStation(station._id);
        toast.success('Station deleted successfully');
        fetchMyStations();
      } catch (error) {
        toast.error('Failed to delete station');
        console.error('Delete error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your stations..." />
      </div>
    );
  }

  const columns = [
  {
    key: "name",
    header: "Station",
    render: (_, row) => (
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-electric-500 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">ID: {row._id.slice(-6)}</div>
        </div>
      </div>
    )
  },
  {
    key: "location",
    header: "Location",
    render: (val, row) => (
      <div>
        <div className="text-sm text-gray-900">{row.location.address}</div>
        <div className="text-xs text-gray-500">
          {row.location.latitude.toFixed(4)}, {row.location.longitude.toFixed(4)}
        </div>
      </div>
    )
  },
  {
    key: "totalPorts",
    header: "Ports",
  },
  {
    key: "status",
    header: "Status",
    render: (status) => (
      <Badge variant={getStatusColor(status)}>
        {status}
      </Badge>
    )
  },
  {
    key: "actions",
    header: "Actions",
    render: (_, row) => (
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleEditStation(row)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => handleDeleteStation(row)}>
          Delete
        </Button>
      </div>
    )
  }
];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Stations</h1>
          <p className="text-gray-600">Manage your charging stations</p>
        </div>
        <Button
          onClick={() => window.location.href = '/add-station'}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add New Station
        </Button>
      </div>

      {/* Stats Overview - Using your existing Card structure */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {stations.length}
          </div>
          <div className="text-sm text-gray-600">Total Stations</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stations.filter(s => s.status === 'accepted').length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {stations.filter(s => s.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {stations.filter(s => s.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </Card>
      </div>

      {/* Debug Card (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-sm">
            <strong>Debug Info:</strong>
            {/* <br /> */}
            {/* User ID: {user?._id} */}
            <br />
            User Role: {user?.role}
            <br />
            Total Stations Found: {stations.length}
            <br />
            {stations.length === 0 && "No stations match your user ID"}
          </div>
        </Card>
      )}

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
              onClick={fetchMyStations}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Stations List */}
      {stations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard
              key={station._id}
              isExpanded={true}
              station={station}
              showActions={true}
              onEdit={handleEditStation}
              onDelete={handleDeleteStation}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No stations found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any charging stations yet, or your existing stations may not be properly associated with your account.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = '/add-station'}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Add Your First Station
            </Button>
            <Button
              variant="outline"
              onClick={fetchMyStations}
              size="sm"
            >
              Refresh List
            </Button>
          </div>
        </Card>
      )}

      {/* Table View - Using your existing Card structure */}
      {stations.length > 0 && (
        <Card className="mt-8">
          {/* Header section */}
          <div className="pb-4 border-b border-gray-200 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Station Details
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Detailed view of all your stations
            </p>
          </div>

          {/* Content section */}
          {/* <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map((station) => (
                  <tr key={station._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-electric-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{station.name}</div>
                          <div className="text-sm text-gray-500">ID: {station._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{station.location.address}</div>
                      <div className="text-sm text-gray-500">
                        {station.location.latitude.toFixed(4)}, {station.location.longitude.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station.totalPorts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(station.status)}>
                        {station.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStation(station)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteStation(station)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          <Table 
            columns={columns}
            data={tableData}
            sortable={true}
            itemsPerPage={5}
            className=""
          />
        </Card>
      )}
    </div>
  );
};

export default MyStations;