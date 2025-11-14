import React from 'react';
import { Zap, Target, Users, Award, TrendingUp, Shield } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: 'Active Stations', value: '500+', icon: Zap },
    { label: 'Happy Users', value: '10K+', icon: Users },
    { label: 'Cities Covered', value: '50+', icon: Target },
    { label: 'Charging Sessions', value: '100K+', icon: TrendingUp }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Ensuring consistent, dependable charging infrastructure across all locations.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a network that connects EV owners with trusted charging partners.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to providing the highest quality charging experience.'
    }
  ];

  const team = [
    {
      name: 'Vaibhav Sharma',
      role: 'Application Owner',
      image: 'https://images.unsplash.com/vector-1761076906848-d35f0c4e65d5?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Powering India's EV Revolution
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              EvGati is making electric vehicle charging accessible, reliable, and convenient for everyone across India.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
            >
              <stat.icon className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              At EvGati, we believe in a sustainable future powered by electric vehicles. Our mission is to create the most comprehensive and user-friendly charging network in India, eliminating range anxiety and making EV ownership a seamless experience.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We connect EV owners with verified charging stations, while empowering station owners to maximize their infrastructure's potential. Together, we're building a greener tomorrow.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&fit=crop"
              alt="EV Charging"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that drive everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-blue-50 transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Passionate individuals driving the EV revolution
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the EvGati Community Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of India's largest EV charging network
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;