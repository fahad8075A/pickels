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
    weightVariants?: string | Array<{ weight: string; price: number; originalPrice?: number }> | null;
    stock: number;
  };
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const parsedVariants: Array<{ weight: string; price: number; originalPrice?: number }> = React.useMemo(() => {
    if (!product.weightVariants) return [];
    if (Array.isArray(product.weightVariants)) return product.weightVariants;
    try {
      const parsed = JSON.parse(product.weightVariants);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [product.weightVariants]);

  const allVariants = React.useMemo(() => {
    if (parsedVariants.length > 0) return parsedVariants;
    return [{ weight: product.weight || "350g", price: product.price, originalPrice: product.originalPrice || undefined }];
  }, [parsedVariants, product.weight, product.price, product.originalPrice]);

  const [selectedVariant, setSelectedVariant] = useState(allVariants[0]);

  React.useEffect(() => {
    if (allVariants.length > 0) {
      setSelectedVariant(allVariants[0]);
    }
  }, [allVariants]);

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const currentWeight = selectedVariant?.weight ?? product.weight;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPrice,
        originalPrice: currentOriginalPrice ?? undefined,
        image: product.image,
        weight: currentWeight,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-6 pt-4 border-t border-[#E9E2CE]">
      {/* Weight Variant Option Pills */}
      {allVariants.length > 1 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#163D2D] block">
            Choose Jar Weight / Size:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allVariants.map((v) => {
              const isSelected = selectedVariant?.weight === v.weight;
              return (
                <button
                  key={v.weight}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-[#174E37] bg-[#EFF1DC]/70 shadow-sm ring-1 ring-[#174E37]"
                      : "border-[#E9E2CE] bg-white hover:border-[#174E37]/50"
                  }`}
                >
                  <p className="font-bold text-sm text-[#163D2D]">{v.weight}</p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-serif font-black text-base text-[#174E37]">₹{v.price}</span>
                    {v.originalPrice && v.originalPrice > v.price && (
                      <span className="text-xs text-[#68786B] line-through">₹{v.originalPrice}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
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
              <ShoppingBag className="w-5 h-5" /> Add to Basket — ₹{currentPrice * quantity}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
