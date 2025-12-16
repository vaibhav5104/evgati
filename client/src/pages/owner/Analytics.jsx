import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Star, Clock, DollarSign, Battery, MapPin, Activity, AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import { authService } from '../../services/authService';
import { commentService } from '../../services/commentService';
import { stationService } from '../../services/stationService';
import { historyService } from '../../services/historyService';
import { useAuth } from '../../hooks/useAuth';


const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedStation, setSelectedStation] = useState('all');
  const {user} = useAuth()
  const [analyticsData, setAnalyticsData] = useState({
    owner: null,
    history: [],
    stations: [],
    comments: [],
    stationDetails: {}
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch owner data
      const owner = await authService.getUserById(user._id);
      
      // Fetch history
      const historyData = await historyService.getOwnerHistory();
      
      // Fetch station details
      const stationDetails = {};
      const allComments = [];
      
      for (const stationId of owner.ownedStations) {
        const station = await stationService.getStationById(stationId);
        stationDetails[stationId] = station;
        
        const comments = await commentService.getComments(stationId);
        allComments.push(...comments.comments || []);
      }
      
      setAnalyticsData({
        owner,
        history: historyData.history,
        stations: Object.values(stationDetails),
        comments: allComments,
        stationDetails
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!analyticsData.history) return {};

    const now = new Date();
    const timeFilter = (date) => {
      const d = new Date(date);
      if (timeRange === 'weekly') {
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      } else if (timeRange === 'monthly') {
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        return d >= monthAgo;
      } else {
        const yearAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);
        return d >= yearAgo;
      }
    };

    const filteredHistory = analyticsData.history.filter(h => 
      timeFilter(h.createdAt) && 
      (selectedStation === 'all' || h.stationId._id === selectedStation)
    );

    const totalBookings = filteredHistory.length;
    const acceptedBookings = filteredHistory.filter(h => h.status === 'accepted').length;
    const rejectedBookings = filteredHistory.filter(h => h.status === 'rejected').length;
    const pendingBookings = filteredHistory.filter(h => h.status === 'pending').length;
    
    const acceptanceRate = totalBookings > 0 ? (acceptedBookings / totalBookings * 100).toFixed(1) : 0;
    
    const avgDuration = filteredHistory.reduce((acc, h) => {
      const duration = (new Date(h.endTime) - new Date(h.startTime)) / (1000 * 60 * 60);
      return acc + duration;
    }, 0) / (filteredHistory.length || 1);

    const avgRating = analyticsData.comments.length > 0
      ? (analyticsData.comments.reduce((acc, c) => acc + c.rating, 0) / analyticsData.comments.length).toFixed(1)
      : 0;

    const revenue = acceptedBookings * 150; // Assuming ₹150 per booking

    return {
      totalBookings,
      acceptedBookings,
      rejectedBookings,
      pendingBookings,
      acceptanceRate,
      avgDuration: avgDuration.toFixed(1),
      avgRating,
      revenue,
      totalStations: analyticsData.stations.length,
      totalPorts: analyticsData.stations.reduce((acc, s) => acc + s.totalPorts, 0),
      uniqueUsers: new Set(filteredHistory.map(h => h.userId._id)).size
    };
  }, [analyticsData, timeRange, selectedStation]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!analyticsData.history) return {};

    // Time series data
    const timeSeriesData = {};
    analyticsData.history.forEach(h => {
      const date = new Date(h.createdAt);
      const key = timeRange === 'weekly' 
        ? date.toLocaleDateString('en', { weekday: 'short' })
        : timeRange === 'monthly'
        ? date.toLocaleDateString('en', { day: 'numeric', month: 'short' })
        : date.toLocaleDateString('en', { month: 'short', year: '2-digit' });
      
      if (!timeSeriesData[key]) {
        timeSeriesData[key] = { date: key, bookings: 0, revenue: 0 };
      }
      timeSeriesData[key].bookings++;
      if (h.status === 'accepted') {
        timeSeriesData[key].revenue += 150;
      }
    });

    // Station performance
    const stationPerformance = analyticsData.stations.map(station => {
      const stationBookings = analyticsData.history.filter(h => h.stationId._id === station._id);
      const stationComments = analyticsData.comments.filter(c => c.stationId === station._id);
      const avgRating = stationComments.length > 0
        ? stationComments.reduce((acc, c) => acc + c.rating, 0) / stationComments.length
        : 0;
      
      return {
        name: station.name,
        bookings: stationBookings.length,
        rating: avgRating.toFixed(1),
        utilization: ((stationBookings.length / (station.totalPorts * 30)) * 100).toFixed(1)
      };
    });

    // Port utilization
    const portUtilization = [];
    for (let i = 1; i <= 5; i++) {
      const portBookings = analyticsData.history.filter(h => h.portId === i);
      portUtilization.push({
        port: `Port ${i}`,
        bookings: portBookings.length,
        utilization: ((portBookings.length / 30) * 100).toFixed(1)
      });
    }

    // Status distribution
    const statusDistribution = [
      { name: 'Accepted', value: metrics.acceptedBookings, color: '#10b981' },
      { name: 'Rejected', value: metrics.rejectedBookings, color: '#ef4444' },
      { name: 'Pending', value: metrics.pendingBookings, color: '#f59e0b' }
    ];

    // Peak hours
    const peakHours = {};
    analyticsData.history.forEach(h => {
      const hour = new Date(h.startTime).getHours();
      if (!peakHours[hour]) peakHours[hour] = 0;
      peakHours[hour]++;
    });
    const peakHoursData = Object.entries(peakHours).map(([hour, count]) => ({
      hour: `${hour}:00`,
      bookings: count
    })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    return {
      timeSeries: Object.values(timeSeriesData),
      stationPerformance,
      portUtilization,
      statusDistribution,
      peakHours: peakHoursData
    };
  }, [analyticsData, timeRange, metrics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-gray-300 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-pink-900 p-6 md:py-20">  
      <div className="w-full">  
        {/* Header */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Monitor your EV charging stations performance</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Time Range Selector */}
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-blue-600 text-black px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">Last 30 Days</option>
                <option value="yearly">Last Year</option>
              </select>
              
              {/* Station Filter */}
              <select 
                value={selectedStation} 
                onChange={(e) => setSelectedStation(e.target.value)}
                className="bg-gray-700 text-black px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Stations</option>
                {analyticsData.stations.map(station => (
                  <option key={station._id} value={station._id}>{station.name}</option>
                ))}
              </select>
              
              <button 
                onClick={fetchAnalyticsData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-blue-400 font-semibold">+12%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Bookings</h3>
            <p className="text-2xl font-bold text-white">{metrics.totalBookings}</p>
            <p className="text-xs text-gray-500 mt-2">Acceptance Rate: {metrics.acceptanceRate}%</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 font-semibold">+8%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Revenue</h3>
            <p className="text-2xl font-bold text-white">₹{metrics.revenue?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">From {metrics.acceptedBookings} bookings</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-purple-400 font-semibold">+15%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Unique Users</h3>
            <p className="text-2xl font-bold text-white">{metrics.uniqueUsers}</p>
            <p className="text-xs text-gray-500 mt-2">Active customers</p>
          </div>

          <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 backdrop-blur-lg rounded-xl p-6 border border-amber-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-500/20 p-3 rounded-lg">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs text-amber-400 font-semibold">+0.3</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Average Rating</h3>
            <p className="text-2xl font-bold text-white">{metrics.avgRating}/5.0</p>
            <p className="text-xs text-gray-500 mt-2">From {analyticsData.comments.length} reviews</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Booking Trends */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Booking Trends
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.timeSeries}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorBookings)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trends */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              Revenue Analysis
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Station Performance */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Battery className="w-5 h-5 mr-2 text-purple-400" />
              Station Performance
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.stationPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="utilization" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Status Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-amber-400" />
              Booking Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Port Utilization */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Battery className="w-5 h-5 mr-2 text-cyan-400" />
              Port Utilization
            </h3>
            <div className="space-y-3">
              {chartData.portUtilization?.map((port, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{port.port}</span>
                    <span className="text-white font-semibold">{port.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${port.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-rose-400" />
              Peak Hours Analysis
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.peakHours?.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="bookings" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
              Infrastructure Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400">Total Stations</span>
                <span className="text-xl font-bold text-white">{metrics.totalStations}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400">Total Ports</span>
                <span className="text-xl font-bold text-white">{metrics.totalPorts}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400">Avg Session</span>
                <span className="text-xl font-bold text-white">{metrics.avgDuration} hrs</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-xl font-bold text-green-400">{metrics.acceptanceRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-amber-400" />
            Recent Customer Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.comments.slice(0, 6).map((comment, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{comment.userId.name}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < comment.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-500'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-2">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;