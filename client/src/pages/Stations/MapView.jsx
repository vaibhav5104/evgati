// import React, { useEffect, useState } from "react";
// import { stationService } from "../../services/stationService";
// import MapComponent from "../../components/MapComponent";
// import StationCard from "../../components/StationCard";

// const MapView = () => {
//   const [stations, setStations] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [sidePanelOpen, setSidePanelOpen] = useState(false);

//   useEffect(() => {
//     const fetchStations = async () => {
//       try {
//         setIsLoading(true);
//         const data = await stationService.getAllStations();
//         setStations(data);
//       } catch (error) {
//         console.error("Error fetching stations:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchStations();
//   }, []);

//   const handleStationSelect = (station) => {
//     setSelectedStation(station);
//     setSidePanelOpen(true);
//   };

//   const handleCloseSidePanel = () => {
//     setSidePanelOpen(false);
//     setSelectedStation(null);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading charging stations...</p>
//         </div>
//       </div>
//     );
//   }
//   console.log("stations : ",stations)


//   return (
//     <div className="relative h-screen bg-gray-50 overflow-hidden">
//       {/* Header */}
//       <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">EV Charging Stations</h1>
//               <p className="text-sm text-gray-600 mt-1">
//                 {stations.length} stations available
//               </p>
//             </div>
//             <div className="flex items-center space-x-2 text-sm text-gray-500">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
//                 Active
//               </div>
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
//                 Maintenance
//               </div>
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
//                 Inactive
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Map Container */}
//       <div className="absolute inset-0 pt-20">
//         <MapComponent 
//           stations={stations} 
//           onMarkerClick={handleStationSelect}
//           selectedStation={selectedStation}
//         />
//       </div>

//       {/* Side Panel */}
//       <div 
//         className={`absolute top-20 right-0 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-20 ${
//           sidePanelOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//         style={{ width: '400px' }}
//       >
//         {selectedStation && (
//           <StationCard 
//             station={selectedStation} 
//             onClose={handleCloseSidePanel}
//             isExpanded={true}
//           />
//         )}
//       </div>

//       {/* Overlay when side panel is open */}
//       {sidePanelOpen && (
//         <div 
//           className="absolute inset-0  bg-opacity-0 z-10"
//           onClick={handleCloseSidePanel}
//         />
//       )}

//       {/* Info card when no station selected */}
//       {!sidePanelOpen && (
//         <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
//           <div className="flex items-center text-blue-600 mb-2">
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="font-medium">How to use</span>
//           </div>
//           <p className="text-gray-600 text-sm">
//             Click on any charging station pin on the map to view detailed information and get directions.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapView;

import React, { useEffect, useState } from "react";
import { stationService } from "../../services/stationService";
import MapComponent from "../../components/MapComponent";
import StationCard from "../../components/StationCard";

const MapView = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const { getAllStations } = stationService();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        const data = await getAllStations();
        setStations(data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setSidePanelOpen(true);
  };

  const handleCloseSidePanel = () => {
    setSidePanelOpen(false);
    setSelectedStation(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading charging stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EV Charging Stations</h1>
              <p className="text-sm text-gray-600 mt-1">
                {stations.length} stations available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 pt-20">
        <MapComponent 
          stations={stations} 
          onMarkerClick={handleStationSelect}
          selectedStation={selectedStation}
        />
      </div>

      {/* Side Panel */}
      <div 
        className={`absolute top-20 right-0 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-20 ${
          sidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '400px' }}
      >
        {selectedStation && (
          <StationCard 
            station={selectedStation} 
            onClose={handleCloseSidePanel}
            isExpanded={true}
          />
        )}
      </div>

      {/* Overlay */}
      {sidePanelOpen && (
        <div 
          className="absolute inset-0 bg-opacity-0 z-10"
          onClick={handleCloseSidePanel}
        />
      )}
    </div>
  );
};

export default MapView;
