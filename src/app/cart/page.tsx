"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Tag, Check, AlertCircle } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    couponCode,
    setCouponCode,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponStatus, setCouponStatus] = useState<"idle" | "applied" | "error">("idle");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 50;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponInput.trim().toUpperCase();
    if (!clean) return;

    if (clean === "WELCOME10") {
      if (subtotal < 300) {
        setCouponStatus("error");
        setErrorMessage("WELCOME10 requires a minimum order of ₹300.");
        return;
      }
      const disc = Math.round((subtotal * 10) / 100);
      setDiscountAmount(disc);
      setCouponCode(clean);
      setCouponStatus("applied");
      setErrorMessage("");
    } else if (clean === "TASTE50") {
      if (subtotal < 400) {
        setCouponStatus("error");
        setErrorMessage("TASTE50 requires a minimum order of ₹400.");
        return;
      }
      setDiscountAmount(50);
      setCouponCode(clean);
      setCouponStatus("applied");
      setErrorMessage("");
    } else {
      setCouponStatus("error");
      setErrorMessage("Invalid coupon code.");
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  if (!mounted) {
    return (
      <div className="py-20 text-center bg-[#FFF9EC] min-h-screen">
        <p className="text-[#68786B]">Loading your basket...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 bg-[#FFF9EC] min-h-screen">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-[#EFF1DC] rounded-full flex items-center justify-center mx-auto text-[#174E37]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif font-black text-[#163D2D]">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-sm text-[#68786B] leading-relaxed">
            Discover our traditional handcrafted Indian pickles made from family recipes. Bring the authentic taste of home to your dining table!
          </p>
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm hover:bg-[#0B4A32] shadow-lg transition-all"
            >
              <span>Explore Pickles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#E9E2CE]">
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#163D2D]">
            Your Shopping Cart ({items.length} {items.length === 1 ? "Item" : "Items"})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-700 hover:text-red-900"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Cart Items List (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white p-5 rounded-2xl border border-[#E9E2CE] flex flex-col sm:flex-row items-center gap-5 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F8F1DF] flex-shrink-0 border border-[#E9E2CE]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-serif font-bold text-lg text-[#163D2D] hover:text-[#174E37]">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#68786B] mt-0.5">{item.weight}</p>
                  <p className="font-serif font-bold text-base text-[#174E37] mt-1 sm:hidden">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border-2 border-[#E9E2CE] rounded-full px-3 py-1 bg-[#FFF9EC]">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 text-[#163D2D] hover:text-[#174E37]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-bold text-[#163D2D]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 text-[#163D2D] hover:text-[#174E37]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right hidden sm:block w-24">
                  <span className="font-serif font-bold text-lg text-[#163D2D]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-[#68786B] hover:text-red-700 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary (4 Columns) */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-md space-y-6 sticky top-28">
            <h2 className="font-serif font-bold text-xl text-[#163D2D] pb-3 border-b border-[#E9E2CE]">
              Order Summary
            </h2>

            {/* Subtotals */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#68786B]">
                <span>Item Subtotal</span>
                <span className="font-bold text-[#163D2D]">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#68786B]">
                <span>Delivery Fee</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  <span className="font-bold text-[#163D2D]">₹{shippingFee}</span>
                )}
              </div>

              {shippingFee > 0 && (
                <p className="text-[11px] text-[#68786B] bg-[#EFF1DC] p-2 rounded-lg">
                  💡 Tip: Add ₹{499 - subtotal} more to qualify for FREE Delivery!
                </p>
              )}
            </div>

            {/* Coupon Code Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-[#163D2D] block">
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-[#68786B] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="w-full pl-9 pr-3 py-2 bg-[#FFF9EC] border border-[#E9E2CE] rounded-full text-xs text-[#163D2D] uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#174E37]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#174E37] text-[#FFF9EC] rounded-full text-xs font-semibold hover:bg-[#0B4A32]"
                >
                  Apply
                </button>
              </div>

              {couponStatus === "applied" && (
                <div className="flex items-center gap-1 text-xs text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Coupon applied successfully!</span>
                </div>
              )}
              {couponStatus === "error" && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>

            {/* Final Total */}
            <div className="pt-4 border-t border-[#E9E2CE] flex justify-between items-baseline">
              <div>
                <span className="font-serif font-bold text-lg text-[#163D2D] block">
                  Total Amount
                </span>
                <span className="text-[11px] text-[#68786B]">Inclusive of all taxes</span>
              </div>
              <span className="font-serif font-black text-2xl text-[#174E37]">
                ₹{finalTotal}
              </span>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-3.5 px-6 bg-[#174E37] text-[#FFF9EC] rounded-full font-bold text-sm shadow-xl hover:bg-[#0B4A32] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="text-center">
              <Link
                href="/products"
                className="text-xs text-[#68786B] hover:text-[#174E37] underline"
              >
                ← Continue Shopping Pickles
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
