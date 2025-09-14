import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    revenue: { total: 0, monthly: [] },
    bookings: { total: 0, completed: 0, pending: 0 },
    stations: { total: 0, active: 0, inactive: 0 },
    ratings: { average: 0, count: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API call
      const mockData = {
        revenue: {
          total: 12500,
          monthly: [
            { month: 'Jan', amount: 1200 },
            { month: 'Feb', amount: 1500 },
            { month: 'Mar', amount: 1800 },
            { month: 'Apr', amount: 2200 },
            { month: 'May', amount: 1900 },
            { month: 'Jun', amount: 2500 },
            { month: 'Jul', amount: 2800 }
          ]
        },
        bookings: {
          total: 156,
          completed: 142,
          pending: 8,
          cancelled: 6
        },
        stations: {
          total: 5,
          active: 4,
          inactive: 1
        },
        ratings: {
          average: 4.2,
          count: 89
        }
      };
      
      setAnalytics(mockData);
      setError(null);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to fetch analytics data.");
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const getRevenueChartUrl = () => {
    const data = analytics.revenue.monthly;
    const labels = data.map(d => d.month);
    const values = data.map(d => d.amount);
    
    return `https://quickchart.io/chart?c={
      type:'line',
      data:{
        labels:${JSON.stringify(labels)},
        datasets:[{
          label:'Revenue (₹)',
          data:${JSON.stringify(values)},
          borderColor:'rgb(34, 197, 94)',
          backgroundColor:'rgba(34, 197, 94, 0.1)',
          tension:0.4
        }]
      },
      options:{
        responsive:true,
        plugins:{
          title:{
            display:true,
            text:'Revenue Trend'
          }
        },
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    }`;
  };

  const getBookingsChartUrl = () => {
    const data = analytics.bookings;
    return `https://quickchart.io/chart?c={
      type:'doughnut',
      data:{
        labels:['Completed','Pending','Cancelled'],
        datasets:[{
          data:[${data.completed},${data.pending},${data.cancelled}],
          backgroundColor:['rgb(34, 197, 94)','rgb(251, 191, 36)','rgb(239, 68, 68)']
        }]
      },
      options:{
        responsive:true,
        plugins:{
          title:{
            display:true,
            text:'Booking Status'
          }
        }
      }
    }`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your station performance and revenue</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{error}</span>
            <button 
              onClick={fetchAnalytics}
              className="ml-auto px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ₹{analytics.revenue.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.bookings.total}
          </div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.stations.active}
          </div>
          <div className="text-sm text-gray-600">Active Stations</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analytics.ratings.average}
          </div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <img 
              src={getRevenueChartUrl()} 
              alt="Revenue Chart" 
              className="w-full h-64 object-contain"
            />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
            <img 
              src={getBookingsChartUrl()} 
              alt="Bookings Chart" 
              className="w-full h-64 object-contain"
            />
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Stations</span>
                <span className="font-semibold">{analytics.stations.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Stations</span>
                <span className="font-semibold text-green-600">{analytics.stations.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Inactive Stations</span>
                <span className="font-semibold text-red-600">{analytics.stations.inactive}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{analytics.bookings.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">{analytics.bookings.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cancelled</span>
                <span className="font-semibold text-red-600">{analytics.bookings.cancelled}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Debug Info</h4>
            <div className="text-sm text-yellow-700">
              <p>User ID: {user?._id}</p>
              <p>Time Range: {timeRange}</p>
              <p>Data Source: Mock (replace with real API)</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
