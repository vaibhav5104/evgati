import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Find Stations",
      description: "Locate nearby charging stations",
      icon: "🔍",
      link: "/stations",
      color: "bg-blue-500"
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings",
      icon: "📅",
      link: "/my-bookings", 
      color: "bg-green-500"
    },
    {
      title: "Add Station",
      description: "Register your charging station",
      icon: "➕",
      link: "/add-station",
      color: "bg-purple-500"
    },
    {
      title: "Profile",
      description: "Update your account settings",
      icon: "👤",
      link: "/profile",
      color: "bg-orange-500"
    }
  ];

  const stats = [
    { label: "Total Bookings", value: "0", color: "text-blue-600" },
    { label: "Active Sessions", value: "0", color: "text-green-600" },
    { label: "Completed", value: "0", color: "text-purple-600" },
    { label: "Saved Stations", value: "0", color: "text-orange-600" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your EV charging experience from your dashboard
        </p>
        <div className="mt-4">
          <Badge variant={user?.role === 'admin' ? 'danger' : user?.role === 'owner' ? 'success' : 'primary'}>
            {user?.role?.toUpperCase()} ACCOUNT
          </Badge>
        </div>
      </div>

      {/* Role-specific Quick Access */}
      {user?.role === 'admin' && (
        <Card className="mb-8 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-900">Admin Panel</h3>
              <p className="text-red-700">Manage platform stations and users</p>
            </div>
            <Link to="/admin">
              <Button variant="danger">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Go to Admin Panel
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {user?.role === 'owner' && (
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">Owner Dashboard</h3>
              <p className="text-green-700">Manage your stations and bookings</p>
            </div>
            <Link to="/owner">
              <Button variant="success">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Manage Stations
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card hover className="h-full group">
                <div className="text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-white text-xl group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <Card.Title>Recent Activity</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <p className="text-gray-600">No recent activity</p>
            <p className="text-sm text-gray-500 mt-1">
              Your booking history and station interactions will appear here
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;