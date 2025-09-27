import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { stationService } from "../services/stationService";
import { BookingForm } from "../components/booking";
import { CommentForm, CommentList } from "../components/comment";
import { ChatWindow } from "../components/chat";
import StationMap from "../components/station/StationMap";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";

const StationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [loadingTravelTime, setLoadingTravelTime] = useState(false);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const data = await stationService.getStationById(id);
        setStation(data);
      } catch (err) {
        setError("Failed to fetch station details");
      }
      setLoading(false);
    };
    fetchStation();
  }, [id]);

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by this browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access denied by user");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information unavailable");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out");
              break;
            default:
              setLocationError("An unknown error occurred");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    };

    getCurrentLocation();
  }, []);

  // Calculate travel time when both locations are available
  useEffect(() => {
    const calculateTravelTime = async () => {
      if (!userLocation || !station?.location) return;

      setLoadingTravelTime(true);
      try {
        // Using OpenRouteService API (free tier) for routing
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624846c4d9b74b8742409b4b3b7b8b4e8e46&start=${userLocation.longitude},${userLocation.latitude}&end=${station.location.longitude},${station.location.latitude}`
        );

        if (response.ok) {
          const data = await response.json();
          const duration = data.features[0]?.properties?.segments?.[0]?.duration;
          const distance = data.features[0]?.properties?.segments?.[0]?.distance;
          
          if (duration && distance) {
            setTravelTime({
              duration: Math.round(duration / 60), // Convert to minutes
              distance: (distance / 1000).toFixed(1) // Convert to km
            });
          }
        } else {
          // Fallback: Calculate straight-line distance and estimate time
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            station.location.latitude,
            station.location.longitude
          );
          setTravelTime({
            duration: Math.round(distance * 2), // Rough estimate: 2 minutes per km
            distance: distance.toFixed(1),
            isEstimate: true
          });
        }
      } catch (error) {
        console.error("Error calculating travel time:", error);
        // Fallback calculation
        if (station?.location) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            station.location.latitude,
            station.location.longitude
          );
          setTravelTime({
            duration: Math.round(distance * 2),
            distance: distance.toFixed(1),
            isEstimate: true
          });
        }
      }
      setLoadingTravelTime(false);
    };

    calculateTravelTime();
  }, [userLocation, station]);

  // Haversine formula for distance calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const tabs = [
    { id: "details", label: "Details", icon: "📋" },
    { id: "location", label: "Location & Map", icon: "📍" },
    { id: "booking", label: "Book", icon: "📅" },
    { id: "comments", label: "Reviews", icon: "⭐" },
    { id: "chat", label: "Chat", icon: "💬" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading station details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/stations")}>
            ← Back to Stations
          </Button>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Station not found</h2>
          <p className="text-gray-600 mb-4">The station you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/stations")}>
            ← Back to Stations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {station.name}
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-500">📍</span>
                    <p className="text-gray-600">{station.location?.address}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-blue-600 text-sm font-medium">Total Ports</div>
                  <div className="text-2xl font-bold text-blue-900">{station.totalPorts}</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-600 text-sm font-medium">Status</div>
                  <div className={`text-sm font-semibold px-2 py-1 rounded-full inline-block mt-1 ${
                    station.status === "accepted" 
                      ? "bg-green-100 text-green-800" 
                      : station.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {station.status?.charAt(0).toUpperCase() + station.status?.slice(1)}
                  </div>
                </div>

                {travelTime && !loadingTravelTime && (
                  <>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-purple-600 text-sm font-medium">Distance</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {travelTime.distance} km
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-orange-600 text-sm font-medium">
                        Travel Time {travelTime.isEstimate && "(Est.)"}
                      </div>
                      <div className="text-2xl font-bold text-orange-900">
                        {travelTime.duration} min
                      </div>
                    </div>
                  </>
                )}

                {loadingTravelTime && userLocation && (
                  <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">Calculating route...</span>
                    </div>
                  </div>
                )}

                {locationError && (
                  <div className="bg-yellow-50 rounded-lg p-4 col-span-2 lg:col-span-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">⚠️</span>
                      <span className="text-yellow-800 text-sm">
                        {locationError}. Enable location for travel time calculation.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {user && (
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <Button
                  onClick={() => setActiveTab("booking")}
                  size="lg"
                  className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3"
                >
                  📅 Book Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 text-blue-600 bg-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Station Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {station.description || "This charging station provides reliable electric vehicle charging services. Contact the station owner for more specific details about amenities and services."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">🔌 Port Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Ports:</span>
                        <span className="font-medium">{station.totalPorts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Ports:</span>
                        <span className="font-medium text-green-600">
                          {station.ports?.filter(p => p.bookings?.length === 0).length || station.totalPorts}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">📍 Location Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latitude:</span>
                        <span className="font-medium">{station.location?.latitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Longitude:</span>
                        <span className="font-medium">{station.location?.longitude}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">📍</span>
                    Station Location
                  </h3>
                  {userLocation && travelTime && (
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                      🚗 {travelTime.distance} km • {travelTime.duration} min away
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <StationMap
                    initialCenter={[station.location?.latitude || 20.5937, station.location?.longitude || 78.9629]}
                    zoom={15}
                    stations={[station]}
                    userLocation={userLocation}
                    showUserLocation={true}
                    height="400px"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-2">📍 Address</h4>
                  <p className="text-blue-800">{station.location?.address}</p>
                  
                  {userLocation && (
                    <div className="mt-4 flex space-x-4">
                      <a
                        href={`https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${station.location?.latitude},${station.location?.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span className="mr-2">🗺️</span>
                        Get Directions
                      </a>
                      
                      <a
                        href={`https://maps.google.com/?q=${station.location?.latitude},${station.location?.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <span className="mr-2">📱</span>
                        Open in Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "booking" && user && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">📅</span>
                  Book This Station
                </h3>
                <BookingForm 
                  stationId={id} 
                  station={station} 
                  onSuccess={() => {
                    alert("Booking request sent successfully!");
                    // Optionally refresh station data or redirect
                  }} 
                />
              </div>
            )}

            {activeTab === "comments" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">⭐</span>
                  Reviews & Comments
                </h3>
                {user && (
                  <div className="mb-8">
                    <CommentForm 
                      stationId={id} 
                      userId={user._id} 
                      onSuccess={() => window.location.reload()} 
                    />
                  </div>
                )}
                <div>
                  <CommentList comments={station.comments || []} />
                </div>
              </div>
            )}

            {activeTab === "chat" && user && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">💬</span>
                  Chat with Station Owner
                </h3>
                <div className="border rounded-lg">
                  <ChatWindow stationId={id} userId={user._id} />
                </div>
              </div>
            )}

            {/* Show login message for non-authenticated users */}
            {!user && (activeTab === "booking" || activeTab === "chat") && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                <p className="text-gray-600 mb-6">
                  Please login to {activeTab === "booking" ? "book this station" : "chat with the station owner"}.
                </p>
                <div className="space-x-4">
                  <Button onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/register")}>
                    Sign Up
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetails;