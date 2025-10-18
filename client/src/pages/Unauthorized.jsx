import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Home, LogIn, ArrowLeft, AlertTriangle } from 'lucide-react';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
        
        {/* Floating security icons */}
        <div className="absolute top-20 left-10 animate-float opacity-10">
          <Lock className="w-20 h-20 text-red-500" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float opacity-10" style={{ animationDelay: '1s' }}>
          <ShieldAlert className="w-24 h-24 text-orange-500" />
        </div>
        <div className="absolute top-1/3 right-10 animate-float opacity-10" style={{ animationDelay: '2s' }}>
          <AlertTriangle className="w-16 h-16 text-red-400" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          {/* Lock illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Large 403 with security theme */}
              <div className="relative mb-8">
                <h1 className="text-[150px] sm:text-[200px] font-black leading-none">
                  <span className="bg-gradient-to-br from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    4
                  </span>
                  <span className="relative inline-block mx-2">
                    {/* Locked padlock as "0" */}
                    <div className="relative inline-flex items-center justify-center">
                      {/* Lock body */}
                      <div className="w-24 h-28 sm:w-32 sm:h-36 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl relative transform hover:scale-110 transition-transform shadow-2xl">
                        {/* Lock shackle */}
                        <div className="absolute -top-12 sm:-top-16 left-1/2 transform -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 border-8 border-red-600 rounded-t-full"></div>
                        
                        {/* Keyhole */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-4 h-4 bg-red-900 rounded-full"></div>
                          <div className="w-2 h-8 bg-red-900 mt-1"></div>
                        </div>

                        {/* Locked indicator */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Security waves */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 border-2 border-red-400 rounded-full animate-ping opacity-75"></div>
                        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 border-2 border-orange-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  </span>
                  <span className="bg-gradient-to-br from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    3
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Error message */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShieldAlert className="w-10 h-10 text-red-600 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Access Denied
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto">
              You don't have permission to access this charging station. This area is restricted.
            </p>
          </div>

          {/* Status indicator */}
          <div className="mb-10 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Unauthorized Access</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transform hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
              <span>Go Back</span>
            </button>

            <Link
              to="/dashboard"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Go to Dashboard</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </Link>
          </div>

          {/* Additional help section */}
          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {/* Security notice */}
            <div className="p-6 bg-white/80 backdrop-blur rounded-2xl shadow-md border border-gray-100 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Why am I seeing this?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></div>
                      <span>You may not have the required role</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></div>
                      <span>Your session might have expired</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"></div>
                      <span>This page is admin/owner only</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Login prompt */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-md border border-blue-100 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <LogIn className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Need access?
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Try logging in with proper credentials or contact your administrator.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                </div>
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