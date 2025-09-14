import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { stationService } from "../services/stationService";
import { BookingForm } from "../components/booking";
import { CommentForm, CommentList } from "../components/comment";
import { ChatWindow } from "../components/chat";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";

const StationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!station) return <div className="p-6">Station not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{station.name}</h1>
              <p className="text-gray-600">{station.location?.address}</p>
            </div>
            <Button
              onClick={() => navigate(`/stations/${id}/book`)}
              color="primary"
              size="lg"
            >
              Book Now
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-500">Total Ports</span>
              <p className="font-semibold">{station.totalPorts}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Price per Hour</span>
              <p className="font-semibold">₹{station.pricing?.perHour || 0}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Price per kWh</span>
              <p className="font-semibold">₹{station.pricing?.perKWh || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "details", label: "Details" },
                { id: "booking", label: "Book" },
                { id: "comments", label: "Comments" },
                { id: "chat", label: "Chat" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Station Details</h3>
                <p className="text-gray-700">{station.description || "No description available"}</p>
              </div>
            )}

            {activeTab === "booking" && user && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Book This Station</h3>
                <BookingForm stationId={id} onSuccess={() => alert("Booking requested!")} />
              </div>
            )}

            {activeTab === "comments" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Comments & Reviews</h3>
                {user && <CommentForm stationId={id} userId={user._id} onSuccess={() => window.location.reload()} />}
                <div className="mt-6">
                  <CommentList comments={station.comments || []} />
                </div>
              </div>
            )}

            {activeTab === "chat" && user && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Chat with Station Owner</h3>
                <ChatWindow stationId={id} userId={user._id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetails;
