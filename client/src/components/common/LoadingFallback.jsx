export const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
    {/* Animated background grid */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>

    {/* Main content */}
    <div className="relative z-10 text-center px-4">
      {/* EV Charging Station Icon */}
      <div className="relative mb-8 mx-auto w-24 h-24">
        {/* Charging station pole */}
        <div className="absolute left-1/2 top-8 w-2 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full transform -translate-x-1/2"></div>
        
        {/* Charging plug with animation */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
          <div className="relative">
            {/* Plug head */}
            <div className="w-12 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg">
              {/* Plug prongs */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="flex gap-1">
                  <div className="w-2 h-3 bg-gray-700 rounded-b"></div>
                  <div className="w-2 h-3 bg-gray-700 rounded-b"></div>
                </div>
              </div>
              
              {/* Lightning bolt icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3L5 11h5l-1 6 6-8h-5l1-6z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Rotating energy circle */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-transparent border-t-green-500 border-r-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Pulsing energy dots */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute left-0 top-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute right-0 top-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Battery charging indicator */}
      <div className="mb-6 mx-auto w-32 h-12 border-3 border-gray-700 rounded-lg relative overflow-hidden bg-white">
        {/* Battery tip */}
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-gray-700 rounded-r"></div>
        
        {/* Charging animation */}
        <div className="absolute inset-0.5 bg-gradient-to-r from-green-400 to-green-500 animate-pulse origin-left">
          <div className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-[shimmer_2s_ease-in-out_infinite]"></div>
        </div>

        {/* Lightning bolt in battery */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-white z-10 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3L5 11h5l-1 6 6-8h-5l1-6z"/>
          </svg>
        </div>
      </div>

      {/* Loading text with dots animation */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
          EvGati
        </h3>
        <p className="text-gray-700 font-medium flex items-center justify-center gap-1">
          Charging your experience
          <span className="inline-flex gap-0.5">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-64 mx-auto h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]"></div>
      </div>
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-40"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-float opacity-40" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-40" style={{ animationDelay: '3s', animationDuration: '6s' }}></div>
    </div>

    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(-40px) translateX(-10px); }
        75% { transform: translateY(-20px) translateX(10px); }
      }
    `}</style>
  </div>
);