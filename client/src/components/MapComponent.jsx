// // export default MapComponent;
// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Custom marker icons based on station status and type
// const createCustomIcon = (station) => {
//   let color = '#10B981'; // Green for active
//   let iconSymbol = '⚡';
  
//   if (station.status === 'inactive') {
//     color = '#EF4444'; // Red for inactive
//   } else if (station.status === 'maintenance') {
//     color = '#F59E0B'; // Yellow for maintenance
//   }
  
//   if (station.is_fast_dc) {
//     iconSymbol = '🚀';
//   }
  
//   return L.divIcon({
//     html: `
//       <div style="
//         background-color: ${color};
//         width: 32px;
//         height: 32px;
//         border-radius: 50%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         border: 3px solid white;
//         box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//         font-size: 16px;
//         cursor: pointer;
//         transition: transform 0.2s;
//       " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
//         ${iconSymbol}
//       </div>
//     `,
//     className: 'custom-marker',
//     iconSize: [32, 32],
//     iconAnchor: [16, 16],
//     popupAnchor: [0, -16]
//   });
// };

// const MapComponent = ({ stations, onMarkerClick, selectedStation }) => {
//   return (
//     <div className="relative w-full h-full">
//       <MapContainer
//         center={[20.5937, 78.9629]} // India default
//         zoom={5}
//         style={{ height: "100%", width: "100%", zIndex: 1 }}
//         zoomControl={true}
//         scrollWheelZoom={true}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
        
//         {stations.map((station) => (
//           <Marker
//             key={station._id}
//             position={[station.latitude, station.longitude]}
//             icon={createCustomIcon(station)}
//             eventHandlers={{
//               click: () => onMarkerClick(station),
//             }}
//           >
//             <Popup className="custom-popup" closeButton={false}>
//               <div className="p-2 min-w-0">
//                 <div className="flex items-start justify-between mb-2">
//                   <h3 className="font-semibold text-gray-900 text-sm leading-tight">
//                     {station.name}
//                   </h3>
//                   <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
//                     station.status === 'active' ? 'bg-green-100 text-green-800' :
//                     station.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {station.status}
//                   </div>
//                 </div>
                
//                 <div className="space-y-1 text-xs text-gray-600">
//                   <div className="flex items-center">
//                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     {station.city}
//                   </div>
                  
//                   <div className="flex items-center">
//                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                     </svg>
//                     {station.power_kw ? `${station.power_kw} kW` : 'N/A'} • {station.power_class}
//                     {station.is_fast_dc && ' • Fast DC'}
//                   </div>
                  
//                   <div className="flex items-center">
//                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {station.ports} {station.ports === 1 ? 'Port' : 'Ports'}
//                   </div>
//                 </div>
                
//                 <button
//                   className="w-full mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onMarkerClick(station);
//                   }}
//                 >
//                   View Details
//                 </button>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
      
//       {/* Map Controls */}
//       <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-3">
//         <div className="text-sm font-medium text-gray-700 mb-2">Legend</div>
//         <div className="space-y-2 text-xs">
//           <div className="flex items-center">
//             <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs">⚡</div>
//             <span>Active Station</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs">🚀</div>
//             <span>Fast DC Charging</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2 flex items-center justify-center text-white text-xs">⚡</div>
//             <span>Maintenance</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 rounded-full bg-red-500 mr-2 flex items-center justify-center text-white text-xs">⚡</div>
//             <span>Inactive</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapComponent;
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker (same icon for now since model has no status)
const createCustomIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #10B981;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 16px;
        cursor: pointer;
      ">
        ⚡
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const MapComponent = ({ stations, onMarkerClick }) => {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[20.5937, 78.9629]} // India default
        zoom={5}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {stations.map((station) => (
          <Marker
            key={station._id}
            position={[station.location.latitude, station.location.longitude]}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => onMarkerClick(station),
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-2 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {station.name}
                </h3>
                <p className="text-xs text-gray-600">{station.location.address}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {station.totalPorts} {station.totalPorts === 1 ? "Port" : "Ports"}
                </p>

                <button
                  className="w-full mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkerClick(station);
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
