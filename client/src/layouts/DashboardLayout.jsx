import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../components/common';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 ml-64 bg-gray-50">
          <Outlet />
        </main>
      </div>
      <footer className="bg-white shadow-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} EvGati. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
