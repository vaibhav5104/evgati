import { useState, useCallback } from 'react';
import { stationService } from '../services';
import { toast } from 'react-toastify';

export const useStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stationService.getAllStations();
      setStations(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch stations';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStationById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stationService.getStationById(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch station';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStation = useCallback(async (stationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stationService.createStation(stationData);
      toast.success('Station submitted for review');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create station';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStation = useCallback(async (id, stationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stationService.updateStation(id, stationData);
      toast.success('Station updated successfully');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update station';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStation = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await stationService.deleteStation(id);
      setStations(prev => prev.filter(station => station._id !== id));
      toast.success('Station deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete station';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const findNearestStations = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await stationService.findNearestStations(latitude, longitude);
      return response.data || [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to find nearest stations';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stations,
    loading,
    error,
    fetchStations,
    getStationById,
    createStation,
    updateStation,
    deleteStation,
    findNearestStations
  };
};