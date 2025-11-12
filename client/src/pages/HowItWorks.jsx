import React, { useState } from 'react';
import { Search, MapPin, Calendar, Zap, CheckCircle, Star, Users, Building, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('user');
  const navigate = useNavigate()

  const userSteps = [
    {
      icon: Search,
      title: 'Find Charging Stations',
      description: 'Search for nearby charging stations using our interactive map or filter by location, charger type, and amenities.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Calendar,
      title: 'Book Your Slot',
      description: 'Select your preferred time slot and port. Our real-time availability ensures you always know what\'s open.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: CheckCircle,
      title: 'Get Confirmation',
      description: 'Receive instant booking confirmation from the station owner. Track your booking status in real-time.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Charge & Go',
      description: 'Arrive at the station, plug in your vehicle, and charge. Complete your session and leave a review.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const ownerSteps = [
    {
      icon: Building,
      title: 'Register Your Station',
      description: 'Create an account and add your charging station with details like location, ports, pricing, and amenities.',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: CheckCircle,
      title: 'Get Verified',
      description: 'Our team reviews and approves your station. Once verified, it becomes visible to thousands of EV users.',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Calendar,
      title: 'Manage Bookings',
      description: 'Accept or reject booking requests, set availability, and communicate with customers through our platform.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Track analytics, optimize pricing, and maximize revenue. Build your reputation with customer reviews.',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Interactive Map',
      description: 'Find stations with our real-time map showing live availability and directions.'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Get instant notifications about booking confirmations and station availability.'
    },
    {
      icon: Star,
      title: 'Reviews & Ratings',
      description: 'Make informed decisions with authentic reviews from the EV community.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of EV owners and station partners building India\'s charging network.'
    }
  ];

  const steps = activeTab === 'user' ? userSteps : ownerSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How EvGati Works
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Simple, fast, and reliable EV charging for everyone
            </p>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-center">
          <div className="bg-white rounded-full shadow-lg p-2 inline-flex">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For EV Users
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'owner'
                  ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For Station Owners
            </button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {activeTab === 'user' ? 'Charge in 4 Easy Steps' : 'Start Earning in 4 Steps'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {activeTab === 'user' 
              ? 'Get charged up and back on the road in minutes'
              : 'Turn your charging infrastructure into a profitable business'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {index + 1}
                </div>
              </div>
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl mb-6 mt-4`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Flow */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Complete Journey</h2>
            <p className="text-xl text-gray-600">See how seamless the charging experience is</p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 transform -translate-y-1/2"></div>
            
            <div className="grid lg:grid-cols-3 gap-8 relative z-10">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Discover</h3>
                <p className="text-gray-700">Browse stations, check availability, and read reviews from the community</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Book</h3>
                <p className="text-gray-700">Reserve your slot instantly and get confirmation from the station owner</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Charge</h3>
                <p className="text-gray-700">Plug in, charge up, and share your experience with others</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600">Everything you need for a seamless charging experience</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of EV users and station owners on EvGati
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300" onClick={() => navigate("/stations")}>
              Find Stations
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300" onClick={() => navigate("/add-station")}>
              List Your Station
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;