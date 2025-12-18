"use client"
import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Target, HeartHandshake, Star } from 'lucide-react';

export default function WhyChooseUs() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "Every profile undergoes strict verification to ensure authenticity and build genuine trust.",
      accentColor: "from-orange-500 to-amber-500"
    },
    {
      icon: CheckCircle,
      title: "100% Privacy Protected",
      description: "Advanced encryption and privacy controls to keep your personal information completely secure.",
      accentColor: "from-amber-500 to-orange-400"
    },
    {
      icon: HeartHandshake,
      title: "Maratha Community Focus",
      description: "Connect with partners who share similar cultural values, traditions, and family backgrounds.",
      accentColor: "from-orange-600 to-amber-600"
    },
    {
      icon: Target,
      title: "AI-Powered Matching",
      description: "Smart algorithms analyze compatibility to suggest the most suitable matches for you.",
      accentColor: "from-amber-600 to-orange-500"
    }
  ];

  const stats = [
    { value: "10K+", label: "Successful Matches" },
    { value: "98%", label: "Verified Profiles" },
    { value: "24/7", label: "Support Available" },
    { value: "4.9★", label: "User Rating" }
  ];

  return (
    <div className="relative py-20 md:py-24 lg:py-28 w-full overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-amber-50/40">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-orange-200/20 to-amber-200/10 blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-l from-amber-200/20 to-orange-200/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f97316' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 backdrop-blur-sm mb-6">
            <Star className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Why Trust ShivBandhan
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Where Tradition Meets
            <span className="block bg-gradient-to-r from-orange-600 via-amber-500 to-orange-700 bg-clip-text text-transparent">
              Modern Matchmaking
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We blend Maratha traditions with advanced technology to create meaningful connections 
            that lead to lifelong partnerships.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative overflow-hidden rounded-2xl border border-orange-100 bg-white/80 backdrop-blur-sm transition-all duration-500 transform hover:-translate-y-2 group ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ 
                transitionDelay: `${200 * index}ms`,
                boxShadow: hoveredIndex === index 
                  ? '0 20px 40px -15px rgba(249, 115, 22, 0.15)' 
                  : '0 10px 30px -10px rgba(249, 115, 22, 0.08)'
              }}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.accentColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.accentColor} opacity-10 group-hover:opacity-20 transition-all duration-500 transform rotate-45 translate-x-8 -translate-y-8`}></div>
              </div>

              <div className="p-6 sm:p-8 relative z-10">
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.accentColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Decorative line */}
                <div className={`mt-6 w-12 h-1 bg-gradient-to-r ${feature.accentColor} rounded-full transform origin-left transition-all duration-500 ${hoveredIndex === index ? 'scale-x-100' : 'scale-x-75'}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className={`bg-gradient-to-r from-white via-orange-50/40 to-amber-50/30 border border-orange-100/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-4 group hover:bg-white/60 rounded-xl transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-medium text-gray-700">
                  {stat.label}
                </div>
                <div className="mt-3 h-0.5 w-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-16 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of Maratha families who have found their perfect match through ShivBandhan.
          </p>
          <button className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white rounded-full hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative font-semibold text-lg">Start Your Journey Today</span>
            <svg className="relative w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}