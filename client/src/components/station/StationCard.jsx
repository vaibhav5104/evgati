import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { 
  MapPin, 
  Zap, 
  Navigation, 
  Info, 
  Calendar,
  Wifi,
  Coffee,
  Clock,
  Star,
  ChevronRight
} from "lucide-react";

const StationCard = ({ station, onClose, isExpanded = false }) => {
  const navigate = useNavigate();

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'success';
    }
  };

  // Get amenity icons
  const getAmenityIcon = (amenity) => {
    switch(amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'cafe': return <Coffee className="w-4 h-4" />;
      case '24x7': return <Clock className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  // Calculate available ports
  const availablePorts = station.totalPorts - (station.ports?.filter(p => p.bookings?.some(b => b.status === 'active')).length || 0);

  if (!isExpanded) {
    return (
      <Card 
        hover 
        variant="default"
        padding="p-0"
        className="overflow-hidden group cursor-pointer"
        onClick={() => navigate(`/stations/${station._id}`)}
      >
        {/* Station Image with Overlapped Header */}
        <div className="relative">
          {station.images?.[0] ? (
            <>
              <img 
                src={station.images[0]} 
                alt={station.name}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </>
          ) : (
            <>
              <div className="relative h-56 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center">
                <Zap className="w-24 h-24 text-white opacity-20" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </>
          )}
          
          {/* Status Badge on Image */}
          <div className="absolute top-3 right-3">
            <Card.Badge variant={getStatusVariant(station.status)}>
              {availablePorts > 0 ? 'Available' : 'Full'}
            </Card.Badge>
          </div>

          {/* Overlapped Header on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-start gap-3 mb-2">
              {/* <div className="flex-shrink-0 w-6 h-6 pt-2 rounded-xl  flex items-center justify-center ">
                <Zap className="w-6 h-6 text-white " fill="green" />
              </div> */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white drop-shadow-lg mb-1 truncate">
                  {station.name}
                </h3>
                <div className="flex items-center gap-2 text-white/90 text-sm drop-shadow">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <p className="truncate">{station.location?.address || 'Address not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Stats */}
          <Card.Stats 
            className="mb-4"
            stats={[
              { 
                value: station.totalPorts || 0, 
                label: 'Total Ports',
                icon: <Zap className="w-4 h-4" />
              },
              { 
                value: availablePorts, 
                label: 'Available',
                icon: <Info className="w-4 h-4" />
              }
            ]} 
          />

          {/* Rating if available */}
          {station.rating?.average > 0 && (
            <div className="mb-4">
              <Card.Rating 
                rating={station.rating.average} 
                count={station.rating.count}
              />
            </div>
          )}

          {/* Amenities */}
          {station.amenities && station.amenities.length > 0 && (
            <div className="mb-4">
              <Card.Features 
                features={station.amenities.slice(0, 3).map(amenity => ({
                  label: amenity,
                  icon: getAmenityIcon(amenity)
                }))}
              />
            </div>
          )}

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {station.pricing?.perHour > 0 ? (
              <Card.Price 
                price={station.pricing.perHour} 
                unit="/hour"
              />
            ) : (
              <div className="text-sm text-gray-500">Pricing not available</div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/stations/${station._id}`);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
            >
              <span>View</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Card>
    );
  }

  // Expanded Modal View (keeping your existing code)
  return (
    <div className="h-full bg-white overflow-hidden flex flex-col">
      {/* Header with Image */}
      {station.images?.[0] ? (
        <div className="relative h-64 overflow-hidden">
          <img 
            src={station.images[0]} 
            alt={station.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{station.name}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <p className="text-sm drop-shadow">{station.location?.address}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Card.Badge variant={getStatusVariant(station.status)}>
              {station.status === 'accepted' ? 'Active' : station.status || 'Available'}
            </Card.Badge>
          </div>
        </div>
      ) : (
        <div className="relative h-64 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 flex items-center justify-center">
          <Zap className="w-32 h-32 text-white opacity-20" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{station.name}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <p className="text-sm">{station.location?.address}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Card.Badge variant={getStatusVariant(station.status)}>
              {station.status === 'accepted' ? 'Active' : station.status || 'Available'}
            </Card.Badge>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Rating */}
        {station.rating?.average > 0 && (
          <div className="mb-6">
            <Card.Rating 
              rating={station.rating.average} 
              count={station.rating.count}
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Station Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200/50">
              <div className="text-3xl font-bold text-green-600">{station.totalPorts}</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">Total Ports</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center border border-blue-200/50">
              <div className="text-3xl font-bold text-blue-600">{availablePorts}</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">Available</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-200/50">
              <div className="text-3xl font-bold text-purple-600">{station.stats?.totalBookings || 0}</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">Total Bookings</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 text-center border border-orange-200/50">
              <div className="text-3xl font-bold text-orange-600">{station.stats?.completedBookings || 0}</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wide">Completed</div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Location Details
          </h2>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 space-y-3 border border-gray-200/50">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-gray-700">Address</span>
              <span className="text-sm text-gray-600 text-right max-w-xs">{station.location?.address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">City</span>
              <span className="text-sm text-gray-600">{station.city || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">State</span>
              <span className="text-sm text-gray-600">{station.state || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Coordinates</span>
              <span className="text-xs text-gray-500 font-mono">
                {station.location?.latitude?.toFixed(4)}, {station.location?.longitude?.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        {(station.pricing?.perHour > 0 || station.pricing?.perKWh > 0) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-3">
              {station.pricing.perHour > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                  <div className="text-sm text-gray-600 mb-1">Per Hour</div>
                  <div className="text-2xl font-bold text-green-600">₹{station.pricing.perHour}</div>
                </div>
              )}
              {station.pricing.perKWh > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200/50">
                  <div className="text-sm text-gray-600 mb-1">Per kWh</div>
                  <div className="text-2xl font-bold text-blue-600">₹{station.pricing.perKWh}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amenities & Features */}
        {station.amenities && station.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
            <Card.Features 
              features={station.amenities.map(amenity => ({
                label: amenity,
                icon: getAmenityIcon(amenity)
              }))}
            />
          </div>
        )}

        {/* Charger Types */}
        {station.chargerTypes && station.chargerTypes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Charger Types</h2>
            <div className="flex flex-wrap gap-2">
              {station.chargerTypes.map((type, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium shadow-md"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Operating Hours */}
        {station.operatingHours && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Operating Hours
            </h2>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50">
              {station.operatingHours.is24x7 ? (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-gray-900">Open 24/7</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Operating Hours</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {station.operatingHours.open} - {station.operatingHours.close}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="success"
              className="w-full"
              onClick={() => {
                const url = `https://www.google.com/maps?q=${station.location?.latitude},${station.location?.longitude}`;
                window.open(url, '_blank');
              }}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate(`/stations/${station._id}`)}
            >
              <Info className="w-4 h-4 mr-2" />
              Full Details
            </Button>
            <Button
              variant="success"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              onClick={() => navigate(`/stations/${station._id}/book`)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t pt-4 mt-6">
          <div className="text-xs text-gray-500 space-y-1">
            <p className="flex items-center justify-between">
              <span>Station ID:</span>
              <span className="font-mono">{station._id}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Last Updated:</span>
              <span>{station.updatedAt ? new Date(station.updatedAt).toLocaleDateString() : 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationCard;