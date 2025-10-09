// import React, { useState, useEffect, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import Button from "../ui/Button";
// import { Bell } from "lucide-react";
// import axios from "axios";
// import NotificationDropdown from "../navbar/NotificationDropdown";

// const Navbar = () => {
//   const { user, LogoutUser } = useAuth();
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const API_BASE_URL = import.meta.env.VITE_API_URL
  
//   // 1. Define fetchNotifications outside useEffect using useCallback
//   const fetchNotifications = useCallback(async () => {
//     if (!user) return;

//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/auth/user`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });

//       const notifications = res.data?.userData?.notifications || [];

//       setNotifications(notifications); // Also update the full list
//       setUnreadCount(notifications.filter((n) => !n.isRead).length);
//     } catch (error) {
//       console.error("Error fetching notifications:", error.message);
//     }
//   }, [user]); // Dependency array ensures the function is stable

//   // 2. Update useEffect to use the memoized function
//   useEffect(() => {
//     if (user) {
//       fetchNotifications(); // Initial fetch

//       const interval = setInterval(fetchNotifications, 1000); // Polling remains
//       return () => clearInterval(interval);
//     }
//   }, [user, fetchNotifications]); // Add fetchNotifications to dependency array


//   const handleLogout = () => {
//     LogoutUser();
//     navigate("/login");
//   };

//   const navLinks = [
//     { label: "Home", path: "/", roles: ["user", "admin", "owner"] },
//     { label: "Stations", path: "/stations", roles: ["user", "admin", "owner"] },
//     {
//       label: "Dashboard",
//       path: "/dashboard",
//       roles: ["user", "admin", "owner"],
//     },
//     { label: "My Bookings", path: "/my-bookings", roles: ["user"] },
//     { label: "Manage Stations", path: "/owner/stations", roles: ["owner"] },
//     { label: "Admin Panel", path: "/admin/panel", roles: ["admin"] },
//   ];

//   const filteredNavLinks = navLinks.filter(
//     (link) => user && link.roles.includes(user.role)
//   );

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img
//               className="h-8 w-auto"
//               src="../../../public/images/Logo2.png"
//               alt="EvGati Logo"
//             />
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               {filteredNavLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* User Actions */}
//           <div className="hidden md:block">
//             <div className="ml-4 flex items-center space-x-4">
//               {user ? (
//                 <>
//                   {/* Notification Bell */}
//                   <div className="relative">
//                     <button
//                       onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//                       className="text-gray-600 hover:text-gray-900 relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <Bell className="w-6 h-6" />
//                       {unreadCount > 0 && (
//                         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
//                           {unreadCount > 9 ? '9+' : unreadCount}
//                         </span>
//                       )}
//                     </button>

//                     {/* 3. Pass the function as a prop to the dropdown */}
//                     <NotificationDropdown
//                       isOpen={isNotificationOpen}
//                       onClose={() => setIsNotificationOpen(false)}
//                       notifications={notifications} // Pass the notifications down
//                       onNotificationRead={fetchNotifications} // Pass the callback here
                      
//                     />
//                   </div>

//                   {/* Profile + Logout */}
//                   <Link
//                     to="/profile"
//                     className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
//                   >
//                     <img
//                       className="h-8 w-8 rounded-full"
//                       src={
//                         user.avatar ||
//                         `https://ui-avatars.com/api/?name=${user.name}`
//                       }
//                       alt={user.name}
//                     />
//                     <span>{user.name}</span>
//                   </Link>
//                   <Button variant="secondary" size="sm" onClick={handleLogout}>
//                     Logout
//                   </Button>
//                 </>
//               ) : (
//                           <div className="space-x-2">
//                             <Button variant="outline" onClick={() => navigate("/login")}>
//                               Login
//                             </Button>
//                             <Button variant="primary" onClick={() => navigate("/register")}>
//                               Sign Up
//                             </Button>
//                           </div>
//                         )}
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="-mr-2 flex md:hidden">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               type="button"
//               className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
//             >
//               <span className="sr-only">Open main menu</span>
//               {!mobileMenuOpen ? (
//                 <svg
//                   className="block h-6 w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="block h-6 w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden" id="mobile-menu">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {filteredNavLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {/* Mobile User Actions */}
//             {!user ? (
//               <div className="pt-4 pb-3 border-t border-gray-200">
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     fullWidth
//                     onClick={() => {
//                       navigate("/login");
//                       setMobileMenuOpen(false);
//                     }}
//                   >
//                     Login
//                   </Button>
//                   <Button
//                     variant="primary"
//                     fullWidth
//                     onClick={() => {
//                       navigate("/register");
//                       setMobileMenuOpen(false);
//                     }}
//                   >
//                     Sign Up
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="pt-4 pb-3 border-t border-gray-200">
//                 {/* Mobile Notifications */}
//                 <div className="px-5 mb-3">
//                   <button
//                     onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//                     className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
//                   >
//                     <span className="flex items-center gap-2">
//                       <Bell className="w-5 h-5" />
//                       <span>Notifications</span>
//                     </span>
//                     {unreadCount > 0 && (
//                       <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </button>
//                 </div>

