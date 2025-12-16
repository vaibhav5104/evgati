import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { stationService } from "../../services/stationService";
import { useAuth } from "../../hooks/useAuth";
import StationCard from "../../components/station/StationCard";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Table from "../../components/ui/Table";
import Modal from "../../components/common/Modal";
import Input from "../../components/ui/Input";

const MyStations = () => {
  const { user } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    state: '',
    pincode: '',
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
    pricing: {
      perHour: 0,
      perKWh: 0
    },
    totalPorts: 0,
    chargerTypes: [],
    amenities: [],
    operatingHours: {
      open: '00:00',
      close: '23:59',
      is24x7: false
    },
    contact: {
      phone: '',
      email: ''
    },
    images: []
  });

  const tableData = stations.map(station => ({
    ...station,
    id: station._id,
  }));

  const fetchMyStations = async () => {
    setLoading(true);
    try {
      const data = await stationService.getAllStations();
      const myStations = data.filter(station => {
        const stationOwner = station.owner?.toString() || station.owner;
        const currentUserId = user._id?.toString() || user._id;
        return stationOwner === currentUserId;
      });
      
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
    setEditingStation(station);
    setFormData({
      name: station.name || '',
      description: station.description || '',
      city: station.city || '',
      state: station.state || '',
      pincode: station.pincode || '',
      location: {
        latitude: station.location?.latitude || 0,
        longitude: station.location?.longitude || 0,
        address: station.location?.address || ''
      },
      pricing: {
        perHour: station.pricing?.perHour || 0,
        perKWh: station.pricing?.perKWh || 0
      },
      totalPorts: station.totalPorts || 0,
      chargerTypes: station.chargerTypes || [],
      amenities: station.amenities || [],
      operatingHours: {
        open: station.operatingHours?.open || '00:00',
        close: station.operatingHours?.close || '23:59',
        is24x7: station.operatingHours?.is24x7 || false
      },
      contact: {
        phone: station.contact?.phone || '',
        email: station.contact?.email || ''
      },
      images: (station.images || []).join("\n")
    });
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
      }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmitEdit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const payload = {
      ...formData,
      images: formData.images
        .split("\n")
        .map(img => img.trim())
        .filter(Boolean) // removes empty lines
    };

    await stationService.updateStation(editingStation._id, payload);
    setEditModalOpen(false);
  } catch (err) {
    console.error(err);
  } finally {
    setSaving(false);
  }
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

  const validChargerTypes = ["Type1", "Type2", "CCS", "CHAdeMO", "AC", "DC", "Bharat DC-001"];
  const validAmenities = ["wifi", "restroom", "cafe", "parking", "24x7"];

  return (
    <div className="space-y-6 md:py-20">
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
            You haven't added any charging stations yet.
          </p>
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
        </Card>
      )}

      {/* Table View */}
      {stations.length > 0 && (
        <Card className="mt-8">
          <div className="pb-4 border-b border-gray-200 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Station Details
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Detailed view of all your stations
            </p>
          </div>
          <Table 
            columns={columns}
            data={tableData}
            sortable={true}
            itemsPerPage={5}
          />
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit ${editingStation?.name}`}
        size="xl"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <Input
              label="Station Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Images (one URL per line)
  </label>
  <textarea
    name="images"
    value={formData.images}
    onChange={handleInputChange}
    rows={3}
    placeholder="https://example.com/img1.jpg"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  />
</div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location</h3>
            
            <Input
              label="Address"
              name="location.address"
              value={formData.location.address}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Latitude"
                name="location.latitude"
                type="number"
                step="any"
                value={formData.location.latitude}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Longitude"
                name="location.longitude"
                type="number"
                step="any"
                value={formData.location.longitude}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Pricing - Most Important for Daily Updates */}
          <div className="space-y-4 bg-primary-50 p-4 rounded-lg border-2 border-primary-200">
            <h3 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pricing (Update Daily)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price per Hour (₹)"
                name="pricing.perHour"
                type="number"
                step="0.01"
                value={formData.pricing.perHour}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Price per kWh (₹)"
                name="pricing.perKWh"
                type="number"
                step="0.01"
                value={formData.pricing.perKWh}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Ports */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Charging Ports</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You can only increase the number of ports, not decrease. Current: {editingStation?.totalPorts}</span>
              </p>
            </div>
            <Input
              label="Total Ports"
              name="totalPorts"
              type="number"
              min={editingStation?.totalPorts || 0}
              value={formData.totalPorts}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Charger Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Charger Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {validChargerTypes.map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.chargerTypes.includes(type)}
                    onChange={() => handleArrayToggle('chargerTypes', type)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {validAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleArrayToggle('amenities', amenity)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Operating Hours</h3>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="operatingHours.is24x7"
                checked={formData.operatingHours.is24x7}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Open 24/7</span>
            </label>

            {!formData.operatingHours.is24x7 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Opening Time"
                  name="operatingHours.open"
                  type="time"
                  value={formData.operatingHours.open}
                  onChange={handleInputChange}
                />
                <Input
                  label="Closing Time"
                  name="operatingHours.close"
                  type="time"
                  value={formData.operatingHours.close}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone"
                name="contact.phone"
                type="tel"
                value={formData.contact.phone}
                onChange={handleInputChange}
              />
              <Input
                label="Email"
                name="contact.email"
                type="email"
                value={formData.contact.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              icon={saving ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyStations;