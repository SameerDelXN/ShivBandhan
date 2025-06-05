"use client"
import { useState, useEffect } from 'react';
import { 
  Crown,
  Check,
  Star,
  Heart,
  MessageCircle,
  Eye,
  Shield,
  Zap,
  Gift,
  Trophy,
  Sparkles,
  Users,
  Clock,
  X
} from 'lucide-react';

export default function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const plans = {
    monthly: {
      premium: {
        name: 'Premium',
        price: 999,
        duration: 'month',
        savings: null,
        badge: 'Most Popular',
        badgeColor: 'bg-rose-500'
      }
    },
    sixMonths: {
      premium: {
        name: 'Premium',
        price: 4999,
        originalPrice: 5994,
        duration: '6 months',
        savings: '17% OFF',
        badge: 'Best Value',
        badgeColor: 'bg-amber-500'
      }
    },
    yearly: {
      premium: {
        name: 'Premium',
        price: 8999,
        originalPrice: 11988,
        duration: '12 months',
        savings: '25% OFF',
        badge: 'Maximum Savings',
        badgeColor: 'bg-green-500'
      }
    }
  };

  const features = {
    premium: [
      { icon: Eye, text: 'View unlimited profiles', highlight: true },
      { icon: Heart, text: 'Send unlimited interests', highlight: true },
      { icon: MessageCircle, text: 'Chat with mutual matches', highlight: true },
      { icon: Shield, text: 'See who viewed your profile', highlight: true },
      { icon: Star, text: 'Get featured in search results', highlight: true },
      { icon: Zap, text: 'Priority customer support', highlight: false },
      { icon: Crown, text: 'Premium badge on profile', highlight: false },
      { icon: Users, text: 'Advanced matching filters', highlight: false }
    ],
    free: [
      { icon: Eye, text: 'View 10 profiles per day', highlight: false },
      { icon: Heart, text: 'Send 5 interests per month', highlight: false },
      { icon: X, text: 'No chat access', highlight: false, disabled: true },
      { icon: X, text: 'Limited profile visibility', highlight: false, disabled: true }
    ]
  };

  const currentPlan = plans[selectedPlan].premium;

  const handleSubscribe = () => {
    // Navigate to checkout
    console.log('Navigating to checkout with plan:', currentPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-6">
              <Crown className="w-10 h-10 text-rose-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Plan</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock premium features and find your perfect match faster with our subscription plans
            </p>
          </div>
        </div>

        {/* Plan Duration Toggle */}
        <div className={`transform transition-all duration-1000 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-2 shadow-lg border border-rose-100/50">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedPlan === 'monthly'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-rose-50'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('sixMonths')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                    selectedPlan === 'sixMonths'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-rose-50'
                  }`}
                >
                  6 Months
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                    17% OFF
                  </span>
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-rose-50'
                  }`}
                >
                  12 Months
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    25% OFF
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Premium Plan */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-rose-100/50 relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-50 rounded-full blur-xl opacity-30"></div>
                
                {/* Badge */}
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${currentPlan.badgeColor} text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg`}>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{currentPlan.badge}</span>
                  </div>
                </div>

                <div className="relative z-10 pt-6">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                        <Crown className="w-8 h-8 text-rose-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">💎 Premium Plan</h3>
                    <div className="flex items-center justify-center space-x-2">
                      {currentPlan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">₹{currentPlan.originalPrice}</span>
                      )}
                      <span className="text-4xl font-bold text-rose-600">₹{currentPlan.price}</span>
                      <span className="text-gray-600">/{currentPlan.duration}</span>
                    </div>
                    {currentPlan.savings && (
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Save {currentPlan.savings}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {features.premium.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          feature.highlight ? 'bg-rose-100' : 'bg-gray-100'
                        }`}>
                          <feature.icon className={`w-4 h-4 ${
                            feature.highlight ? 'text-rose-500' : 'text-gray-500'
                          }`} />
                        </div>
                        <span className={`${feature.highlight ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleSubscribe}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Subscribe Now</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Free Plan */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full blur-xl opacity-50"></div>
                
                <div className="relative z-10">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Gift className="w-8 h-8 text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">🆓 Basic Plan</h3>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-600">₹0</span>
                      <span className="text-gray-600">/forever</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {features.free.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          feature.disabled ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          <feature.icon className={`w-4 h-4 ${
                            feature.disabled ? 'text-red-500' : 'text-gray-500'
                          }`} />
                        </div>
                        <span className={`${feature.disabled ? 'text-red-600 line-through' : 'text-gray-600'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Current Plan Button */}
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-bold text-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 rounded-2xl p-8 border border-rose-100/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Premium?</h2>
              <p className="text-gray-600">Join thousands of successful matches who found love with Premium</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">3x More Matches</h3>
                <p className="text-sm text-gray-600">Premium users get significantly more profile views and matches</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Find Love Faster</h3>
                <p className="text-sm text-gray-600">Average time to find a match reduces by 50% with Premium</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Safe & Secure</h3>
                <p className="text-sm text-gray-600">Enhanced privacy controls and verified profiles only</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-100/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing cycle.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600">Absolutely! We use industry-standard encryption and work with trusted payment providers to ensure your information is always safe.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What happens to my matches if I downgrade?</h3>
                <p className="text-gray-600">Your existing matches and conversations remain intact. However, you'll be limited to the free plan features for new interactions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}