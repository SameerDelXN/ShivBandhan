"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";

export default function SubscriptionPage() {
  const { user, setUser } = useSession();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // ✅ Fetch subscription plans
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/subscription");
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error("Failed to load plans", err);
      }
    };

    fetchPlans();

    // ✅ Add Razorpay script once
    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSubscribe = async (plan) => {
    try {
      // ✅ Create Razorpay order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.user?.id,
          planId: plan._id,
        }),
      });

      const order = await res.json();
      if (!order?.id) throw new Error("Failed to create order");

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "ShivBandhan",
        description: plan.name,
        order_id: order.id,
        handler: async (response) => {
          alert("✅ Payment successful");

          // ✅ Save subscription to DB
          await fetch("/api/user/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user?.user?.id,
              planId: plan._id,
              razorpay_payment_id: response.razorpay_payment_id,
            }),
          });

          // ✅ Refetch updated user from backend
          const updatedRes = await fetch(`/api/users/${user?.user?.id}`);
          const updatedUser = await updatedRes.json();

          // ✅ Update user in context
          setUser({ user: updatedUser });

          alert("🎉 Subscription Activated!");
        },
        prefill: {
          name: user?.user?.name || "User",
          email: user?.user?.email || "email@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      });

      razorpay.open();
    } catch (err) {
      console.error("❌ Subscription error:", err);
      alert("❌ Payment failed. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Choose a Plan</h1>

      {plans.map((plan) => (
        <div key={plan._id} className="border p-4 rounded mb-4">
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p className="text-gray-600">₹{plan.price}</p>

          <ul className="text-sm text-gray-500 my-2">
            {plan.features?.map((f, i) => (
              <li key={i}>✅ {f}</li>
            ))}
          </ul>

          {user?.user?.subscription?.subscriptionId?.toString() ===
          plan?._id?.toString() ? (
            <button
              disabled
              className={`w-full bg-gradient-to-r ${config.color} text-white py-4 rounded-xl font-bold text-lg cursor-not-allowed opacity-70`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5" />
                <span>🎉 Subscribed</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleSubscribe(plan)}
              className={`w-full bg-gradient-to-r ${
                config.color
              } text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg ${
                !plan.isActive ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!plan.isActive}
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>{plan.isActive ? "Subscribe Now" : "Unavailable"}</span>
              </div>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
