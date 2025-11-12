import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Building } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: ''
      });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'vaibhavsharma5104@gmail.com',
      description: 'Send us an email anytime',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 ***** *****',
      description: '24/7 Customer Support',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Jalandhar, Punjab',
      description: 'Come visit our office',
      // color: 'from-purple-500 to-purple-600'
      color: 'from-blue-800 to-gray-600'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Sat: 9 AM - 6 PM',
      description: 'We\'re here to help',
      color: 'from-red-500 to-red-600'
    }
  ];

  const supportCategories = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'booking', label: 'Booking Support', icon: HelpCircle },
    { value: 'technical', label: 'Technical Issue', icon: Building },
    { value: 'partnership', label: 'Partnership', icon: Building }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              We're here to help and answer any question you might have
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${info.color} rounded-xl mb-4`}>
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{info.title}</h3>
              <p className="text-blue-600 font-semibold mb-1">{info.content}</p>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Message sent successfully!</p>
                  <p className="text-sm text-green-700">We'll get back to you soon.</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    {supportCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info & Map Section */}
          <div className="space-y-8">
            {/* Quick Help */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Quick Help?</h3>
              <p className="text-gray-700 mb-6">
                Check out our resources for instant answers to common questions.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600" onClick={() => navigate("/faq")}/>
                  View FAQs
                </button>
                <button className="w-full bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Mail Support
                </button>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Visit Our Office</h4>
                    <p className="text-gray-600">Jalandhar, Punjab, India</p>
                  </div>
                </div>
              </div> */}
              <div className="p-6">
                <h4 className="font-bold text-gray-900 mb-2">Office Address</h4>
                <p className="text-gray-600 mb-4">
                  EvGati<br />
                  Jalandhar, Punjab - 144008<br />
                  India
                </p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Support Hours
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Monday - Friday</span>
                  <span className="text-gray-900 font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Saturday</span>
                  <span className="text-gray-900 font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">Sunday</span>
                  <span className="text-red-600 font-semibold">Closed</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>24/7 Emergency Support:</strong> Call our hotline for urgent issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Connect Section */}
      <div className="bg-red-200 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Connect With Us
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Follow us on social media for the latest updates
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {['Facebook', 'X', 'Instagram', 'LinkedIn', 'YouTube'].map((platform) => {
              const platformStyles = {
                Facebook: 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white',
                X: 'hover:bg-gradient-to-r hover:from-black hover:to-gray-800 hover:text-white',
                Instagram: 'hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-400 hover:text-white',
                LinkedIn: 'hover:bg-gradient-to-r hover:from-blue-800 hover:to-cyan-600 hover:text-white',
                YouTube: 'hover:bg-gradient-to-r hover:from-red-700 hover:to-red-500 hover:text-white',
              };
              return (
                <button
                  key={platform}
                  className={`px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold ${platformStyles[platform]}`}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;