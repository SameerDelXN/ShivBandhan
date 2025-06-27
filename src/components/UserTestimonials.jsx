"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Priya & Raj",
    location: "Mumbai, India",
    content: "We found each other through this platform and it's been a beautiful journey. The matching algorithm truly understands compatibility beyond just surface-level preferences.",
    image: "/images/couple1.jpeg",
    joined: "2022",
  },
  {
    id: 2,
    name: "Ananya & Arjun",
    location: "Delhi, India",
    content: "As working professionals, we didn't have time for traditional matchmaking. This service helped us connect meaningfully while respecting our cultural values.",
    image: "/images/couple2.jpeg",
    joined: "2021",
  },
  {
    id: 3,
    name: "Neha & Vikram",
    location: "Bangalore, India",
    content: "The detailed profiles and verification process gave us confidence in the platform. We're celebrating our first anniversary next month!",
    image: "/images/couple3.jpeg",
    joined: "2023",
  },
];

export default function UserTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-amber-50 to-rose-50 py-10 md:py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-rose-100 blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-100 blur-3xl opacity-40"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 md:mb-16 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <span className="px-4 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-medium">
            Love Stories
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mt-4 mb-4 md:mb-6">
            Success <span className="text-rose-600">Stories</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from couples who found their life partners through our platform
          </p>
        </div>

        {/* Testimonial section with completely revised approach for mobile */}
        <div className="relative max-w-5xl mx-auto mb-10">
          {/* Static testimonial display instead of absolute positioning */}
          <div className="w-full">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`${index === currentTestimonial ? 'block' : 'hidden'}`}
              >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  {/* Mobile-first approach */}
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="w-full h-96  md:h-auto md:w-1/3 relative bg-red-400">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-100 to-amber-100 opacity-30"></div>
                      <Image
                        width={1920}
                        height={1080}
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover "
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-6">
                        <h3 className="text-white text-lg md:text-xl font-bold">{testimonial.name}</h3>
                        <p className="text-rose-100 text-xs md:text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="md:w-2/3 p-5 md:p-12 flex flex-col justify-center">
                      <Quote className="text-rose-200 w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4" />
                      <p className="text-gray-700 text-base md:text-xl mb-4 md:mb-6">
                        "{testimonial.content}"
                      </p>
                      <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100">
                        <span className="text-xs md:text-sm text-gray-500">Joined in {testimonial.joined}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Properly positioned for mobile */}
          <button
            onClick={prevTestimonial}
            className="absolute left-2 top-20 sm:top-1/4 md:top-1/2 md:-translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors duration-300 z-20"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="text-rose-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-2 top-20 sm:top-1/4 md:top-1/2 md:-translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors duration-300 z-20"
            aria-label="Next testimonial"
          >
            <ChevronRight className="text-rose-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-rose-600 w-4 md:w-6' : 'bg-rose-200'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section - Made more responsive */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-6 md:mt-16 max-w-4xl mx-auto transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { value: "10,000+", label: "Happy Couples" },
            { value: "96%", label: "Success Rate" },
            { value: "50+", label: "Countries" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-3 md:p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-xl md:text-3xl font-bold text-rose-600 mb-1 md:mb-2">{stat.value}</div>
              <div className="text-xs md:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}