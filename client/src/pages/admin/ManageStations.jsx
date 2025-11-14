import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { stationService } from "../../services/stationService";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const initialForm = { 
  name: "", 
  location: { address: "", latitude: 0, longitude: 0 },
  totalPorts: 1,
  portTypes: ["AC"],
  pricing: { perHour: 0, perKWh: 0 },
  description: ""
};

const ManageStations = () => {
  const { user } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await stationService.getAllStations();
      // console.log("All stations:", data);
      
      // Ensure stations is always an array
      const safeData = Array.isArray(data) ? data : Array.isArray(data?.stations) ? data.stations : [];
      setStations(safeData);
      setError(null);
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Failed to fetch stations.");
      toast.error("Failed to load stations");
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await stationService.updateStation(editingId, form);
        toast.success('Station updated successfully');
      } else {
        await stationService.createStation(form);
        toast.success('Station created successfully');
      }
      setForm(initialForm);
      setEditingId(null);
      fetchStations();
    } catch (error) {
      console.error("Save error:", error);
      setError("Failed to save station.");
      toast.error("Failed to save station");
    }
  };

  const handleEdit = (station) => {
    setForm({
      name: station.name || "",
      location: {
        address: station.location?.address || "",
        latitude: station.location?.latitude || 0,
        longitude: station.location?.longitude || 0
      },
      totalPorts: station.totalPorts || 1,
      portTypes: station.portTypes || ["AC"],
      pricing: {
        perHour: station.pricing?.perHour || 0,
        perKWh: station.pricing?.perKWh || 0
      },
      description: station.description || ""
    });
    setEditingId(station._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await stationService.deleteStation(id);
        toast.success('Station deleted successfully');
        fetchStations();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error('Failed to delete station');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || station.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading stations..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Stations</h1>
          <p className="text-gray-600">Manage all charging stations in the system</p>
        </div>
        <Button
          onClick={fetchStations}
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

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search stations by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="accepted">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Add/Edit Form */}
      <Card className="border-primary-200 bg-primary-50">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Station" : "Add New Station"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  name="name"
                  placeholder="Station Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  name="location.address"
                  placeholder="Station Address"
                  value={form.location.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  name="location.latitude"
                  placeholder="0.0000"
                  value={form.location.latitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  name="location.longitude"
                  placeholder="0.0000"
                  value={form.location.longitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Ports</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  name="totalPorts"
                  placeholder="1"
                  value={form.totalPorts}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  name="pricing.perHour"
                  placeholder="0.00"
                  value={form.pricing.perHour}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per kWh (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  name="pricing.perKWh"
                  placeholder="0.00"
                  value={form.pricing.perKWh}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                name="description"
                placeholder="Station description..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" color="primary">
                {editingId ? "Update Station" : "Add Station"}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setForm(initialForm); setEditingId(null); }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
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
              onClick={fetchStations}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Stations List */}
      {filteredStations.length > 0 ? (
        <div className="space-y-4">
          {filteredStations.map((station) => (
            <Card key={station._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-electric-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
                    <p className="text-sm text-gray-600">{station.location?.address || 'No address'}</p>
                    <p className="text-xs text-gray-500">
                      {station.location?.latitude?.toFixed(4)}, {station.location?.longitude?.toFixed(4)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{station.totalPorts} ports</p>
                    <p className="text-sm text-gray-600">
                      ₹{station.pricing?.perHour || 0}/hr, ₹{station.pricing?.perKWh || 0}/kWh
                    </p>
                  </div>
                  
                  <Badge variant={getStatusColor(station.status)} className="flex items-center space-x-1">
                    {getStatusIcon(station.status)}
                    <span className="capitalize">{station.status}</span>
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(station)}
                      icon={
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => handleDelete(station._id)}
                      icon={
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
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
            {searchTerm || statusFilter !== 'all' 
              ? "No stations match your search criteria."
              : "No stations found in the system."
            }
          </p>
          <Button
            variant="outline"
            onClick={fetchStations}
            size="sm"
          >
            Refresh List
          </Button>
        </Card>
      )}

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Debug Info</h4>
            <div className="text-sm text-yellow-700">
              <p>Total Stations: {stations.length}</p>
              <p>Filtered Stations: {filteredStations.length}</p>
              <p>Search Term: "{searchTerm}"</p>
              <p>Status Filter: {statusFilter}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ManageStations;
