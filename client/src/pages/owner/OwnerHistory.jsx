// import React, { useEffect, useState } from "react";
// import { historyService } from "../../services/historyService";

// const OwnerHistory = () => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLogs = async () => {
//       setLoading(true);
//       try {
//         const data = await historyService.getOwnerHistory();
//         setLogs(data.history || []);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch owner history.");
//         console.error(err);
//       }
//       setLoading(false);
//     };
//     fetchLogs();
//   }, []);

//   // Helper function to format dates for better readability
//   const formatDateTime = (isoString) => {
//     if (!isoString) return 'N/A';
//     return new Date(isoString).toLocaleString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };
  
//   // Helper to get status badge styles
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'accepted':
//         return 'bg-green-100 text-green-800';
//       case 'rejected':
//         return 'bg-red-100 text-red-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const renderSkeleton = () => (
//     <div className="space-y-4">
//       {[...Array(3)].map((_, i) => (
//         <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
//           <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//           <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
//           <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
//           <div className="h-3 bg-gray-200 rounded w-1/4"></div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-6">
//             <h1 className="text-3xl font-bold text-gray-800">Owner History</h1>
//             <p className="text-gray-500 mt-1">A log of all booking activities across your stations.</p>
//         </div>

//         {error && (
//             <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-6">
//                 <strong>Error:</strong> {error}
//             </div>
//         )}

//         {loading ? (
//           renderSkeleton()
//         ) : logs.length === 0 ? (
//           <div className="text-center bg-white p-12 rounded-lg border border-dashed">
//              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                 <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//              </svg>
//              <h3 className="mt-2 text-sm font-medium text-gray-900">No History Found</h3>
//              <p className="mt-1 text-sm text-gray-500">There are no booking history records yet.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {logs.map((log) => (
//               <div key={log._id} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
//                 <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
//                   <div className="mb-2 sm:mb-0">
//                     <p className="font-semibold text-lg text-gray-800">{log.stationId.name}</p>
//                     <p className="text-sm text-gray-500">{log.stationId.location.address}</p>
//                   </div>
//                   <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(log.status)}`}>
//                     {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
//                   </span>
//                 </div>
                
//                 <div className="border-t border-gray-200 pt-3">
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
//                         <div>
//                             <p className="text-gray-500">Port</p>
//                             <p className="font-medium text-gray-700">#{log.portId}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Booking Time</p>
//                             <p className="font-medium text-gray-700">{formatDateTime(log.startTime)} - {new Date(log.endTime).toLocaleTimeString('en-IN', {hour: 'numeric', minute: '2-digit', hour12: true})}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Logged On</p>
//                             <p className="font-medium text-gray-700">{formatDateTime(log.createdAt)}</p>
//                         </div>
//                     </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OwnerHistory;

import React, { useEffect, useState, useMemo } from "react";
import { historyService } from "../../services/historyService";

const OwnerHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await historyService.getOwnerHistory();
        setLogs(data.history || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch owner history.");
        console.error(err);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  // Calculate statistics using useMemo for efficiency
  const stats = useMemo(() => {
    return logs.reduce((acc, log) => {
      acc.total++;
      if (log.status === 'accepted') {
        acc.accepted++;
      } else if (log.status === 'rejected') {
        acc.rejected++;
      }
      else if (log.status === 'pending') {
        acc.pending++;
      }
      return acc;
    }, { total: 0, accepted: 0, rejected: 0, pending : 0 });
  }, [logs]);


  // Helper function to format dates for better readability
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  // Helper to get status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Owner History</h1>
            <p className="text-gray-500 mt-1">A log of all booking activities across your stations.</p>
        </div>

        {/* --- STATS SUMMARY SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-semibold text-gray-800">{loading ? '-' : stats.total}</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500">Accepted</p>
                    <p className="text-2xl font-semibold text-gray-800">{loading ? '-' : stats.accepted}</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <div className="bg-red-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-2xl font-semibold text-gray-800">{loading ? '-' : stats.rejected}</p>
                </div>
            </div>
        </div>

        {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-6">
                <strong>Error:</strong> {error}
            </div>
        )}

        {loading ? (
          renderSkeleton()
        ) : logs.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg border border-dashed">
             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
             <h3 className="mt-2 text-sm font-medium text-gray-900">No History Found</h3>
             <p className="mt-1 text-sm text-gray-500">There are no booking history records yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log._id} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-semibold text-lg text-gray-800">{log.stationId.name}</p>
                    <p className="text-sm text-gray-500">{log.stationId.location.address}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(log.status)}`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                            <p className="text-gray-500">Port</p>
                            <p className="font-medium text-gray-700">#{log.portId}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Booking Time</p>
                            <p className="font-medium text-gray-700">{formatDateTime(log.startTime)} - {new Date(log.endTime).toLocaleTimeString('en-IN', {hour: 'numeric', minute: '2-digit', hour12: true})}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Logged On</p>
                            <p className="font-medium text-gray-700">{formatDateTime(log.createdAt)}</p>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerHistory;


