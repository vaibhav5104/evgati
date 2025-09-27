import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';


const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);


  // Carousel slides data
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=80",
      title: "Power Your Journey",
      subtitle: "Find charging stations instantly",
      description: "Connect to 500+ charging points across the city with real-time availability"
    },
    {
      image: "https://images.unsplash.com/photo-1650452233063-8f308616b729?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Book Smart, Charge Fast",
      subtitle: "Reserve your slot in advance",
      description: "Skip the queue with advanced booking and guaranteed charging slots"
    },
    {
      image: "https://images.unsplash.com/photo-1579616043939-95d87a6e8512?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Track Your Impact",
      subtitle: "Monitor your green journey",
      description: "See your carbon footprint reduction and contribution to sustainability"
    }
  ];

  // Features data
  const features = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3721/3721972.png",
      title: "Lightning Fast Charging",
      description: "Ultra-fast DC charging up to 350kW. Get 80% charge in under 30 minutes.",
      stat: "30min",
      statLabel: "Average Charge Time"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/2797/2797387.png",
      title: "Smart Booking System",
      description: "Advanced reservation system with real-time slot availability and instant confirmations.",
      stat: "24/7",
      statLabel: "Booking Available"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3214/3214679.png",
      title: "Nationwide Network",
      description: "Access to premium charging stations across highways, cities, and destinations.",
      stat: "500+",
      statLabel: "Charging Stations"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3037/3037156.png",
      title: "Live Tracking",
      description: "Monitor charging progress, get notifications, and track your charging history.",
      stat: "99.9%",
      statLabel: "Uptime"
    }
  ];

  // Blog articles data
  const blogs = [
    {
      image: "https://plus.unsplash.com/premium_photo-1715611974827-ee63fb3d705c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Technology",
      title: "The Future of EV Charging Infrastructure",
      excerpt: "Exploring next-gen charging technologies and what they mean for EV owners.",
      author: "Sarah Chen",
      date: "Dec 15, 2024",
      readTime: "5 min read"
    },
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      category: "Sustainability",
      title: "How EVs Are Reshaping Urban Mobility",
      excerpt: "The environmental impact of electric vehicles and charging networks in modern cities.",
      author: "James Miller",
      date: "Dec 10, 2024",
      readTime: "7 min read"
    },
    {
      image: "https://images.unsplash.com/photo-1617886322207-6f504e7472c5?w=800&q=80",
      category: "Guide",
      title: "Maximizing Your EV's Battery Life",
      excerpt: "Essential tips for optimal charging habits and battery maintenance.",
      author: "Dr. Alex Kumar",
      date: "Dec 8, 2024",
      readTime: "10 min read"
    }
  ];

  const handleGetStarted = () => {
    window.location.href = isAuthenticated ? "/stations" : "/register";
  };

  const handleExplore = () => {
    window.location.href = "/stations";
  };

  // Handle scroll for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Auto-advance blog carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlogSlide((prev) => (prev + 1) % blogs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [blogs.length]);

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Hero Carousel Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-black">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>
          ))}
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="max-w-2xl">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    index === currentSlide 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8 absolute'
                  }`}
                >
                  <h1 className="text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    {slide.title}
                  </h1>
                  <p className="text-2xl lg:text-3xl mb-6 text-gray-300">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg mb-8 text-gray-400">
                    {slide.description}
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => window.location.href = isAuthenticated ? "/stations" : "/register"}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-300"
                    >
                      {isAuthenticated ? "Find Stations" : "Get Started"}
                    </button>
                    <button 
                      onClick={() => window.location.href = "/stations"}
                      className="px-8 py-4 border-2 border-gray-600 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300"
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-12 bg-gradient-to-r from-green-500 to-blue-600' 
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
      {/* Features Section */}
      <section className="min-h-screen relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Next-Gen Charging Experience
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced technology meets seamless user experience. Everything you need for the electric future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-2xl border border-gray-600 hover:border-green-500/50 transition-colors duration-300"
              >
                <div className="mb-6">
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-16 h-16 filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-6">
                  {feature.description}
                </p>
                <div className="pt-4 border-t border-gray-600">
                  <div className="text-2xl md:text-3xl font-bold text-green-400">{feature.stat}</div>
                  <div className="text-sm text-gray-500">{feature.statLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-800 relative">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80" 
            alt="Map Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Driving the Future of Mobility
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Join the revolution. Our network is growing every day, bringing sustainable transportation to every corner of the nation.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { value: "50K+", label: "Active Users", icon: "👥" },
                  { value: "1M+", label: "Charging Sessions", icon: "⚡" },
                  { value: "25+", label: "Cities Covered", icon: "🌍" },
                  { value: "4.9", label: "App Rating", icon: "⭐" }
                ].map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80" 
                alt="App Interface"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}

      <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Latest Insights
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay updated with the latest trends, tips, and news from the EV world
            </p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-64 md:h-96 overflow-hidden rounded-2xl">
                <img 
                  src={blogs[currentBlogSlide].image} 
                  alt={blogs[currentBlogSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {blogs[currentBlogSlide].category}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                  {blogs[currentBlogSlide].title}
                </h3>
                <p className="text-lg md:text-xl text-gray-300 mb-8">
                  {blogs[currentBlogSlide].excerpt}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {blogs[currentBlogSlide].author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">{blogs[currentBlogSlide].author}</div>
                      <div className="text-sm text-gray-400">{blogs[currentBlogSlide].date}</div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{blogs[currentBlogSlide].readTime}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12 space-x-3">
              {blogs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBlogSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentBlogSlide 
                      ? 'w-12 bg-gradient-to-r from-green-500 to-blue-600' 
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10" />
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1650452233063-8f308616b729?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="EV Charging"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Ready to Go Electric?
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-12">
            Join thousands of drivers who've made the switch to sustainable mobility
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => window.location.href = "/register"}
                  className="px-10 py-5 bg-gradient-to-r from-green-500 to-blue-600 rounded-full font-semibold text-xl hover:from-green-600 hover:to-blue-700 transition-colors duration-300"
                >
                  Start Free Trial
                </button>
                <button 
                  onClick={() => window.location.href = "/login"}
                  className="px-10 py-5 border-2 border-gray-400 rounded-full font-semibold text-xl hover:bg-white hover:text-gray-900 transition-colors duration-300"
                >
                  Sign In
                </button>
              </>
            ) : (
              <button 
                onClick={() => window.location.href = "/stations"}
                className="px-10 py-5 bg-gradient-to-r from-green-500 to-blue-600 rounded-full font-semibold text-xl hover:from-green-600 hover:to-blue-700 transition-colors duration-300"
              >
                Browse Stations →
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;