"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Download, Heart, Sparkles, Star, Users } from "lucide-react";

export default function PaymentSuccess({ 
  userName = "Valued Member", 
  planName = "Premium", 
  amount = "2,999",
  transactionId = "TXN-2025-0624-001"
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showRedirect, setShowRedirect] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);

  const successMessages = [
    "Payment Successful! 🎉",
    "Welcome to Premium! 💎",
    "Your Journey Begins! ✨"
  ];

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % successMessages.length);
    }, 2500);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowRedirect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(messageTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleDashboardRedirect = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-800 flex items-center justify-center p-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Dynamic Gradient Orbs */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${-150 + mousePosition.x * 0.5}px, ${
              -150 + mousePosition.y * 0.5
            }px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${100 - mousePosition.x * 0.3}px, ${
              100 - mousePosition.y * 0.3
            }px)`,
          }}
        />

        {/* Floating Decorations */}
        <div className="absolute top-20 left-20 animate-bounce" style={{ animationDelay: "0.2s" }}>
          <Heart className="w-6 h-6 text-pink-300/40" />
        </div>
        <div className="absolute top-32 right-32 animate-bounce" style={{ animationDelay: "0.8s" }}>
          <Star className="w-5 h-5 text-yellow-300/40" />
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce" style={{ animationDelay: "1.2s" }}>
          <Sparkles className="w-7 h-7 text-orange-300/40" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce" style={{ animationDelay: "0.6s" }}>
          <Users className="w-4 h-4 text-red-300/40" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Success Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 text-center hover:bg-white/15 transition-all duration-700 shadow-2xl">
          

          
          {/* Success Icon with Ripple Animation */}
          <div className="mb-6 flex justify-center mt-4">
            <div className="relative">
              {/* Ripple Animation Layers */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-500/10 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-green-500/8 rounded-full animate-ping" style={{ animationDelay: '0.3s', animationDuration: '2.5s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-green-500/6 rounded-full animate-ping" style={{ animationDelay: '0.6s', animationDuration: '3s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 bg-green-500/4 rounded-full animate-ping" style={{ animationDelay: '0.9s', animationDuration: '3.5s' }}></div>
              </div>

              {/* Celebration Confetti */}
              <div className="absolute -top-8 -left-8 animate-bounce" style={{ animationDelay: '0.2s' }}>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -top-6 right-4 animate-bounce" style={{ animationDelay: '0.8s' }}>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -bottom-4 -right-6 animate-bounce" style={{ animationDelay: '1.2s' }}>
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -bottom-8 left-2 animate-bounce" style={{ animationDelay: '0.6s' }}>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-0 -right-8 animate-bounce" style={{ animationDelay: '1.4s' }}>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute bottom-2 -left-4 animate-bounce" style={{ animationDelay: '0.4s' }}>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </div>

              {/* Main Success Circle */}
              <div className="relative z-10">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <CheckCircle 
                    className="w-12 h-12 text-white animate-pulse" 
                    fill="currentColor"
                  />
                </div>
              </div>

              {/* Floating Celebration Icons */}
              <div className="absolute -top-4 -right-2 animate-bounce text-yellow-400 opacity-80" style={{ animationDelay: '0.3s' }}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-bounce text-pink-400 opacity-80" style={{ animationDelay: '1s' }}>
                <Star className="w-4 h-4" />
              </div>
              <div className="absolute top-2 -left-4 animate-bounce text-orange-400 opacity-80" style={{ animationDelay: '1.6s' }}>
                <Heart className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Dynamic Success Messages */}
          <div className="mb-6">
            <div className="relative h-12 mb-4">
              {successMessages.map((message, index) => (
                <h1
                  key={index}
                  className={`absolute inset-0 text-2xl sm:text-3xl font-bold transition-all duration-700 flex items-center justify-center ${
                    index === activeMessage
                      ? "opacity-100 transform translate-y-0 scale-100"
                      : "opacity-0 transform translate-y-4 scale-95"
                  }`}
                >
                  <span className="bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent">
                    {message}
                  </span>
                </h1>
              ))}
            </div>

            <p className={`text-lg mb-6 transition-all duration-700 ${
              isHovered ? "text-white" : "text-white/90"
            }`}>
              Welcome to {planName}, {userName}!
            </p>
          </div>



          {/* Action Buttons */}
          <div className="mb-6">
            {/* Primary Dashboard Button */}
            <button 
              onClick={handleDashboardRedirect}
              className="w-full group bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center space-x-2 text-white font-semibold">
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>


        </div>

        {/* Footer Brand */}
        <div className="text-center mt-6">
          <h2 className="text-xl font-bold mb-2">
            <span className="bg-gradient-to-r from-white via-pink-100 to-orange-100 bg-clip-text text-transparent">
              ShivBandhan
            </span>
          </h2>
          <p className="text-white/70 text-sm">
            Thank you for choosing us! 💝
          </p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-6 right-6 text-white/20 animate-pulse">
        <Heart className="w-8 h-8" />
      </div>
      <div
        className="absolute bottom-6 left-6 text-white/20 animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        <Sparkles className="w-6 h-6" />
      </div>
    </div>
  );
}