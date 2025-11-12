import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Zap, CreditCard, MapPin, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQs = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()

  const categories = [
    { id: 'general', label: 'General', icon: HelpCircle },
    { id: 'booking', label: 'Booking', icon: Zap },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'stations', label: 'Stations', icon: MapPin },
    { id: 'owners', label: 'For Owners', icon: Users },
    { id: 'safety', label: 'Safety & Security', icon: Shield }
  ];

  const faqs = {
    general: [
      {
        question: 'What is EvGati?',
        answer: 'EvGati is India\'s leading EV charging station booking platform that connects electric vehicle owners with verified charging stations across the country. We make finding and booking charging slots simple, fast, and reliable.'
      },
      {
        question: 'How do I create an account?',
        answer: 'Click on the "Sign Up" button in the top right corner, provide your name, email, and phone number, and you\'re all set! You can start booking charging stations immediately after registration.'
      },
      {
        question: 'Is EvGati available in my city?',
        answer: 'EvGati is currently available in 50+ cities across India and expanding rapidly. Use our station finder to check if there are charging stations available in your area.'
      },
      {
        question: 'Can I use EvGati for free?',
        answer: 'Yes! Creating an account and browsing stations is completely free. You only pay for the charging service when you book and use a charging station.'
      }
    ],
    booking: [
      {
        question: 'How do I book a charging slot?',
        answer: 'Search for a station near you, select your preferred date and time, choose an available port, and submit your booking. The station owner will confirm your booking, and you\'ll receive a notification.'
      },
      {
        question: 'Can I cancel my booking?',
        answer: 'Yes, you can cancel your booking from the "My Bookings" section. Please check the station\'s cancellation policy. We recommend canceling at least 2 hours before your scheduled time.'
      },
      {
        question: 'What if the station owner rejects my booking?',
        answer: 'If a booking is rejected, you\'ll receive a notification with the reason (if provided). You can then book a different time slot or choose another station. No charges will apply for rejected bookings.'
      },
      {
        question: 'How far in advance can I book?',
        answer: 'You can book charging slots up to 30 days in advance. This helps you plan long trips and ensures you have a charging spot when you need it.'
      },
      {
        question: 'What happens if I arrive late?',
        answer: 'If you\'re running late, please inform the station owner through our chat feature. Most owners are flexible, but your slot may be given to another customer if you\'re significantly delayed.'
      }
    ],
    payment: [
      {
        question: 'How is the charging cost calculated?',
        answer: 'Charging costs vary by station and are typically based on per-hour rates or per-kWh consumption. The exact pricing is displayed on each station\'s page before you book.'
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, and popular digital wallets. Payment is processed securely through our payment gateway.'
      },
      {
        question: 'When do I pay for my charging session?',
        answer: 'Payment is typically made after your charging session is complete. Some stations may require advance payment during booking. This information is clearly mentioned on the booking page.'
      },
      {
        question: 'Can I get a refund if my booking is cancelled?',
        answer: 'Yes, if you cancel according to the station\'s policy or if the owner cancels your booking, you\'ll receive a full refund within 5-7 business days.'
      }
    ],
    stations: [
      {
        question: 'How do I find stations near me?',
        answer: 'Use our interactive map or search feature to find stations near your location. You can filter by charger type, amenities, pricing, and availability to find the perfect station for your needs.'
      },
      {
        question: 'What types of chargers are available?',
        answer: 'EvGati stations offer various charger types including Type 1, Type 2, CCS, CHAdeMO, AC, DC, and Bharat DC-001. Filter by your vehicle\'s charger type to find compatible stations.'
      },
      {
        question: 'Are the stations verified?',
        answer: 'Yes! All stations on EvGati go through a verification process by our team before they appear on the platform. We ensure they meet our quality and safety standards.'
      },
      {
        question: 'Can I see real-time availability?',
        answer: 'Absolutely! Our platform shows real-time port availability, so you always know which stations have free charging ports before you book.'
      }
    ],
    owners: [
      {
        question: 'How do I list my charging station?',
        answer: 'Register as a station owner, fill in your station details including location, charger types, pricing, and amenities. Our team will verify your station and make it live on the platform within 24-48 hours.'
      },
      {
        question: 'What documents do I need?',
        answer: 'You\'ll need proof of ownership or authorization to operate the charging station, location details, and basic business information. Our team will guide you through the process.'
      },
      {
        question: 'How do I set my pricing?',
        answer: 'You have full control over your pricing structure. Set per-hour or per-kWh rates based on your costs and market conditions. You can update pricing anytime from your owner dashboard.'
      },
      {
        question: 'How do I receive payments?',
        answer: 'Payments are transferred to your registered bank account on a weekly basis, minus a small platform fee. You can track all earnings and transactions in your dashboard.'
      },
      {
        question: 'Can I manage multiple stations?',
        answer: 'Yes! You can add and manage multiple charging stations from a single owner account. Each station has its own dashboard for bookings and analytics.'
      }
    ],
    safety: [
      {
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use industry-standard encryption and comply with PCI DSS standards. Your payment information is never stored on our servers and is processed through secure payment gateways.'
      },
      {
        question: 'How do you verify station owners?',
        answer: 'All station owners undergo a thorough verification process including identity verification, business documentation, and physical station inspection before approval.'
      },
      {
        question: 'What if I face issues at a charging station?',
        answer: 'Contact the station owner directly through our chat feature or reach out to our support team. We have a dedicated safety team that handles disputes and ensures user safety.'
      },
      {
        question: 'Are charging stations safe for my vehicle?',
        answer: 'All stations on EvGati are verified to meet safety standards. However, we recommend checking the charger type compatibility and following your vehicle manufacturer\'s charging guidelines.'
      }
    ]
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = searchQuery
    ? faqs[activeCategory].filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[activeCategory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about EvGati
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenIndex(null);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              <category.icon className="w-5 h-5" />
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 mt-2">Try a different search term or browse categories</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-8">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Still Have Questions Section */}
      <div className="bg-white py-16 mt-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105" onClick={() => navigate("/contact")}>
              Contact Support
            </button>
            <button className="bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors duration-300" onClick={() => navigate("/how-it-works")}>
              Browse Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;