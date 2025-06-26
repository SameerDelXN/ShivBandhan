"use client"
import { useState, useEffect } from 'react';
import { Shield, Users, Lock, Smartphone } from 'lucide-react';

export default function WhyChooseUs() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "We thoroughly verify all profiles to ensure authenticity and build a community based on trust."
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "Your personal information remains secure with our advanced privacy controls and data protection."
    },
    {
      icon: Users,
      title: "Community-Based Matches",
      description: "Find compatible partners from similar backgrounds, values and interests for meaningful connections."
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Connect with potential matches anytime, anywhere with our seamless mobile experience."
    }
  ];

  return (
    <div className="relative py-20 w-full overflow-hidden bg-gradient-to-r from-rose-50 to-amber-50">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-rose-100 blur-3xl opacity-30"></div>
        <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-amber-100 blur-3xl opacity-40"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine tradition with technology to help you find your perfect life partner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${150 * index}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full -mr-16 -mt-16 transition-all duration-300 group-hover:scale-110 opacity-20"></div>
              
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-100 to-amber-100 flex items-center justify-center mb-4">
                <feature.icon className="text-rose-600" size={24} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}