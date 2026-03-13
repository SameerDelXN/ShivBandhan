"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { CreditCard, Wallet, PlusCircle, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function WalletPage() {
  const { user, refreshSession } = useSession();
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(199);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state when user session loads
  useEffect(() => {
    if (user?.walletBalance !== undefined) {
      setWalletBalance(user.walletBalance);
    }
  }, [user?.walletBalance]);

  const topUpOptions = [199, 500, 1000, 2000];

  const handleAddFunds = async () => {
    try {
      if (selectedAmount <= 0) {
        toast.error("Please select a valid amount.");
        return;
      }

      setIsProcessing(true);
      const res = await loadRazorpay();
      if (!res) {
        toast.error("Failed to load Razorpay SDK. Please check your connection.");
        setIsProcessing(false);
        return;
      }

      // Step 1: Create Order
      const orderRes = await fetch("/api/wallet/add-funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || user?._id || user?.user?.id || user?.user?._id,
          amount: selectedAmount,
          action: "create_order",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      // Step 2: Trigger Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "ShivBandhan Wallet",
        description: `Add ₹${selectedAmount} to Wallet`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Step 3: Verify Payment
          try {
            const verifyRes = await fetch("/api/wallet/add-funds", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user?.id || user?._id || user?.user?.id || user?.user?._id,
                action: "verify_payment",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              toast.success(`Successfully added ₹${verifyData.addedAmount} to your wallet!`);
              setWalletBalance(verifyData.newBalance);
              await refreshSession(); // Trigger Sidebar update
            } else {
              toast.error(verifyData.error || "Failed to verify transaction.");
            }
          } catch (err) {
            toast.error("Network error during verification.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#f97316", // orange-500
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Wallet Add Funds Error:", err);
      toast.error(err.message || "An error occurred while initiating payment.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 mb-4">
            <Wallet className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Wallet</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add funds securely to unlock premium profiles anytime.
          </p>
        </div>

        {/* Current Balance Card */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-xl overflow-hidden p-8 text-white relative">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 bg-orange-700 opacity-20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <p className="text-orange-100 font-medium tracking-wide uppercase text-sm mb-1">Available Balance</p>
            <h2 className="text-5xl font-bold tracking-tight">₹{walletBalance}</h2>
          </div>
        </div>

        {/* Top-up Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PlusCircle className="h-5 w-5 text-orange-500 mr-2" />
            Select Top-up Amount
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {topUpOptions.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`relative py-4 px-2 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                  selectedAmount === amount
                    ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm transform scale-105"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-600"
                }`}
              >
                {selectedAmount === amount && (
                  <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-orange-500" />
                )}
                <span className="text-xl font-bold font-sans">₹{amount}</span>
              </button>
            ))}
          </div>

          {/* Secure Checkout Button */}
          <button
            onClick={handleAddFunds}
            disabled={isProcessing}
            className={`w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-xl text-lg font-medium text-white shadow-md transition-all duration-200 ${
              isProcessing
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 hover:shadow-lg active:transform active:scale-95"
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Processing Securely...
              </span>
            ) : (
              <span className="flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                Proceed with ₹{selectedAmount}
              </span>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4 text-green-500 mr-1" />
            100% Safe and Secure Payments powered by Razorpay
          </div>
        </div>

      </div>
    </div>
  );
}
