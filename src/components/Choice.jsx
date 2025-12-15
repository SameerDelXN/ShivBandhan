"use client";
import { useState, useEffect } from "react";
import { Sparkles, Shield, Users, Heart, Target } from "lucide-react";

export default function WhyChooseUs() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Features data
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Safety",
      description: "Verified profiles with multi-level authentication ensuring genuine connections",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precise Matching",
      description: "Advanced algorithm matching based on values, interests, and compatibility",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Focus",
      description: "Exclusively serving Maratha families with cultural understanding",
      color: "from-orange-600 to-amber-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Success Stories",
      description: "Thousands of successful matches and happy families",
      color: "from-amber-600 to-orange-600"
    }
  ];

  return (
    <div className="w-full overflow-hidden py-16 md:py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 border-y border-orange-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute left-0 top-20 w-64 h-64 rounded-full bg-orange-100 blur-3xl opacity-20"></div>
          <div className="absolute right-0 bottom-20 w-80 h-80 rounded-full bg-amber-100 blur-3xl opacity-30"></div>

          {/* Floating decorative icons */}
          <div className="absolute top-10 right-10 animate-float z-0">
            <Sparkles className="w-8 h-8 text-orange-300/60" />
          </div>
          <div className="absolute top-45 left-8 animate-float z-0" style={{ animationDelay: '1s' }}>
            <Heart className="w-6 h-6 text-amber-400/60" fill="currentColor" />
          </div>

          {/* Header Section */}
          <div className="relative z-10 w-full flex items-center justify-center text-center mb-12">
            {/* Left Lotus */}
            <img
              src="/assest/kalash.png"
              alt="lotus"
              className="w-12 sm:w-16 md:w-20"
            />

            {/* Title & Subtitle */}
            <div className="flex flex-col items-center px-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-sm font-semibold shadow-sm border border-orange-200/50 mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Our Advantages</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-orange-600">ShivBandhan</span>?
              </h2>

              <p className="mt-3 text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl">
                With our blend of tradition and modern expertise, we make your journey 
                of finding a true life partner more seamless, simple, and trustworthy.
              </p>
            </div>

            {/* Right Lotus */}
            <img
              src="/assest/kalash.png"
              alt="lotus"
              className="w-12 sm:w-16 md:w-20"
            />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 delay-${index * 100} ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full border border-orange-200/50">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Feature content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 md:p-10 shadow-lg border border-orange-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  10,000+
                </div>
                <p className="text-gray-700 font-medium">Registered Families</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  94%
                </div>
                <p className="text-gray-700 font-medium">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  5,000+
                </div>
                <p className="text-gray-700 font-medium">Happy Couples</p>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Add custom animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}