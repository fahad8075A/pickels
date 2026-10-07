"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check, Eye } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  weight: string;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  slug,
  shortDescription,
  price,
  originalPrice,
  image,
  weight,
  stock,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock <= 0) return;

    addItem({
      productId: id,
      name,
      slug,
      price,
      originalPrice: originalPrice ?? undefined,
      image,
      weight,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-[#E9E2CE] hover:border-[#174E37]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-[#F8F1DF] overflow-hidden">
        <Link href={`/products/${slug}`} className="block w-full h-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Stock badge */}
        <div className="absolute top-3 left-3">
          {isOutOfStock ? (
            <span className="px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-full shadow">
              Sold Out
            </span>
          ) : stock <= 15 ? (
            <span className="px-3 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-full shadow">
              Only {stock} left
            </span>
          ) : (
            <span className="px-3 py-1 bg-[#EFF1DC] text-[#174E37] text-[11px] font-bold rounded-full border border-[#E9E2CE]">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Button */}
        <Link
          href={`/products/${slug}`}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#163D2D] hover:bg-[#174E37] hover:text-[#FFF9EC] flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label={`View details of ${name}`}
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Card Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#68786B]">
            <span className="font-semibold uppercase tracking-wider">{weight}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Save ₹{originalPrice - price}
              </span>
            )}
          </div>

          <Link href={`/products/${slug}`}>
            <h3 className="font-serif font-bold text-xl text-[#163D2D] group-hover:text-[#174E37] transition-colors">
              {name}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-[#68786B] line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        <div className="pt-2 border-t border-[#E9E2CE]/70 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-black text-2xl text-[#163D2D]">
              ₹{price}
            </span>
            {originalPrice && (
              <span className="text-sm text-[#68786B] line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              isAdded
                ? "bg-emerald-600 text-white"
                : isOutOfStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#174E37] text-[#FFF9EC] hover:bg-[#0B4A32] active:scale-95 shadow-md"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
