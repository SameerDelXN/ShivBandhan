"use client"
import { useState, useEffect } from 'react';
import { ArrowRight, Phone, Shield, RotateCcw, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function MatrimonialLogin() {
  const router = useRouter()
  const [step, setStep] = useState(1); // 1: Phone Number, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSendOTP = async () => {
    setError('');
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\s/g, '') // Remove spaces
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(2);
        setResendTimer(30);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\s/g, ''), // Remove spaces
          otp: otpString
        }),
      });

      const data = await response.json();

      if (data.success) {
       router.push("/dashboard")
      } else {
        setError(data.error || 'OTP verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendTimer(30);
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\s/g, '') // Remove spaces
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Failed to resend OTP');
        setResendTimer(0); // Reset timer on error
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setResendTimer(0); // Reset timer on error
    }
  };

  const formatPhoneDisplay = (phone) => {
    return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center px-4 py-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-rose-100 blur-2xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-amber-100 blur-2xl opacity-40"></div>
      </div>

      <div className={`relative w-full max-w-md transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="text-center px-8 pt-12 pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
              <span className="text-white text-2xl font-bold">💕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Find your perfect match</p>
          </div>

          {/* Content */}
          <div className="px-8 pb-12">
            {step === 1 ? (
              // Phone Number Step
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Phone size={16} className="mr-2 text-rose-500" />
                    Enter Mobile Number
                  </label>
                  
                  <div className="flex space-x-3">
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-20 px-3 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                    
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 text-lg"
                      maxLength={10}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="font-medium">Send OTP</span>
                      <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              // OTP Step
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Verify OTP</h3>
                  <p className="text-gray-600 text-sm">
                    OTP sent to {countryCode} {formatPhoneDisplay(phoneNumber)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Enter 6-digit OTP
                  </label>
                  
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="font-medium">Verify OTP</span>
                      <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center justify-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Change Number
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Secure Login
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Trusted by 10,000+
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}