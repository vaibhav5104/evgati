import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { stationService } from "../../services/stationService";
import { availabilityService } from "../../services/availabilityService";
import { commentService } from "../../services/commentService";
import { useAuth } from "../../store/auth";

const StationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useAuth()
  const {getStationById} = stationService()
  const {getAvailability} = availabilityService()
  const {getComments} = commentService()
  const {addComment} = commentService()
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const stationData = await getStationById(id);
        setStation(stationData);

        const availabilityData = await getAvailability(id);
        setAvailability(availabilityData);

        const commentsData = await getComments(id);
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (err) {
        console.error("Error fetching station data:", err);
        setError("Failed to load station details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

const handleAddComment = async () => {
  // 1. Validate that either a comment or a rating exists.
  if (!newComment.trim() && rating === 0) {
    alert("Please leave a rating or write a comment before posting.");
    return;
  }

  try {
    setIsSubmittingComment(true);
    
    // 2. Create a payload that includes both text and rating.
    const payload = { 
      stationId: id,
      userId: "68bd946f6dd674af53b2437e",
      text: newComment, 
      rating: rating 
    };
    // console.log("payload:", payload);

    // Add the comment
    await addComment(payload);
    
    // Refetch all comments to get properly populated data
    const updatedComments = await getComments(id);
    setComments(Array.isArray(updatedComments) ? updatedComments : []);
    
    setNewComment("");
    setRating(0); // 3. Reset the rating state after successful submission.

  } catch (err) {
    console.error("Error adding comment:", err);
    alert("Failed to add review. Please try again.");
  } finally {
    setIsSubmittingComment(false);
  }
};

  const getAvailabilityColor = (isAvailable) =>
    isAvailable ? "text-green-600" : "text-red-600";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading station details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Station</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Station Not Found</h2>
          <p className="text-gray-600 mb-6">The requested charging station could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{station.name}</h1>
              <p className="text-gray-600">{station.location?.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Station Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Station Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{station.location?.address}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                    <p className="text-gray-900 font-mono text-sm">
                      {station.location?.latitude?.toFixed(6)}, {station.location?.longitude?.toFixed(6)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Charging Ports</label>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-600">{station.totalPorts}</span>
                      <span className="ml-2 text-gray-600">
                        {station.totalPorts === 1 ? "Port" : "Ports"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Station ID</label>
                    <p className="text-gray-900 font-mono text-sm">{station._id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            {availability && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Current Availability
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${getAvailabilityColor(availability.is_available)}`}>
                      {availability.is_available ? "Available" : "Occupied"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Status</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {availability.occupiedPorts || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Occupied Ports</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {availability.last_updated ? new Date(availability.last_updated).toLocaleDateString() : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Last Updated</div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments & Ratings Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Reviews & Comments ({comments.length})
              </h2>
              
              {/* Add Comment & Rating Form */}
              <div className="mb-6 border-b pb-6">
                {/* NEW: Star Rating Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate this station:</label>
                  <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                      >
                        <svg
                          className={`w-8 h-8 transition-colors ${
                            star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.07 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <input
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this charging station..."
                    onKeyPress={(e) => e.key === "Enter" && !isSubmittingComment && handleAddComment()}
                  />
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddComment}
                    disabled={isSubmittingComment || (!newComment.trim() && rating === 0)}
                  >
                    {isSubmittingComment ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
              
              {/* Comments List - Now with limited height and scroll */}
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No reviews yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  comments.map((comment, idx) => (
                    <div key={idx} className="border-l-4 border-blue-100 bg-gray-50 p-4 rounded-r-lg">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 shrink-0">
                          {comment.author?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <span className="font-medium text-gray-900">
                                {comment.author || "Anonymous User"}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Recently"}
                              </span>
                            </div>
                            {/* BONUS: Display the rating for each comment */}
                            {comment.rating && (
                              <div className="flex items-center">
                                <span className="text-yellow-500 font-bold mr-1">{comment.rating}</span>
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.07 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" /></svg>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${station.location?.latitude},${station.location?.longitude}`;
                    window.open(url, "_blank");
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </button>
                
                <button 
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    navigator.share && navigator.share({
                      title: station.name,
                      text: `Check out this EV charging station: ${station.name} at ${station.location?.address}`,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    });
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Station
                </button>
              </div>
            </div>

            {/* Station Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Ports</span>
                  <span className="font-semibold">{station.totalPorts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Ports</span>
                  <span className="font-semibold">
                    {station.totalPorts - (availability?.occupiedPorts || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupied Ports</span>
                  <span className="font-semibold">{availability?.occupiedPorts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">
                    {station.ports?.reduce((acc, port) => acc + (port.bookings?.length || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* End Sidebar */}
        </div>
      </div>
    </div>
  );
};

export default StationDetails;

