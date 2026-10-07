"use client";

import React, { useState } from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface ProductDetailActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    weight: string;
    stock: number;
  };
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice ?? undefined,
        image: product.image,
        weight: product.weight,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-6 pt-4 border-t border-[#E9E2CE]">
      {/* Quantity & Add to Cart Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Quantity selector */}
        <div className="flex items-center justify-between border-2 border-[#E9E2CE] rounded-full px-4 py-2.5 bg-white sm:w-36">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="p-1 text-[#163D2D] hover:text-[#174E37] disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-serif font-bold text-base text-[#163D2D]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock || isOutOfStock}
            className="p-1 text-[#163D2D] hover:text-[#174E37] disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 py-3.5 px-8 rounded-full font-semibold text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
            isAdded
              ? "bg-emerald-700 text-white"
              : isOutOfStock
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#174E37] text-[#FFF9EC] hover:bg-[#0B4A32] active:scale-95"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" /> Added to Basket!
            </>
          ) : isOutOfStock ? (
            "Currently Out of Stock"
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" /> Add to Basket — ₹{product.price * quantity}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
