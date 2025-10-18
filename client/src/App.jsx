import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth';
import { MainLayout, AuthLayout, DashboardLayout } from './layouts';
import { ScrollToTop } from './components/common/ScrollToTop';
import { LoadingFallback } from './components/common/LoadingFallback';
import { NotFound } from './pages/NotFound';
import { Unauthorized } from './pages/Unauthorized';

// Lazy load page components that exist
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Stations = lazy(() => import('./pages/Stations'));
const StationDetails = lazy(() => import('./pages/StationDetails'));
const AddStation = lazy(() => import('./pages/AddStation'));
const Profile = lazy(() => import('./pages/Profile'));

const BookingPage = lazy(() => import('./pages/BookingPage'));
const Bookings = lazy(() => import('./pages/booking/Bookings'));
const BookingHistory = lazy(() => import('./pages/booking/BookingHistory'));

// Admin pages 
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageStations = lazy(() => import('./pages/admin/ManageStations'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const PendingApprovals = lazy(() => import('./pages/admin/PendingApprovals'));
const SystemHistory = lazy(() => import('./pages/admin/SystemHistory'));

// Owner pages 
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'));
const MyStations = lazy(() => import('./pages/owner/MyStations'));
const StationRequests = lazy(() => import('./pages/owner/StationRequests'));
const Analytics = lazy(() => import('./pages/owner/Analytics'));
const OwnerHistory = lazy(() => import('./pages/owner/OwnerHistory'));

// Error boundary component
const ErrorBoundary = ({ children }) => {
  return children;
};

export const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop/>
        <Suspense fallback={<LoadingFallback />}>
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
              <Route path="any" element={<AdminDashboard />} />
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
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};