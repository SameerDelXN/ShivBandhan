"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext"; // or however you store user
import Script from "next/script";

export default function SubscriptionPage() {
  const { user } = useSession();
  const [plans, setPlans] = useState([]);

  // Load plans and Razorpay script
  useEffect(() => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then(setPlans);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubscribe = async (plan) => {
    try {
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
      if (!order?.id) throw new Error("Invalid order response");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ShivBandhan",
        description: plan.name,
        order_id: order.id,
        handler: async function (response) {
          alert("✅ Payment successful! Payment ID: " + response.razorpay_payment_id);

          // Save the subscription in your DB
          await fetch("/api/subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: plan.name,
              price: plan.price,
              durationInDays: plan.durationInDays,
              features: plan.features || [],
              userId: user?.user?.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
        },
        prefill: {
          name: user?.user?.name || "User",
          email: user?.user?.email || "email@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Payment error:", error);
      alert("Something went wrong. Please try again.");
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
          <button
            onClick={() => handleSubscribe(plan)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Subscribe
          </button>
        </div>
      ))}
    </div>
  );
}
