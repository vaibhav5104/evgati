import { Link } from 'react-router-dom';
import { Home, MapPin, Search, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
        
        {/* Floating charging stations */}
        <div className="absolute top-20 left-10 animate-float opacity-20">
          <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3L5 11h5l-1 6 6-8h-5l1-6z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-20 animate-float opacity-20" style={{ animationDelay: '1s' }}>
          <svg className="w-20 h-20 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3L5 11h5l-1 6 6-8h-5l1-6z"/>
          </svg>
        </div>
        <div className="absolute top-1/3 right-10 animate-float opacity-20" style={{ animationDelay: '2s' }}>
          <svg className="w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3L5 11h5l-1 6 6-8h-5l1-6z"/>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          {/* Broken charging cable illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Large 404 with EV theme */}
              <div className="relative">
                <h1 className="text-[150px] sm:text-[200px] font-black leading-none">
                  <span className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                    4
                  </span>
                  <span className="relative inline-block mx-2">
                    {/* Electric plug as "0" */}
                    <div className="w-24 h-32 sm:w-32 sm:h-40 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl relative inline-block transform hover:scale-110 transition-transform">
                      {/* Plug prongs */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <div className="w-3 h-6 bg-gray-600 rounded-b"></div>
                        <div className="w-3 h-6 bg-gray-600 rounded-b"></div>
                      </div>
                      {/* Disconnected lightning */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3L5 11h5l-1 6 6-8h-5l1-6z"/>
                        </svg>
                      </div>
                      {/* Disconnection indicator */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full"></div>
                    </div>
                  </span>
                  <span className="bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                    4
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Error message */}
          <div className="mb-8 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Connection Lost
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto">
              Oops! This charging station doesn't exist. The page you're looking for has been disconnected.
            </p>
          </div>

          {/* Status indicator */}
          <div className="mb-10 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Route Not Found</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Back to Home</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </Link>

            <Link
              to="/stations"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200"
            >
              <MapPin className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>Find Stations</span>
            </Link>
          </div>

          {/* Additional help text */}
          <div className="mt-12 p-6 bg-white/80 backdrop-blur rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  What you can do:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Check the URL for typos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Visit our homepage to find nearby charging stations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Contact support if you believe this is an error</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-40px) rotate(0deg); }
          75% { transform: translateY(-20px) rotate(-5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};