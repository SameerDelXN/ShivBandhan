"use client";
import { useState, useEffect } from "react";
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
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { set } from "mongoose";
import { useSession } from '@/context/SessionContext';

export default function DynamicSubscriptionPlans() {
  const {user} = useSession();
  console.log("User:", user);
  const [plans, setPlans] = useState([]);
  const [freePlan, setFreePlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/subscription");
        if (!response.ok) {
          throw new Error("Failed to fetch subscription plans");
        }
        const data = await response.json();

        //Find the free plan
        const freePlan = data.find(
          (plan) =>
            plan.price === 0 ||
            plan.price === "0" ||
            plan.name?.toLowerCase().includes("free")
        );

        const paidPlans = data.filter((plan) => plan !== freePlan);

        setFreePlan(freePlan);
        setPlans(paidPlans);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscription = async (plan) => {
  try {
    // 1. Create Razorpay Order from your backend
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: plan.price,
        userId: user?.user?.id,
        planId: plan._id,
      }),
    });

    const order = await res.json();

    // 2. Configure Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "ShivBandhan Subscription",
      description: plan.name,
      order_id: order.id,
      handler: async function (response) {
        alert("✅ Payment successful: " + response.razorpay_payment_id);

        // 3. Save the user subscription in DB (with required fields)
        await fetch("/api/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: plan.name,
            price: plan.price,
            durationInDays: plan.durationInDays,
            features: plan.features || [], // if available
            userId: user?.user?.id, // optional, if needed
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
      },
      prefill: {
        name: user?.user?.name || "Aniket Dahire",
        email: user?.user?.email || "aniket@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    console.error("❌ Error in handleSubscription:", err);
    alert("Something went wrong. Please try again.");
  }
};

  console.log(plans);
  // Get plan configuration based on name
  const getPlanConfig = (planName) => {
    const configs = {
      Gold: {
        icon: Crown,
        color: "from-yellow-400 to-yellow-600",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-600",
        badgeColor: "bg-yellow-500",
        emoji: "👑",
      },
      Premium: {
        icon: Crown,
        color: "from-rose-500 to-pink-500",
        bgColor: "bg-rose-100",
        textColor: "text-rose-600",
        badgeColor: "bg-rose-500",
        emoji: "💎",
      },
      Free: {
        icon: Gift,
        color: "from-gray-400 to-gray-600",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        badgeColor: "bg-gray-500",
        emoji: "🆓",
      },
    };

    // Match plan names containing keywords
    if (planName.toLowerCase().includes("gold")) return configs["Gold"];
    if (planName.toLowerCase().includes("premium")) return configs["Premium"];
    if (planName.toLowerCase().includes("free")) return configs["Free"];

    // Default to Premium config if plan name not found
    return configs["Premium"];
  };

  // Get badge text based on plan
  const getBadgeText = (plan) => {
    if (plan.name?.toLowerCase().includes("gold"));
    if (plan.name?.toLowerCase().includes("premium"));
    return "";
  };

  // Format price display
  const formatPrice = (price) => {
    if (price === 0 || price === "0") return "0";
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Get duration text
  const getDurationText = (duration) => {
    if (duration === 30) return "month";
    if (duration === 60) return "2 months";
    if (duration === 90) return "3 months";
    if (duration === 180) return "6 months";
    if (duration === 365) return "12 months";
    return `${duration} days`;
  };

  const handleSubscribe = (plan) => {
    console.log("Subscribing to plan:", plan);
    // Navigate to checkout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Plans
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Separate free and paid plans
  const freePlans = plans.filter(
    (plan) =>
      plan.price === 0 ||
      plan.price === "0" ||
      plan.name?.toLowerCase().includes("free")
  );
  const paidPlans = plans.filter(
    (plan) =>
      (plan.price > 0 || plan.price > "0") &&
      !plan.name?.toLowerCase().includes("free")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header (unchanged) */}
        <div
          className={`transform transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full mb-6">
              <Crown className="w-10 h-10 text-rose-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock premium features and find your perfect match faster with
              our subscription plans
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div
          className={`transform transition-all duration-1000 delay-200 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {/* Free Plan - Dynamic */}
            {freePlan &&
              (() => {
                const config = getPlanConfig(freePlan.name);
                const IconComponent = config.icon;
                return (
                  <div key={freePlan._id} className="relative">
                    <div
                      className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200 relative overflow-hidden ${
                        !freePlan.isActive ? "opacity-70" : ""
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full blur-xl opacity-50"></div>

                      <div className="relative z-10">
                        {/* Plan Header */}
                        <div className="text-center mb-8">
                          <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <Gift className="w-8 h-8 text-gray-500" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            🆓 {freePlan.name}
                          </h3>
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-4xl font-bold text-gray-600">
                              ₹{formatPrice(freePlan.price)}
                            </span>
                            <span className="text-gray-600">/forever</span>
                          </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mb-8">
                          {freePlan.features && freePlan.features.length > 0 ? (
                            freePlan.features
                              .slice(0, 5)
                              .map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-3"
                                >
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-gray-100">
                                    <Check className="w-4 h-4 text-gray-500" />
                                  </div>
                                  <span className="text-gray-600">
                                    {feature}
                                  </span>
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-500 text-center">
                              No features specified
                            </p>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="mb-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              freePlan.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                freePlan.isActive
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            {freePlan.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {/* Current Plan Button */}
                        <button
                          disabled
                          className={`w-full bg-gradient-to-r ${config.color} text-white py-4 rounded-xl font-bold text-lg cursor-not-allowed`}
                        >
                          Current Plan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* Map through all plans */}
            {plans.map((plan) => {
              // Determine plan type based on name or price
              const planType = plan.name.includes("Gold")
                ? "Gold"
                : plan.name.includes("Premium")
                ? "Premium"
                : "Silver"; // default to Silver if not specified

              const config = getPlanConfig(planType);
              const IconComponent = config.icon;
              const badgeText = getBadgeText(plan);

              return (
                <div key={plan._id} className="relative">
                  <div
                    className={`bg-white rounded-2xl p-8 shadow-2xl border border-rose-100/50 relative overflow-hidden transform hover:scale-105 transition-transform duration-300 ${
                      !plan.isActive ? "opacity-70" : ""
                    }`}
                  >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-50 rounded-full blur-xl opacity-30"></div>

                    {/* Badge */}
                    {badgeText && (
                      <div
                        className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${config.badgeColor} text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg`}
                      >
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-4 h-4" />
                          <span>{badgeText}</span>
                        </div>
                      </div>
                    )}

                    <div className="relative z-10 pt-6">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                          <div
                            className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center`}
                          >
                            <IconComponent
                              className={`w-8 h-8 ${config.textColor}`}
                            />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {config.emoji} {plan.name}
                        </h3>
                        <div className="flex items-center justify-center space-x-2">
                          <span
                            className={`text-4xl font-bold ${config.textColor}`}
                          >
                            ₹{formatPrice(plan.price)}
                          </span>
                          <span className="text-gray-600">
                            /{getDurationText(plan.durationInDays)}
                          </span>
                        </div>
                      </div>

                      {/* Features List - Now using dynamic features from API */}
                      <div className="space-y-4 mb-8">
                        {plan.features && plan.features.length > 0 ? (
                          plan.features.slice(0, 5).map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-3"
                            >
                              <div
                                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${config.bgColor}`}
                              >
                                <Check
                                  className={`w-4 h-4 ${config.textColor}`}
                                />
                              </div>
                              <span className="text-gray-900 font-medium">
                                {feature}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center">
                            No features specified
                          </p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            plan.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              plan.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* CTA Button */}
                      <button
                     onClick={() => handleSubscription(plan)}
                        className={`w-full bg-gradient-to-r ${
                          config.color
                        } text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg ${
                          !plan.isActive ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!plan.isActive}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Sparkles className="w-5 h-5" />
                          <span>
                            {plan.isActive ? "Subscribe Now" : "Unavailable"}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        {plans.length > 0 && (
          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I cancel my subscription anytime?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can cancel your subscription at any time. You'll
                    continue to have access to premium features until the end of
                    your billing cycle.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is my payment information secure?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely! We use industry-standard encryption and work
                    with trusted payment providers to ensure your information is
                    always safe.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What happens to my matches if I downgrade?
                  </h3>
                  <p className="text-gray-600">
                    Your existing matches and conversations remain intact.
                    However, you'll be limited to the free plan features for new
                    interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
