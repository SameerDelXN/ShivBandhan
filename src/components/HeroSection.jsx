"use client"
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function MatrimonialHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-[100vh] w-full overflow-hidden flex items-center justify-center px-12 from-rose-50 to-amber-50">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-rose-100 blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-amber-100 blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto h-full px-4 py-20 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-12">
          {/* Left Content - Text and CTA */}
          <div className={`flex flex-col space-y-6 max-w-lg transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block">
              <span className="px-4 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-medium">
                Trusted by 10,000+ couples
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Find Your <span className="text-rose-600">Perfect</span> Life Partner
            </h1>
            
            <p className="text-lg text-gray-600">
              Join thousands who have found love with our thoughtful matchmaking process that honors tradition while embracing modern connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-px transform flex items-center justify-center group">
                <span className="font-medium">Register Free</span>
                <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button className="px-8 py-3 bg-white text-rose-600 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-md flex items-center justify-center">
                <span className="font-medium">How It Works</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <Image width={1920} height={1080} src={`/people/rohan.jpg`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Join 20,000+</span> members finding love every day
              </div>
            </div>
          </div>
          
          {/* Right Content - Image */}
          <div className={`relative h-full flex items-center justify-center transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative w-full max-w-lg">
              {/* Main image with decorative border */}
              <div className="w-full aspect-[4/4] rounded-2xl overflow-hidden shadow-2xl relative z-10 transform rotate-2 hover:rotate-0 transition-all duration-500">
                <img 
                  src="/images/couple.jpeg" 
                  alt="Happy Couple" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 lg:w-40 lg:h-40 rounded-lg bg-white p-2 shadow-xl transform -rotate-6 z-20 ">
                <div className="w-full h-full rounded bg-rose-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-rose-600 font-bold text-xl">3,500+</div>
                    <div className="text-gray-600 text-xs">Success Stories</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 lg:w-32 lg:h-32 rounded-lg bg-white p-2 shadow-xl transform rotate-6 z-10">
                <div className="w-full h-full rounded bg-amber-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-amber-600 font-bold text-xl">96%</div>
                    <div className="text-gray-600 text-xs">Match Rate</div>
                  </div>
                </div>
              </div>
              
              {/* Abstract shape */}
              <div className="absolute -z-10 bottom-10 -left-10 w-40 h-40 rounded-full border-8 border-rose-200 opacity-60"></div>
              <div className="absolute -z-10 top-20 -right-10 w-24 h-24 rounded-full border-8 border-amber-200 opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}