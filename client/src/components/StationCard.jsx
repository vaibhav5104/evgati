// import React from "react";
// import { useNavigate } from "react-router-dom";

// const StationCard = ({ station, onClose, isExpanded = false }) => {
//   const navigate = useNavigate();

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800 border-green-200';
//       case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getPowerClassIcon = (powerClass, isFastDc) => {
//     if (isFastDc) return '🚀';
//     return powerClass === 'DC' ? '⚡' : '🔌';
//   };

//   if (!isExpanded) {
//     return (
//       <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
//         <div className="flex items-start justify-between mb-3">
//           <h2 className="text-lg font-semibold text-gray-900">{station.name}</h2>
//           <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(station.status)}`}>
//             {station.status}
//           </div>
//         </div>
        
//         <div className="text-sm text-gray-600 mb-3">
//           <p className="flex items-center mb-1">
//             <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//             {station.city}
//           </p>
//         </div>
        
//         <button
//           className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//           onClick={() => navigate(`/stations/${station._id}`)}
//         >
//           View Details
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-white overflow-hidden flex flex-col">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
        
//         <div className="pr-12">
//           <div className="flex items-center mb-2">
//             <div className="text-2xl mr-3">
//               {getPowerClassIcon(station.power_class, station.is_fast_dc)}
//             </div>
//             <div>
//               <h1 className="text-xl font-bold leading-tight">{station.name}</h1>
//               <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(station.status)} bg-opacity-20 border-0 text-white`}>
//                 {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto p-6">
//         {/* Location Info */}
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//             </svg>
//             Location
//           </h2>
//           <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//             <div className="flex items-center text-sm">
//               <span className="font-medium text-gray-700 w-16">City:</span>
//               <span className="text-gray-600">{station.city}</span>
//             </div>
//             {station.state_province && (
//               <div className="flex items-center text-sm">
//                 <span className="font-medium text-gray-700 w-16">State:</span>
//                 <span className="text-gray-600">{station.state_province}</span>
//               </div>
//             )}
//             <div className="flex items-center text-sm">
//               <span className="font-medium text-gray-700 w-16">Country:</span>
//               <span className="text-gray-600">{station.country_code}</span>
//             </div>
//             <div className="flex items-center text-sm">
//               <span className="font-medium text-gray-700 w-16">Coords:</span>
//               <span className="text-gray-600 font-mono text-xs">{station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Charging Info */}
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//             <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//             Charging Details
//           </h2>
//           <div className="bg-gray-50 rounded-lg p-4 space-y-3">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
//                 <div className="text-2xl font-bold text-blue-600">{station.ports}</div>
//                 <div className="text-xs text-gray-600 uppercase tracking-wide">
//                   {station.ports === 1 ? 'Port' : 'Ports'}
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
//                 <div className="text-2xl font-bold text-green-600">
//                   {station.power_kw ? `${station.power_kw}` : 'N/A'}
//                 </div>
//                 <div className="text-xs text-gray-600 uppercase tracking-wide">
//                   {station.power_kw ? 'kW' : 'Power'}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-gray-700">Power Type:</span>
//               <div className="flex items-center">
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   station.power_class === 'DC' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
//                 }`}>
//                   {station.power_class}
//                 </span>
//                 {station.is_fast_dc && (
//                   <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
//                     Fast DC
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
//           <div className="grid grid-cols-2 gap-3">
//             <button 
//               className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               onClick={() => {
//                 const url = `https://www.google.com/maps?q=${station.latitude},${station.longitude}`;
//                 window.open(url, '_blank');
//               }}
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
//               </svg>
//               Directions
//             </button>
//             <button 
//               className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               onClick={() => navigate(`/stations/${station._id}`)}
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Full Details
//             </button>
//           </div>
//         </div>

//         {/* Additional Info */}
//         <div className="border-t pt-4">
//           <div className="text-xs text-gray-500 space-y-1">
//             <p>Station ID: {station._id}</p>
//             <p>Last updated: {station.updatedAt ? new Date(station.updatedAt).toLocaleDateString() : 'N/A'}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StationCard;

import React from "react";
import { useNavigate } from "react-router-dom";

const StationCard = ({ station, onClose, isExpanded = false }) => {
  const navigate = useNavigate();

  if (!isExpanded) {
    return (
      <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">{station.name}</h2>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <p className="flex items-center mb-1">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {station.location?.address}
          </p>
        </div>
        
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          onClick={() => navigate(`/stations/${station._id}`)}
        >
          View Details
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="pr-12">
          <h1 className="text-xl font-bold leading-tight">{station.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Location Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Location
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center text-sm">
              <span className="font-medium text-gray-700 w-20">Address:</span>
              <span className="text-gray-600">{station.location?.address}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium text-gray-700 w-20">Coords:</span>
              <span className="text-gray-600 font-mono text-xs">
                {station.location?.latitude?.toFixed(4)}, {station.location?.longitude?.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Charging Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Charging Details
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{station.totalPorts}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  {station.totalPorts === 1 ? 'Port' : 'Ports'}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{station.ports?.length || 0}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  Active Connections
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => {
                const url = `https://www.google.com/maps?q=${station.location?.latitude},${station.location?.longitude}`;
                window.open(url, '_blank');
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Directions
            </button>
            <button 
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => navigate(`/stations/${station._id}`)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Full Details
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t pt-4">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Station ID: {station._id}</p>
            <p>Last updated: {station.updatedAt ? new Date(station.updatedAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationCard;
