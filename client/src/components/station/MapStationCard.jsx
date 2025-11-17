import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { 
  MapPin, 
  Zap
} from "lucide-react";

const MapStationCard = ({ station, onRemove }) => {
  const navigate = useNavigate();

  return (
          <Card 
              padding="p-0"
              className="overflow-hidden group">
            {/* Cancel / Remove Icon */}
            <button
              onClick={() => onRemove(station._id)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 transition"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>

            <Card.Header withDivider>
                  <Card.Title 
                    icon={<Zap className="w-5 h-5 text-white" />}
                  >
                    {station.name}
                  </Card.Title>
                  <Card.Subtitle icon={<MapPin className="w-4 h-4" />}>
                    {station.location?.address || 'Address not available'}
                  </Card.Subtitle>
                </Card.Header>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate(`/stations/${station._id}`)}
            >
              View Details
            </Button>
          </Card>
    
          );

};

export default MapStationCard;
