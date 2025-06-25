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
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 sm:p-10 text-center hover:bg-white/15 transition-all duration-700 shadow-2xl">
          
          {/* Success Icon with Glow */}
          <div className="mb-8 flex justify-center">
            <div
              className={`relative group cursor-pointer transition-all duration-700 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              style={{
                filter: isHovered
                  ? "drop-shadow(0 25px 50px rgba(34, 197, 94, 0.3))"
                  : "drop-shadow(0 15px 35px rgba(34, 197, 94, 0.2))",
              }}
            >
              {/* Pulsing Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse" />
              
              {/* Success Icon Container */}
              <div className="relative bg-green-500/20 backdrop-blur-sm border-2 border-green-400/40 rounded-full p-6 group-hover:bg-green-500/30 transition-all duration-700">
                <CheckCircle 
                  className={`w-16 h-16 text-green-400 transition-all duration-500 ${
                    isHovered ? "scale-110 text-green-300" : "scale-100"
                  }`} 
                  fill="currentColor"
                />
              </div>

              {/* Success Sparkles */}
              <div className="absolute -top-1 -right-1 animate-pulse">
                <Sparkles className="w-6 h-6 text-yellow-300/80" />
              </div>
            </div>
          </div>

          {/* Dynamic Success Messages */}
          <div className="mb-8">
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

          {/* Payment Details */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-white/70 text-sm mb-1">Amount Paid</p>
                <p className="text-white font-bold text-xl">₹{amount}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-white/70 text-sm mb-1">Plan</p>
                <p className="text-white font-semibold text-lg">{planName}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Transaction ID:</span>
                <span className="font-mono text-white/90 text-sm">{transactionId}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            {/* Primary Dashboard Button */}
            <button 
              onClick={handleDashboardRedirect}
              className="w-full group bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-2xl px-8 py-4 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center space-x-2 text-white font-semibold">
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Secondary Download Button */}
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 hover:border-white/50 rounded-2xl px-8 py-4 transition-all duration-300 hover:scale-105">
              <span className="flex items-center justify-center space-x-2 text-white font-medium">
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </span>
            </button>
          </div>

          {/* Auto Redirect Notice */}
          {/* <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
            <p className="text-blue-100 text-sm">
              {showRedirect ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                  <span>Redirecting to dashboard...</span>
                </span>
              ) : (
                <>Redirecting to dashboard in <span className="font-semibold text-blue-200">{countdown}</span> seconds</>
              )}
            </p>
          </div> */}
        </div>

        {/* Footer Brand */}
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-2">
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