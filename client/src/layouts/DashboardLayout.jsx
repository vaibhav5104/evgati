import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common';
import { MapPin, Mail, Phone, Github, Linkedin, Twitter } from 'lucide-react';

const DashboardLayout = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-8 md:py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://evgati.vercel.app/favicon-50.png"
                  alt="EvGati"
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Powering the future of electric mobility with smart charging solutions.
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://x.com/vaibhav5104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/vaibhav5104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/vaibhav5104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/stations"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Find Stations
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/how-it-works"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/feedback"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Jalandhar, Punjab 144008
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <a
                    href="mailto:vaibhavsharma5104@gmail.com"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    vaibhavsharma5104@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="border-t border-gray-200 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-600">
                © {currentYear} EvGati. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <a
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="/cookies"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Cookie Policy
                </a>
                <a
                  href="/accessibility"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;