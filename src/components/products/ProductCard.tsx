"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check, Eye, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export interface ProductCardProps {
  id: string;
  name: string;
  malayalamName?: string;
  culturalTag?: string;
  slug: string;
  shortDescription: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  weight: string;
  weightVariants?: string | Array<{ weight: string; price: number; originalPrice?: number }> | null;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  malayalamName,
  culturalTag,
  slug,
  shortDescription,
  price,
  originalPrice,
  image,
  weight,
  weightVariants,
  stock,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  // Parse weight variants
  const parsedVariants: Array<{ weight: string; price: number; originalPrice?: number }> = React.useMemo(() => {
    if (!weightVariants) return [];
    if (Array.isArray(weightVariants)) return weightVariants;
    try {
      const parsed = JSON.parse(weightVariants);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [weightVariants]);

  const allVariants = React.useMemo(() => {
    if (parsedVariants.length > 0) return parsedVariants;
    return [{ weight: weight || "350g", price, originalPrice: originalPrice || undefined }];
  }, [parsedVariants, weight, price, originalPrice]);

  const [selectedVariant, setSelectedVariant] = useState(allVariants[0]);

  // Keep selected variant in sync if props change
  React.useEffect(() => {
    if (allVariants.length > 0) {
      setSelectedVariant(allVariants[0]);
    }
  }, [allVariants]);

  const currentPrice = selectedVariant?.price ?? price;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? originalPrice;
  const currentWeight = selectedVariant?.weight ?? weight;

  // Derive Malayalam title if not explicitly passed
  const displayMalayalam =
    malayalamName ||
    (slug.includes("mango")
      ? "മാങ്ങ അച്ചാർ"
      : slug.includes("garlic")
      ? "വെളുത്തുള്ളി അച്ചാർ"
      : slug.includes("mixed")
      ? "മിക്സഡ് വെജിറ്റബിൾ അച്ചാർ"
      : "");

  const displayTag =
    culturalTag ||
    (slug.includes("mango")
      ? "നാടൻ രുചി"
      : slug.includes("garlic")
      ? "തനിനാടൻ രുചി"
      : "മലബാറിന്റെ രുചി");

  // Clean English title if it contained bullet
  const cleanEnglishName = name.split("•")[0].trim();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock <= 0) return;

    addItem({
      productId: id,
      name: cleanEnglishName,
      slug,
      price: currentPrice,
      originalPrice: currentOriginalPrice ?? undefined,
      image,
      weight: currentWeight,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="group bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#E9E2CE] hover:border-[#174E37]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Area */}
      <div>
        <div className="relative aspect-square w-full bg-[#F8F1DF] overflow-hidden">
          <Link href={`/products/${slug}`} className="block w-full h-full">
            <Image
              src={image}
              alt={`${cleanEnglishName} - ${displayMalayalam}`}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>

          {/* Stock / Heritage Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOutOfStock ? (
              <span className="px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-full shadow">
                Sold Out
              </span>
            ) : (
              <span className="px-3 py-1 bg-[#EFF1DC] text-[#174E37] text-[11px] font-bold rounded-full border border-[#E9E2CE] flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#F5B82E]" />
                <span>{displayTag}</span>
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <Link
            href={`/products/${slug}`}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm text-[#163D2D] hover:bg-[#174E37] hover:text-[#FFF9EC] flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label={`View details of ${cleanEnglishName}`}
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Card Details */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#68786B]">
            <span className="font-semibold uppercase tracking-wider">{currentWeight}</span>
            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
              <span className="text-emerald-800 font-bold bg-[#EFF1DC] px-2 py-0.5 rounded border border-[#E9E2CE]">
                Save ₹{currentOriginalPrice - currentPrice}
              </span>
            )}
          </div>

          <div>
            <Link href={`/products/${slug}`} className="block group-hover:text-[#174E37]">
              <h3 className="font-serif font-bold text-2xl text-[#163D2D] transition-colors leading-snug">
                {cleanEnglishName}
              </h3>
            </Link>
            {displayMalayalam && (
              <p className="text-sm font-semibold text-[#174E37] mt-0.5 font-sans">
                {displayMalayalam}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#68786B] line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>

          {/* Gram / Weight Variant Selector */}
          {allVariants.length > 1 && (
            <div className="pt-2">
              <span className="text-[10px] font-bold text-[#68786B] uppercase tracking-wider block mb-1.5">
                Choose Jar Size:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {allVariants.map((v) => {
                  const isSelected = selectedVariant?.weight === v.weight;
                  return (
                    <button
                      key={v.weight}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVariant(v);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                        isSelected
                          ? "bg-[#174E37] text-[#FFF9EC] border-[#174E37] shadow-sm scale-105"
                          : "bg-white text-[#163D2D] border-[#E9E2CE] hover:border-[#174E37]/60"
                      }`}
                    >
                      <span>{v.weight}</span>
                      <span className="ml-1 opacity-90 text-[11px] font-semibold">₹{v.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price & Add to Cart button */}
      <div className="p-6 pt-0 border-t border-[#E9E2CE]/60 mt-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-serif font-black text-2xl text-[#163D2D]">
            ₹{currentPrice}
          </span>
          {currentOriginalPrice && (
            <span className="text-sm text-[#68786B] line-through">
              ₹{currentOriginalPrice}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            isAdded
              ? "bg-emerald-600 text-white"
              : isOutOfStock
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#174E37] text-[#FFF9EC] hover:bg-[#0B4A32] active:scale-95 shadow-md"
          }`}
          aria-label={`Add ${cleanEnglishName} to cart`}
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
  );
}
