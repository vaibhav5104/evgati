import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth';
import { MainLayout, AuthLayout, DashboardLayout } from './layouts';
import {
  Home,
  Login,
  Register,
  Dashboard,
  Stations,
} from './pages';

// Error boundary component
const ErrorBoundary = ({ children }) => {
  return children;
};

// 404 Not Found page
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go Home
      </a>
    </div>
  </div>
);

// Unauthorized access page
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl text-gray-600 mb-8">Access Denied</p>
      <a href="/dashboard" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go to Dashboard
      </a>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes with MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="stations" element={<Stations />} />
              <Route path="stations/:id" element={<div>Station Details - TODO</div>} />
            </Route>

            {/* Auth routes with AuthLayout */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Legacy auth routes (redirect to new structure) */}
            <Route path="/login" element={<AuthLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/register" element={<AuthLayout />}>
              <Route index element={<Register />} />
            </Route>

            {/* Protected routes with DashboardLayout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
            </Route>

            {/* Protected user routes */}
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div>My Bookings - TODO</div>} />
            </Route>

            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div>Profile - TODO</div>} />
            </Route>

            <Route path="/add-station" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div>Add Station - TODO</div>} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div>Admin Dashboard - TODO</div>} />
              <Route path="stations" element={<div>Manage Stations - TODO</div>} />
              <Route path="users" element={<div>Manage Users - TODO</div>} />
              <Route path="pending" element={<div>Pending Approvals - TODO</div>} />
            </Route>

            {/* Owner routes */}
            <Route path="/owner/*" element={
              <ProtectedRoute requiredRole="owner">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div>Owner Dashboard - TODO</div>} />
              <Route path="stations" element={<div>My Stations - TODO</div>} />
              <Route path="requests" element={<div>Booking Requests - TODO</div>} />
              <Route path="analytics" element={<div>Analytics - TODO</div>} />
            </Route>

            {/* Error routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};