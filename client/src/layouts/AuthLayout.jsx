import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Glassmorphic rounded navbar */}
      <header className="fixed  left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="backdrop-blur-md bg-white/70 border border-white/20 shadow-lg rounded-full px-6 py-3 transition-all duration-300 hover:shadow-xl hover:bg-white/80">
          <div className="flex justify-center items-center">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <img
                  className="h-8 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                  src="https://evgati.vercel.app/favicon-50.png"
                  alt="EvGati Logo"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-orange-600 group-hover:to-amber-600">
                EvGati
              </span>
            </a>
          </div>
        </div>
      </header>
      
      {/* Main content with top padding to account for fixed navbar */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;