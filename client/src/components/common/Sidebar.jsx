import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    // { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Manage Stations', path: '/admin/stations', icon: 'stations' },
    { label: 'Manage Users', path: '/admin/users', icon: 'users' },
    { label: 'Pending Approvals', path: '/admin/pending', icon: 'pending' },
    { label: 'System History', path: '/admin/history', icon: 'history' }
  ];

  const ownerLinks = [
    // { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'My Stations', path: '/owner/stations', icon: 'stations' },
    { label: 'Station Requests', path: '/owner/requests', icon: 'requests' },
    { label: 'Analytics', path: '/owner/analytics', icon: 'analytics' },
    { label: 'Station History', path: '/owner/history', icon: 'history' }
  ];

  const userLinks = [
    // { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Stations', path: '/stations', icon: 'stations' },
    { label: 'My Bookings', path: '/my-bookings', icon: 'bookings' },
    { label: 'Profile', path: '/profile', icon: 'profile' }
  ];

  const getLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case 'admin': return adminLinks;
      case 'owner': return ownerLinks;
      default: return userLinks;
    }
  };

  const renderIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      stations: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
        </svg>
      ),
      users: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.5 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM10 12a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      pending: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      history: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
        </svg>
      ),
      bookings: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      profile: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      analytics: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const links = getLinks();

  return (
    <div className="w-64 bg-white shadow-md h-full fixed left-0 top-0 pt-16 z-40">
      <nav className="mt-5">
        <div className="px-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                flex items-center px-4 py-2 mt-2 text-sm font-semibold 
                rounded-lg transition-colors duration-200
                ${location.pathname === link.path 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <span className="mr-3">{renderIcon(link.icon)}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

