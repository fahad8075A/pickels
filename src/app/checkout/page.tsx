"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/image";
import { ShieldCheck, Truck, CreditCard, Banknote, AlertCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponCode, clearCart, getSubtotal } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "Delhi",
    postalCode: "",
    notes: "",
    paymentMethod: "COD", // "COD" | "RAZORPAY"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 50;
  const estimatedDiscount =
    couponCode === "WELCOME10"
      ? Math.round((subtotal * 10) / 100)
      : couponCode === "TASTE50"
      ? 50
      : 0;
  const total = Math.max(0, subtotal - estimatedDiscount + shippingFee);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (items.length === 0) {
      setErrorMsg("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.addressLine ||
      !formData.city ||
      !formData.postalCode
    ) {
      setErrorMsg("Please fill in all mandatory shipping fields.");
      return;
    }

    setLoading(true);

    try {
      // 1. Submit Order to Server API
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode: couponCode || null,
          paymentMethod: formData.paymentMethod,
          shippingDetails: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            addressLine: formData.addressLine,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
          },
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order creation failed.");
      }

      const { order, razorpayOrder, isMockPayment } = data;

      // 2. Handle Payment Flow
      if (formData.paymentMethod === "COD") {
        clearCart();
        router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
      } else if (formData.paymentMethod === "RAZORPAY") {
        if (isMockPayment) {
          // Automatic verify in local mock mode
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              razorpayOrderId: razorpayOrder.id,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpaySignature: "mock_signature_valid",
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            clearCart();
            router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
          } else {
            router.push(`/checkout/failed?orderId=${order.id}&reason=${encodeURIComponent(verifyData.error || "Verification failed")}`);
          }
        } else {
          // Open standard Razorpay modal
          // @ts-ignore
          if (typeof window !== "undefined" && (window as any).Razorpay) {
            // @ts-ignore
            const rzp = new (window as any).Razorpay({
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              amount: razorpayOrder.amount,
              currency: "INR",
              name: "Zezty Pickles",
              description: `Order ${order.orderNumber}`,
              order_id: razorpayOrder.id,
              handler: async function (response: any) {
                const verifyRes = await fetch("/api/payments/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: order.id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  }),
                });
                if (verifyRes.ok) {
                  clearCart();
                  router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
                } else {
                  router.push(`/checkout/failed?orderId=${order.id}`);
                }
              },
              prefill: {
                name: formData.fullName,
                email: formData.email,
                contact: formData.phone,
              },
              theme: { color: "#174E37" },
            });
            rzp.open();
          } else {
            // Fallback mock payment simulation if script not loaded
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order.id,
                razorpayOrderId: razorpayOrder.id,
                razorpayPaymentId: `pay_test_${Date.now()}`,
                razorpaySignature: "mock_signature_valid",
              }),
            });
            clearCart();
            router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during checkout.");
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="py-20 text-center bg-[#FFF9EC] min-h-screen">
        <p className="text-[#68786B]">Preparing checkout...</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            SAFE & SECURE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#163D2D]">
            Order Checkout
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Shipping & Payment (7 Columns) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Shipping Address Section */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E9E2CE]">
                  <Truck className="w-5 h-5 text-[#174E37]" />
                  <h2 className="font-serif font-bold text-xl text-[#163D2D]">
                    Shipping Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                      Email Address (for order confirmation & tracking) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. priya@example.com"
                      className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                      Flat / House No., Street Address *
                    </label>
                    <input
                      type="text"
                      name="addressLine"
                      required
                      value={formData.addressLine}
                      onChange={handleChange}
                      placeholder="e.g. 402, Green Meadows Apartment, MG Road"
                      className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Gurugram"
                      className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                    >
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                      Postal PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 122003"
                      className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                      Delivery Instructions or Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g. Ring the doorbell or leave with security"
                      className="w-full px-4 py-2 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E9E2CE]">
                  <CreditCard className="w-5 h-5 text-[#174E37]" />
                  <h2 className="font-serif font-bold text-xl text-[#163D2D]">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === "COD"
                        ? "border-[#174E37] bg-[#EFF1DC]/50 shadow-sm"
                        : "border-[#E9E2CE] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={handleChange}
                        className="text-[#174E37] focus:ring-[#174E37] h-4 w-4"
                      />
                      <div>
                        <p className="font-bold text-sm text-[#163D2D]">Cash on Delivery (COD)</p>
                        <p className="text-xs text-[#68786B]">Pay with cash or UPI when your jar arrives</p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-[#174E37]" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === "RAZORPAY"
                        ? "border-[#174E37] bg-[#EFF1DC]/50 shadow-sm"
                        : "border-[#E9E2CE] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={formData.paymentMethod === "RAZORPAY"}
                        onChange={handleChange}
                        className="text-[#174E37] focus:ring-[#174E37] h-4 w-4"
                      />
                      <div>
                        <p className="font-bold text-sm text-[#163D2D]">Online Payment (Razorpay / UPI / Cards)</p>
                        <p className="text-xs text-[#68786B]">Instant secure checkout with signature verification</p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-[#174E37]" />
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 Columns) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-md space-y-6 sticky top-28">
              <h2 className="font-serif font-bold text-xl text-[#163D2D] pb-3 border-b border-[#E9E2CE]">
                Review Your Basket
              </h2>

              {/* Items mini list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F8F1DF] flex-shrink-0 border border-[#E9E2CE]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-xs text-[#163D2D] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#68786B]">
                        Qty: {item.quantity} • {item.weight}
                      </p>
                    </div>
                    <span className="font-serif font-bold text-sm text-[#163D2D]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-4 border-t border-[#E9E2CE] space-y-2 text-sm">
                <div className="flex justify-between text-[#68786B]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#163D2D]">₹{subtotal}</span>
                </div>
                {estimatedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({couponCode})</span>
                    <span>-₹{estimatedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#68786B]">
                  <span>Delivery</span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-[#E9E2CE] flex justify-between items-baseline">
                <span className="font-serif font-bold text-lg text-[#163D2D]">
                  Total To Pay
                </span>
                <span className="font-serif font-black text-2xl text-[#174E37]">
                  ₹{total}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-8 bg-[#174E37] text-[#FFF9EC] rounded-full font-bold text-base shadow-xl hover:bg-[#0B4A32] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>
                    Confirm & Place Order — ₹{total}
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#68786B]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>100% Encrypted & Authentic Guarantee</span>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
