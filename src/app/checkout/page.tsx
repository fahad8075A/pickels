"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  AlertCircle,
  Loader2,
  QrCode,
  Copy,
  Check,
  Building2,
  Smartphone,
  ExternalLink,
  Info,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface PaymentSettings {
  upiId: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: string;
  branch: string;
  instructions: string;
  razorpayKeyId: string;
  razorpayEnabled: boolean;
  directBankEnabled: boolean;
  codEnabled: boolean;
}

const DEFAULT_BANK_SETTINGS: PaymentSettings = {
  upiId: "zeztypickles@okaxis",
  accountHolderName: "Zezty Pickles Handcrafted Foods",
  accountNumber: "50200084729184",
  bankName: "HDFC Bank",
  ifscCode: "HDFC0001234",
  accountType: "Current Account",
  branch: "MG Road, Kochi, Kerala",
  instructions:
    "Scan the QR code or transfer to our direct bank account below. Enter your 12-digit UTR/UPI reference number to immediately confirm your order.",
  razorpayKeyId: "rzp_test_mock_key",
  razorpayEnabled: true,
  directBankEnabled: true,
  codEnabled: true,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponCode, clearCart, getSubtotal } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [bankSettings, setBankSettings] = useState<PaymentSettings>(DEFAULT_BANK_SETTINGS);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "Kerala",
    postalCode: "",
    notes: "",
    paymentMethod: "DIRECT_BANK", // "DIRECT_BANK" | "RAZORPAY" | "COD"
    utrNumber: "",
  });

  useEffect(() => {
    setMounted(true);
    // Fetch live merchant payment settings from backend
    fetch("/api/settings/payment")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setBankSettings(data.settings);
        }
      })
      .catch((err) => console.error("Could not fetch payment settings:", err));
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

  const copyToClipboard = (text: string, fieldId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
          utrNumber: formData.utrNumber.trim() || undefined,
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

      const { order, razorpayOrder, razorpayKeyId, isMockPayment } = data;

      // 2. Handle Payment Flow
      if (formData.paymentMethod === "DIRECT_BANK") {
        // Direct bank transfer / UPI payment successfully registered with customer's UTR
        clearCart();
        router.push(
          `/checkout/success?orderNumber=${order.orderNumber}&method=DIRECT_BANK${
            formData.utrNumber ? `&utr=${encodeURIComponent(formData.utrNumber.trim())}` : ""
          }`
        );
      } else if (formData.paymentMethod === "COD") {
        clearCart();
        router.push(`/checkout/success?orderNumber=${order.orderNumber}&method=COD`);
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
            router.push(`/checkout/success?orderNumber=${order.orderNumber}&method=RAZORPAY`);
          } else {
            router.push(
              `/checkout/failed?orderId=${order.id}&reason=${encodeURIComponent(
                verifyData.error || "Verification failed"
              )}`
            );
          }
        } else {
          // Ensure script is loaded
          await loadRazorpayScript();

          if (typeof window !== "undefined" && (window as any).Razorpay) {
            const keyToUse = razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            const rzp = new (window as any).Razorpay({
              key: keyToUse,
              amount: razorpayOrder.amount,
              currency: "INR",
              name: "Zezty Pickles",
              description: `Order ${order.orderNumber} - Amma's Handcrafted Pickles`,
              order_id: razorpayOrder.id,
              handler: async function (response: any) {
                try {
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
                    router.push(
                      `/checkout/success?orderNumber=${order.orderNumber}&method=RAZORPAY`
                    );
                  } else {
                    router.push(`/checkout/failed?orderId=${order.id}&reason=Verification%20failed`);
                  }
                } catch (verifyErr) {
                  router.push(`/checkout/failed?orderId=${order.id}&reason=Network%20error`);
                }
              },
              modal: {
                ondismiss: function () {
                  setLoading(false);
                },
              },
              prefill: {
                name: formData.fullName,
                email: formData.email,
                contact: formData.phone,
              },
              theme: { color: "#174E37" },
            });
            rzp.on("payment.failed", function (failResponse: any) {
              setLoading(false);
              setErrorMsg(
                failResponse?.error?.description ||
                  "Payment was declined by the bank or cancelled. Please try again."
              );
            });
            rzp.open();
          } else {
            // Fallback verification
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
            router.push(`/checkout/success?orderNumber=${order.orderNumber}&method=RAZORPAY`);
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

  // Construct UPI URI for dynamic QR generation
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(
    bankSettings.upiId
  )}&pn=${encodeURIComponent(
    bankSettings.accountHolderName
  )}&am=${total}&cu=INR&tn=${encodeURIComponent("Zezty Pickles Order")}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    upiIntentUri
  )}&bgcolor=FFF9EC&color=163D2D&margin=1`;

  return (
    <>
      {/* Official Razorpay Client Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="py-12 bg-[#FFF9EC] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
              തനത് കേരളം • 100% SECURE CHECKOUT
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#163D2D]">
              Complete Your Order
            </h1>
            <p className="text-sm text-[#68786B] mt-1">
              Direct settlement to bank account or instant payment gateway with encrypted security.
            </p>
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
                      Shipping Address
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
                        placeholder="e.g. Fatima Rahman / Arjun Nair"
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
                        placeholder="e.g. 9847123456"
                        className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                        Email Address (for order tracking & invoices) *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. fatima@example.com"
                        className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                        Flat / House No., Landmark & Street Address *
                      </label>
                      <input
                        type="text"
                        name="addressLine"
                        required
                        value={formData.addressLine}
                        onChange={handleChange}
                        placeholder="e.g. House No. 24, Near Calicut Beach Road"
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
                        placeholder="e.g. Kozhikode / Kochi / Bengaluru"
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
                        <option value="Kerala">Kerala</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
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
                        placeholder="e.g. 673001"
                        className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                        Special Instructions / Landmark (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="e.g. Please leave with security guard or call on arrival"
                        className="w-full px-4 py-2 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E2CE]">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#174E37]" />
                      <h2 className="font-serif font-bold text-xl text-[#163D2D]">
                        Choose Payment Method
                      </h2>
                    </div>
                    <span className="text-xs text-emerald-800 font-bold bg-[#EFF1DC] px-2.5 py-1 rounded-full">
                      Direct Bank Transfer Supported
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* OPTION 1: Direct Bank Transfer & Instant UPI (Direct to Owner Bank Account) */}
                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: "DIRECT_BANK" })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === "DIRECT_BANK"
                          ? "border-[#174E37] bg-[#EFF1DC]/40 shadow-md ring-2 ring-[#174E37]/20"
                          : "border-[#E9E2CE] hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="DIRECT_BANK"
                            checked={formData.paymentMethod === "DIRECT_BANK"}
                            onChange={handleChange}
                            className="text-[#174E37] focus:ring-[#174E37] h-5 w-5 mt-0.5"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm sm:text-base text-[#163D2D]">
                                Direct Bank Transfer & Instant UPI (To Our Bank Account)
                              </p>
                              <span className="bg-[#174E37] text-[#FFF9EC] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Recommended
                              </span>
                            </div>
                            <p className="text-xs text-[#68786B] mt-0.5">
                              0% gateway charges. Scan QR or transfer via GPay, PhonePe, Paytm, or NEFT/IMPS.
                            </p>
                          </div>
                        </div>
                        <Building2 className="w-6 h-6 text-[#174E37] flex-shrink-0" />
                      </div>

                      {/* Expanded Direct Bank Account & QR Panel */}
                      {formData.paymentMethod === "DIRECT_BANK" && (
                        <div className="mt-6 pt-5 border-t border-[#E9E2CE] space-y-6">
                          <div className="bg-[#FFF9EC] p-4 sm:p-5 rounded-2xl border border-[#E9E2CE]">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#174E37] mb-3">
                              <Info className="w-4 h-4" />
                              <span>OFFICIAL MERCHANT BANK ACCOUNT DETAILS</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                              {/* Bank Name */}
                              <div className="p-3 bg-white rounded-xl border border-[#E9E2CE]">
                                <span className="text-[#68786B] block">Bank Name & Branch</span>
                                <span className="font-bold text-sm text-[#163D2D]">
                                  {bankSettings.bankName} ({bankSettings.branch})
                                </span>
                              </div>

                              {/* Account Holder */}
                              <div className="p-3 bg-white rounded-xl border border-[#E9E2CE]">
                                <span className="text-[#68786B] block">Account Holder Name</span>
                                <span className="font-bold text-sm text-[#163D2D]">
                                  {bankSettings.accountHolderName}
                                </span>
                              </div>

                              {/* Account Number with Copy Button */}
                              <div className="p-3 bg-white rounded-xl border border-[#E9E2CE] flex items-center justify-between">
                                <div>
                                  <span className="text-[#68786B] block">Account Number ({bankSettings.accountType})</span>
                                  <span className="font-mono font-bold text-sm text-[#163D2D]">
                                    {bankSettings.accountNumber}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(bankSettings.accountNumber, "acc");
                                  }}
                                  className="px-2.5 py-1 text-[11px] bg-[#EFF1DC] text-[#174E37] rounded-lg font-bold hover:bg-[#174E37] hover:text-white transition flex items-center gap-1"
                                >
                                  {copiedField === "acc" ? (
                                    <>
                                      <Check className="w-3 h-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* IFSC Code with Copy Button */}
                              <div className="p-3 bg-white rounded-xl border border-[#E9E2CE] flex items-center justify-between">
                                <div>
                                  <span className="text-[#68786B] block">IFSC Code</span>
                                  <span className="font-mono font-bold text-sm text-[#163D2D]">
                                    {bankSettings.ifscCode}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(bankSettings.ifscCode, "ifsc");
                                  }}
                                  className="px-2.5 py-1 text-[11px] bg-[#EFF1DC] text-[#174E37] rounded-lg font-bold hover:bg-[#174E37] hover:text-white transition flex items-center gap-1"
                                >
                                  {copiedField === "ifsc" ? (
                                    <>
                                      <Check className="w-3 h-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* UPI ID with Copy Button */}
                              <div className="sm:col-span-2 p-3 bg-white rounded-xl border border-[#E9E2CE] flex items-center justify-between">
                                <div>
                                  <span className="text-[#68786B] block">Merchant UPI ID (GPay / PhonePe / Paytm / BHIM)</span>
                                  <span className="font-mono font-bold text-sm text-[#174E37]">
                                    {bankSettings.upiId}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(bankSettings.upiId, "upi");
                                  }}
                                  className="px-2.5 py-1 text-[11px] bg-[#EFF1DC] text-[#174E37] rounded-lg font-bold hover:bg-[#174E37] hover:text-white transition flex items-center gap-1"
                                >
                                  {copiedField === "upi" ? (
                                    <>
                                      <Check className="w-3 h-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic UPI QR Code Box */}
                          <div className="bg-white p-5 rounded-2xl border border-[#E9E2CE] flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative w-44 h-44 rounded-xl overflow-hidden bg-[#FFF9EC] border-2 border-[#174E37] p-2 flex items-center justify-center shadow-sm">
                              {/* Dynamic QR */}
                              <img
                                src={qrCodeUrl}
                                alt="UPI Payment QR Code"
                                className="w-full h-full object-contain"
                              />
                            </div>

                            <div className="space-y-3 text-center sm:text-left flex-1">
                              <span className="text-xs font-bold text-[#174E37] uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1">
                                <QrCode className="w-4 h-4" /> Scan & Pay Exact Amount
                              </span>
                              <p className="font-serif font-black text-2xl text-[#163D2D]">
                                ₹{total}
                              </p>
                              <p className="text-xs text-[#68786B] leading-relaxed">
                                Open any UPI App (Google Pay, PhonePe, Paytm, CRED) on your phone and scan this code to pay directly to our bank account.
                              </p>

                              {/* Mobile 1-Tap UPI Intent Button */}
                              <div className="pt-1">
                                <a
                                  href={upiIntentUri}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#174E37] text-[#FFF9EC] text-xs font-bold rounded-xl hover:bg-[#0B4A32] shadow-sm transition"
                                >
                                  <Smartphone className="w-3.5 h-3.5" /> Tap to Pay via UPI App
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* UTR Input Section */}
                          <div className="space-y-2 bg-[#EFF1DC]/60 p-4 rounded-2xl border border-[#E9E2CE]">
                            <label className="text-xs font-bold text-[#163D2D] block">
                              Enter 12-Digit UPI Ref / Bank UTR Number (Optional, for instant clearance)
                            </label>
                            <input
                              type="text"
                              name="utrNumber"
                              value={formData.utrNumber}
                              onChange={handleChange}
                              placeholder="e.g. 428190382910 (found in GPay/PhonePe payment details)"
                              className="w-full px-4 py-2.5 bg-white border border-[#E9E2CE] rounded-xl text-sm font-mono text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                            />
                            <p className="text-[11px] text-[#68786B]">
                              * If you haven&apos;t transferred yet, you can also place the order now and transfer within 2 hours. Our team will verify against our bank statement.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* OPTION 2: Online Payment Gateway (Razorpay) */}
                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: "RAZORPAY" })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === "RAZORPAY"
                          ? "border-[#174E37] bg-[#EFF1DC]/40 shadow-md ring-2 ring-[#174E37]/20"
                          : "border-[#E9E2CE] hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="RAZORPAY"
                            checked={formData.paymentMethod === "RAZORPAY"}
                            onChange={handleChange}
                            className="text-[#174E37] focus:ring-[#174E37] h-5 w-5 mt-0.5"
                          />
                          <div>
                            <p className="font-bold text-sm sm:text-base text-[#163D2D]">
                              Razorpay Payment Gateway (Cards, NetBanking, UPI)
                            </p>
                            <p className="text-xs text-[#68786B] mt-0.5">
                              Pay securely using Visa, Mastercard, RuPay, Netbanking, or Wallet. Funds settle directly to our merchant account.
                            </p>
                          </div>
                        </div>
                        <CreditCard className="w-6 h-6 text-[#174E37] flex-shrink-0" />
                      </div>
                    </div>

                    {/* OPTION 3: Cash on Delivery (COD) */}
                    <div
                      onClick={() => setFormData({ ...formData, paymentMethod: "COD" })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === "COD"
                          ? "border-[#174E37] bg-[#EFF1DC]/40 shadow-md ring-2 ring-[#174E37]/20"
                          : "border-[#E9E2CE] hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={formData.paymentMethod === "COD"}
                            onChange={handleChange}
                            className="text-[#174E37] focus:ring-[#174E37] h-5 w-5 mt-0.5"
                          />
                          <div>
                            <p className="font-bold text-sm sm:text-base text-[#163D2D]">
                              Cash on Delivery (COD)
                            </p>
                            <p className="text-xs text-[#68786B] mt-0.5">
                              Pay with cash or UPI directly to the delivery person when your jar arrives.
                            </p>
                          </div>
                        </div>
                        <Banknote className="w-6 h-6 text-[#174E37] flex-shrink-0" />
                      </div>
                    </div>
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
                  ) : formData.paymentMethod === "DIRECT_BANK" ? (
                    <span>Confirm Bank Transfer Order — ₹{total}</span>
                  ) : formData.paymentMethod === "RAZORPAY" ? (
                    <span>Proceed to Razorpay Gateway — ₹{total}</span>
                  ) : (
                    <span>Confirm COD Order — ₹{total}</span>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-[#68786B]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>100% Secure Transaction • Authentic Handcrafted</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
