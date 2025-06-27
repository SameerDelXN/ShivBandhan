"use client";
import React, { useState, useEffect } from "react";
import { XCircle, ArrowRight, RefreshCw, AlertTriangle, Zap, Shield, CreditCard } from "lucide-react";

export default function PaymentFailure({ 
  userName = "Valued Member", 
  planName = "Premium", 
  amount = "2,999",
  transactionId = "TXN-2025-0624-001",
  errorMessage = "Payment could not be processed"
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);

  const failureMessages = [
    "Payment Failed 💳",
    "Let's Try Again! 🔄",
    "We're Here to Help! 💪"
  ];

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % failureMessages.length);
    }, 2500);
    return () => clearInterval(messageTimer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleRetryPayment = () => window.location.href = '/dashboard/subscription';
  const handleGoHome = () => window.location.href = '/dashboard';

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center p-4 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scaled-down Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-full blur-xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${-100 + mousePosition.x * 0.3}px, ${-100 + mousePosition.y * 0.3}px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${80 - mousePosition.x * 0.2}px, ${80 - mousePosition.y * 0.2}px)`,
          }}
        />

        {/* Smaller Floating Decorations */}
        <div className="absolute top-12 left-12 animate-bounce" style={{ animationDelay: "0.2s" }}>
          <AlertTriangle className="w-4 h-4 text-orange-300/40" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce" style={{ animationDelay: "0.8s" }}>
          <Shield className="w-3 h-3 text-red-300/40" />
        </div>
      </div>

      {/* Compact Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-5 text-center hover:bg-white/15 transition-all duration-500 shadow-xl">
          
          {/* Scaled-down Failure Icon */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                <XCircle className="w-8 h-8 text-white animate-pulse" fill="currentColor" />
              </div>
              <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '0.3s' }}>
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Dynamic Messages */}
          <div className="relative h-10 mb-3">
            {failureMessages.map((message, index) => (
              <h2
                key={index}
                className={`absolute inset-0 text-xl font-bold transition-all duration-500 flex items-center justify-center ${
                  index === activeMessage
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <span className="bg-gradient-to-r from-white via-orange-100 to-red-100 bg-clip-text text-transparent">
                  {message}
                </span>
              </h2>
            ))}
          </div>

          <p className={`text-sm mb-3 transition-colors ${isHovered ? "text-white" : "text-white/90"}`}>
            Don't worry {userName}!
          </p>

          <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10 text-xs">
            <p className="text-white/80 mb-1"><strong>Error:</strong> {errorMessage}</p>
            
          </div>

          {/* Compact Buttons */}
          <div className="space-y-2">
            <button 
              onClick={handleRetryPayment}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all hover:scale-[1.02]"
            >
              <span className="flex items-center justify-center gap-1">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </span>
            </button>
            
            <button 
              onClick={handleGoHome}
              className="w-full text-white/70 hover:text-white text-xs transition-colors"
            >
              <span className="flex items-center justify-center gap-1">
                Go to Homepage
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-3 text-white/60 text-xs">
            ShivBandhan • We're here to help
          </div>
        </div>
      </div>
    </div>
  );
}