"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal, getTotalItems } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9EC] border-l border-[#E9E2CE] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#E9E2CE] flex items-center justify-between bg-[#F8F1DF]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#174E37]" />
              <h2 className="text-xl font-serif font-bold text-[#163D2D]">
                Your Basket ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#68786B] hover:text-[#163D2D] rounded-full hover:bg-[#E9E2CE]/50 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#EFF1DC] px-6 py-3 border-b border-[#E9E2CE]">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-xs font-semibold text-[#174E37] text-center">
                🎉 Congratulations! You have unlocked FREE shipping!
              </p>
            ) : (
              <div>
                <p className="text-xs text-[#163D2D] mb-1.5 font-medium">
                  Add <span className="font-bold text-[#174E37]">₹{freeShippingThreshold - subtotal}</span> more for <span className="font-bold">FREE Delivery</span>
                </p>
                <div className="w-full h-1.5 bg-[#E9E2CE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#174E37] transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#EFF1DC] rounded-full flex items-center justify-center mx-auto text-[#174E37]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#163D2D]">Your cart is empty</h3>
                <p className="text-sm text-[#68786B]">Explore our authentic handcrafted pickles and add flavor to your plate!</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="inline-block mt-2 px-6 py-2.5 bg-[#174E37] text-[#FFF9EC] rounded-full text-sm font-semibold hover:bg-[#0B4A32] transition-colors"
                >
                  Explore Pickles
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 p-3 bg-white/70 border border-[#E9E2CE] rounded-xl hover:shadow-sm transition-shadow"
                >
                  <div className="relative w-18 h-18 w-20 h-20 rounded-lg overflow-hidden bg-[#F8F1DF] flex-shrink-0 border border-[#E9E2CE]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-[#163D2D] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#68786B]">{item.weight}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-sm text-[#174E37]">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#E9E2CE] rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-[#EFF1DC] text-[#163D2D] rounded-l-md transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#163D2D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-[#EFF1DC] text-[#163D2D] rounded-r-md transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 text-[#68786B] hover:text-red-600 rounded-lg transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E9E2CE] bg-[#F8F1DF] space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#68786B]">Subtotal</span>
                <span className="font-bold text-base text-[#163D2D]">₹{subtotal}</span>
              </div>
              <p className="text-xs text-[#68786B]">
                Taxes and delivery fee calculated during checkout.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-3 px-4 border border-[#174E37] text-[#174E37] rounded-full text-center font-semibold text-sm hover:bg-[#174E37]/10 transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 px-4 bg-[#174E37] text-[#FFF9EC] rounded-full text-center font-semibold text-sm hover:bg-[#0B4A32] flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
