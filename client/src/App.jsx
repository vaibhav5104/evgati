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
  StationDetails,
  Profile,
  AddStation,
  BookingPage,
  AdminDashboard,
  ManageStations,
  ManageUsers,
  PendingApprovals,
  SystemHistory,
  OwnerDashboard,
  MyStations,
  StationRequests,
  Analytics,
  OwnerHistory,
  Bookings,
  BookingHistory,
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

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes with MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
            <Route path="stations" element={<Stations />} />
            <Route path="stations/:id" element={<StationDetails />} />
            <Route path="stations/:id/book" element={<BookingPage />} />
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
              <Route index element={<Bookings />} />
              <Route path="history" element={<BookingHistory />} />
            </Route>

            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Profile />} />
            </Route>

            <Route path="/add-station" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AddStation />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="stations" element={<ManageStations />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="pending" element={<PendingApprovals />} />
              <Route path="history" element={<SystemHistory />} />
            </Route>

            {/* Owner routes */}
            <Route path="/owner/*" element={
              <ProtectedRoute requiredRole="owner">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<OwnerDashboard />} />
              <Route path="stations" element={<MyStations />} />
              <Route path="requests" element={<StationRequests />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="history" element={<OwnerHistory />} />
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