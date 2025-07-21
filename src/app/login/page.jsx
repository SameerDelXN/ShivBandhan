"use client"
import { useState, useEffect } from 'react';
import { ArrowRight, Phone, Shield, RotateCcw, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext'

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
  const { login, user } = useSession()

  useEffect(() => {
    setIsLoaded(true);
    
    // Check if user is already logged in
    if (user) {
      router.push(`/dashboard`);
    }
  }, [user, router]);

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
      console.log(data)
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
    setError(''); // Clear previous errors
    
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\s/g, ''),
          otp: otpString
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      if (data.success) {
        await login(data.userId);
        console.log(data)
        // Redirect based on user status
        router.push(`/dashboard/${data.userId}`);
      } else {
        setError(data.error || 'OTP verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Network error. Please try again.');
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

  // If user exists and component is loaded, don't render the login form
  if (user && isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center px-4 py-8 sm:px-6">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-rose-100 blur-xl sm:blur-2xl opacity-30"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-32 h-32 sm:w-56 sm:h-56 rounded-full bg-amber-100 blur-xl sm:blur-2xl opacity-40"></div>
      </div>

      <div className={`relative w-full max-w-md transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="text-center px-6 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
              <span className="text-white text-xl sm:text-2xl font-bold">💕</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-600">Find your perfect match</p>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 pb-8 sm:pb-12">
            {step === 1 ? (
              // Phone Number Step
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                    <Phone size={14} className="mr-2 text-rose-500" />
                    Enter Mobile Number
                  </label>
                  
                  <div className="flex space-x-2 sm:space-x-3">
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-20 sm:w-24 px-2 sm:px-3 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
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
                      className="flex-1 px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg"
                      maxLength={10}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-md sm:rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg sm:rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base font-medium">Send OTP</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              // OTP Step
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Shield size={18} className="text-green-600 sm:text-xl" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Verify OTP</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    OTP sent to {countryCode} {formatPhoneDisplay(phoneNumber)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
                    Enter 6-digit OTP
                  </label>
                  
                  <div className="flex justify-center space-x-2 sm:space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-md sm:rounded-lg border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg sm:rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base font-medium">Verify OTP</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                <div className="flex flex-col space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                  <button
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className="text-rose-600 hover:text-rose-700 text-xs sm:text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <RotateCcw size={14} className="mr-1 sm:mr-2" />
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-gray-600 hover:text-gray-700 text-xs sm:text-sm font-medium flex items-center justify-center"
                  >
                    <Edit size={14} className="mr-1 sm:mr-2" />
                    Change Number
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
              Secure Login
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
              Trusted by 10,000+
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}