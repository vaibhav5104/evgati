import React, { useState } from "react";
import { stationService } from "../services/stationService";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";

const AddStation = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    location: {
      address: "",
      latitude: 0,
      longitude: 0
    },
    totalPorts: 1,
    portTypes: ["AC"],
    pricing: {
      perHour: 0,
      perKWh: 0
    },
    description: ""
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await stationService.createStation(form);
      alert("Station added successfully! Waiting for admin approval.");
      setForm({
        name: "",
        location: { address: "", latitude: 0, longitude: 0 },
        totalPorts: 1,
        portTypes: ["AC"],
        pricing: { perHour: 0, perKWh: 0 },
        description: ""
      });
    } catch (error) {
      alert("Failed to add station");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Station</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Station Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="location.address"
                value={form.location.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="location.latitude"
                  value={form.location.latitude}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="location.longitude"
                  value={form.location.longitude}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Total Ports</label>
              <input
                type="number"
                min="1"
                name="totalPorts"
                value={form.totalPorts}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price per Hour (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="pricing.perHour"
                  value={form.pricing.perHour}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price per kWh (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="pricing.perKWh"
                  value={form.pricing.perKWh}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? "Adding Station..." : "Add Station"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStation;