//                 <div className="flex items-center px-5">
//                   <div className="flex-shrink-0">
//                     <img
//                       className="h-10 w-10 rounded-full"
//                       src={
//                         user.avatar ||
//                         `https://ui-avatars.com/api/?name=${user.name}`
//                       }
//                       alt={user.name}
//                     />
//                   </div>
//                   <div className="ml-3">
//                     <div className="text-base font-medium leading-none text-gray-800">
//                       {user.name}
//                     </div>
//                     <div className="text-sm font-medium leading-none text-gray-500 mt-1">
//                       {user.email}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-3 px-2 space-y-1">
//                   <Link
//                     to="/profile"
//                     className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Profile
//                   </Link>
//                   <Button
//                     variant="secondary"
//                     fullWidth
//                     onClick={() => {
//                       handleLogout();
//                       setMobileMenuOpen(false);
//                     }}
//                   >
//                     Logout
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import { Bell, Home, MapPin, LayoutDashboard, Calendar, Building2, Settings, Menu, X } from "lucide-react";
import axios from "axios";
import NotificationDropdown from "../navbar/NotificationDropdown";

const Navbar = () => {
  const { user, LogoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const notifications = res.data?.userData?.notifications || [];
      setNotifications(notifications);
      setUnreadCount(notifications.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  }, [user, API_BASE_URL]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 1000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const handleLogout = () => {
    LogoutUser();
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", path: "/", roles: ["user", "admin", "owner"], icon: Home },
    { label: "Stations", path: "/stations", roles: ["user", "admin", "owner"], icon: MapPin },
    { label: "Dashboard", path: "/dashboard", roles: ["user", "admin", "owner"], icon: LayoutDashboard },
    { label: "My Bookings", path: "/my-bookings", roles: ["user"], icon: Calendar },
    { label: "Manage Stations", path: "/owner/stations", roles: ["owner"], icon: Building2 },
    { label: "Admin Panel", path: "/admin/panel", roles: ["admin"], icon: Settings },
  ];

  const filteredNavLinks = navLinks.filter(
    (link) => user && link.roles.includes(user.role)
  );

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img
                  className="h-9 w-auto transition-transform group-hover:scale-105"
                  src="../../../public/images/Logo2.png"
                  alt="EvGati Logo"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {filteredNavLinks.map((link) => {
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
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
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

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Top) - Only for Profile/Auth */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
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

      {/* Mobile Bottom Navigation - Twitter Style */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-safe">
          <div className="grid grid-cols-5 h-16">
            {filteredNavLinks.slice(0, 4).map((link) => {
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

            {/* Notification Bell for Mobile Bottom Nav */}
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${
                isNotificationOpen ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <div className="relative">
                <Bell className="w-6 h-6" strokeWidth={isNotificationOpen ? 2.5 : 2} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9' : unreadCount}
                  </span>
                )}
                {isNotificationOpen && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium ${isNotificationOpen ? "font-semibold" : ""}`}>
                Alerts
              </span>

              {/* Mobile Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-80 max-w-[calc(100vw-2rem)]">
                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={notifications}
                    onNotificationRead={fetchNotifications}
                  />
                </div>
              )}
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