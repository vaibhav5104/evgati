import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import { 
  Bell, Home, MapPin, LayoutDashboard, Calendar, Building2, Settings, 
  Menu, X, Users, FileText, Clock, BarChart3, ClipboardList, User
} from "lucide-react";
import NotificationDropdown from "../navbar/NotificationDropdown";

const Navbar = () => {
  const { user, LogoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Navigation icons mapping
  const iconMap = {
    dashboard: LayoutDashboard,
    stations: Building2,
    users: Users,
    pending: Clock,
    history: FileText,
    bookings: Calendar,
    profile: User,
    analytics: BarChart3,
    requests: ClipboardList
  };

  // Define sidebar links based on role
  const getSidebarLinks = () => {
    if (!user) return [];
    
    const adminLinks = [
      { label: 'Manage Stations', path: '/admin/stations', icon: 'stations' },
      { label: 'Manage Users', path: '/admin/users', icon: 'users' },
      { label: 'Pending Approvals', path: '/admin/pending', icon: 'pending' },
      { label: 'System History', path: '/admin/history', icon: 'history' }
    ];

    const ownerLinks = [
      { label: 'My Stations', path: '/owner/stations', icon: 'stations' },
      { label: 'Station Requests', path: '/owner/requests', icon: 'requests' },
      { label: 'Analytics', path: '/owner/analytics', icon: 'analytics' },
      { label: 'Station History', path: '/owner/history', icon: 'history' }
    ];

    const userLinks = [
      { label: 'Stations', path: '/stations', icon: 'stations' },
      { label: 'My Bookings', path: '/my-bookings', icon: 'bookings' },
      { label: 'Profile', path: '/profile', icon: 'profile' }
    ];

    switch (user.role) {
      case 'admin': return adminLinks;
      case 'owner': return ownerLinks;
      default: return userLinks;
    }
  };

  // Main navigation links
  const mainNavLinks = [
    { label: "Home", path: "/", roles: ["user", "admin", "owner"], icon: Home },
    { label: "Stations", path: "/stations", roles: ["user", "admin", "owner"], icon: MapPin },
    { label: "Dashboard", path: "/dashboard", roles: ["user", "admin", "owner"], icon: LayoutDashboard },
  ];

  const filteredMainNavLinks = mainNavLinks.filter(
    (link) => user && link.roles.includes(user.role)
  );

  const sidebarLinks = getSidebarLinks();

  // Memoized fetch function
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoadingNotifications(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/user`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
      });

      const data = await res.json();
      const userNotifications = data?.userData?.notifications || [];
      
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user, API_BASE_URL]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const handleLogout = () => {
    LogoutUser();
    navigate("/login");
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img
                  className="h-9 w-auto transition-transform group-hover:scale-105"
                  src="https://evgati.vercel.app/Logo2.png"
                  alt="EvGati Logo"
                />
              </div>
            </Link>

            {/* Desktop Main Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {filteredMainNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActivePath(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNotificationOpen(!isNotificationOpen);
                      }}
                      className="relative p-2.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    <NotificationDropdown
                      isOpen={isNotificationOpen}
                      onClose={() => setIsNotificationOpen(false)}
                      notifications={notifications}
                      loading={loadingNotifications}
                      onNotificationRead={fetchNotifications}
                    />
                  </div>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <img
                      className="h-8 w-8 rounded-full ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all"
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
                      alt={user.name}
                    />
                    <span className="font-medium">{user.name}</span>
                  </Link>

                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button variant="primary" onClick={() => navigate("/register")}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Actions (Notification + Menu) */}
            <div className="flex md:hidden items-center space-x-2">
              {user && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNotificationOpen(!isNotificationOpen);
                    }}
                    className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Mobile Notification Dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] z-[60]">
                      <NotificationDropdown
                        isOpen={isNotificationOpen}
                        onClose={() => setIsNotificationOpen(false)}
                        notifications={notifications}
                        loading={loadingNotifications}
                        onNotificationRead={fetchNotifications}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button> */}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {user && (
            <div
              className="hidden md:block bg-red-100 backdrop-blur-md 
                        border border-gray-200 rounded-xl {/* Changed: border-t to border and added rounded-xl */}
                        items-center justify-center w-fit box-border"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 ">
                <div className="flex items-center space-x-1 py-2">
                  {sidebarLinks.map((link) => {
                    const Icon = iconMap[link.icon];
                    const isActive = isActivePath(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-2">
              {!user ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <>
                  {/* User Profile Section */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <img
                      className="h-10 w-10 rounded-full ring-2 ring-gray-200"
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
                      alt={user.name}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </Link>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Main Navigation Links */}
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Main Menu
                    </div>
                    {filteredMainNavLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = isActivePath(link.path);
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-500 my-2"></div>

                  {/* Sidebar Links */}
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {user.role === 'admin' ? 'Admin Tools' : user.role === 'owner' ? 'Owner Tools' : 'Quick Access'}
                    </div>
                    {sidebarLinks.map((link) => {
                      const Icon = iconMap[link.icon];
                      const isActive = isActivePath(link.path);
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Logout Button */}
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-safe">
          <div className="grid grid-cols-4 h-16">
            {filteredMainNavLinks.slice(0, 3).map((link) => {
              const Icon = link.icon;
              const isActive = isActivePath(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  <div className={`relative ${isActive ? "scale-110" : ""}`}>
                    <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}

            {/* More/Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                mobileMenuOpen ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <div className={`relative ${mobileMenuOpen ? "scale-110" : ""}`}>
                <Menu className="w-6 h-6" strokeWidth={mobileMenuOpen ? 2.5 : 2} />
                {mobileMenuOpen && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium ${mobileMenuOpen ? "font-semibold" : ""}`}>
                More
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Spacer for mobile bottom nav */}
      {user && <div className="h-16 md:hidden" />}
    </>
  );
};

export default Navbar;