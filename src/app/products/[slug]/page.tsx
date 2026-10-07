import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailActions from "@/components/products/ProductDetailActions";
import ProductCard from "@/components/products/ProductCard";
import { ShieldCheck, Truck, Sparkles, Star, ChevronRight } from "lucide-react";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

const fallbackCatalog: Record<string, any> = {
  "mango-pickle": {
    id: "prod-mango-pickle",
    name: "Mango Pickle",
    malayalamName: "മാങ്ങ അച്ചാർ",
    culturalTag: "നാടൻ രുചി",
    slug: "mango-pickle",
    sku: "ZP-MNG-350",
    weight: "350g",
    price: 199,
    originalPrice: 249,
    image: "/images/products/mango-pickle.jpg",
    ingredients: "Raw Mangoes, Mustard Oil, Red Chilli Powder, Fenugreek, Mustard Seeds, Salt, Turmeric, Asafoetida",
    shortDescription: "Amma's classic blend of raw green mangoes, roasted fenugreek, and mustard oil. Tangy, spicy, truly nostalgic.",
    fullDescription: "Prepared using traditional Kerala methods, sliced raw mangoes are marinated with salt and cured in ceramic Bharani jars before being seasoned with aromatic spices roasted to perfection in pure cold-pressed gingelly oil.",
    stock: 150,
    category: { name: "Mango Pickles", slug: "mango-pickles" },
    reviews: [
      {
        id: "r1",
        userName: "Reshma Nair",
        rating: 5,
        comment: "നാട്ടിലെ അമ്മ ഉണ്ടാക്കുന്ന അതേ തനത് രുചി! Reminds me of home in Kerala.",
        isVerifiedPurchase: true,
      },
    ],
  },
  "garlic-pickle": {
    id: "prod-garlic-pickle",
    name: "Garlic Pickle",
    malayalamName: "വെളുത്തുള്ളി അച്ചാർ",
    culturalTag: "തനിനാടൻ രുചി",
    slug: "garlic-pickle",
    sku: "ZP-GRL-350",
    weight: "350g",
    price: 229,
    originalPrice: 279,
    image: "/images/products/garlic-pickle.jpg",
    ingredients: "Fresh Garlic Cloves, Cold-Pressed Mustard Oil, Crushed Red Chillies, Curry Leaves, Mustard Seeds, Spices",
    shortDescription: "Plump garlic cloves sautéed in cold-pressed oil and Amma's hand-crushed spices. Bold and aromatic.",
    fullDescription: "Whole garlic pods slow-cooked to a tender, mellow perfection, infused with hand-crushed roasted spices and tangy Kerala tamarind notes.",
    stock: 120,
    category: { name: "Specialty Pickles", slug: "specialty-pickles" },
    reviews: [
      {
        id: "r2",
        userName: "Rahul Varma",
        rating: 5,
        comment: "Best Garlic Pickle ever! Perfect spice level and zero artificial taste.",
        isVerifiedPurchase: true,
      },
    ],
  },
  "mixed-veg-pickle": {
    id: "prod-mixed-veg-pickle",
    name: "Mixed Veg Pickle",
    malayalamName: "മിക്സഡ് വെജിറ്റബിൾ അച്ചാർ",
    culturalTag: "മലബാറിന്റെ രുചി",
    slug: "mixed-veg-pickle",
    sku: "ZP-MIX-400",
    weight: "400g",
    price: 189,
    originalPrice: 239,
    image: "/images/products/mixed-veg-pickle.jpg",
    ingredients: "Carrots, Cauliflower, Lime, Green Chillies, Raw Mango, Cold-Pressed Gingelly Oil, Fenugreek, Spices",
    shortDescription: "Wholesome Kerala Sadya style mix of seasonal veggies and aromatic spices. Pure homestyle flavor.",
    fullDescription: "A crunchy, tangy celebration of garden-fresh vegetables cured together in harmonious harmony with Amma's secret roasted spice blend.",
    stock: 100,
    category: { name: "Vegetable Pickles", slug: "vegetable-pickles" },
    reviews: [
      {
        id: "r3",
        userName: "Ananya Pillai",
        rating: 5,
        comment: "Crisp vegetables and authentic homestyle flavor. Perfect with curd rice!",
        isVerifiedPurchase: true,
      },
    ],
  },
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params;

  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: {
          id: { not: product.id },
          isPublished: true,
        },
        take: 3,
      });
    }
  } catch (error) {
    console.error("Database query failed in /products/[slug]:", error);
  }

  // Resilient fallback to catalog if database has no record or is initializing
  if (!product && fallbackCatalog[slug]) {
    product = fallbackCatalog[slug];
    relatedProducts = Object.values(fallbackCatalog).filter((p) => p.slug !== slug);
  }

  if (!product) {
    notFound();
  }

  const ingredientsList = product.ingredients
    ? product.ingredients.split(",").map((i: string) => i.trim())
    : [];

  return (
    <div className="py-10 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#68786B]">
          <Link href="/" className="hover:text-[#174E37]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-[#174E37]">Pickles</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#163D2D] font-semibold">{product.name}</span>
        </nav>

        {/* Product Showcase Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Product Image */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#E9E2CE] shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 600px"
              />

              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 bg-[#F5B82E] text-[#063D29] text-xs font-black uppercase rounded-full shadow flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#063D29]" />
                  <span>{product.culturalTag || "നാടൻ രുചി"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
                {product.category?.name || "Traditional Pickles"}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#163D2D] mt-1">
                {product.name}
              </h1>
              {product.malayalamName && (
                <p className="text-lg font-bold text-[#174E37] mt-0.5">
                  {product.malayalamName}
                </p>
              )}
              <p className="text-xs text-[#68786B] mt-1 font-mono">
                SKU: {product.sku} • Net Wt: {product.weight}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif font-black text-3xl sm:text-4xl text-[#163D2D]">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-[#68786B] line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Save ₹{product.originalPrice - product.price} (
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}
                    % OFF)
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3 text-sm sm:text-base text-[#68786B] leading-relaxed">
              <p className="font-medium text-[#163D2D]">{product.shortDescription}</p>
              <p>{product.fullDescription}</p>
            </div>

            {/* Interactive Quantity & Add to Cart */}
            <ProductDetailActions
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                weight: product.weight,
                stock: product.stock,
              }}
            />

            {/* Key Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E9E2CE]">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-[#E9E2CE]">
                <Truck className="w-5 h-5 text-[#174E37] flex-shrink-0" />
                <span className="text-xs font-medium text-[#163D2D]">
                  Fast Dispatch in 24h
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-[#E9E2CE]">
                <ShieldCheck className="w-5 h-5 text-[#174E37] flex-shrink-0" />
                <span className="text-xs font-medium text-[#163D2D]">
                  100% Preservative Free
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-[#E9E2CE]">
                <Sparkles className="w-5 h-5 text-[#F5B82E] flex-shrink-0" />
                <span className="text-xs font-medium text-[#163D2D]">
                  Bharani Cured
                </span>
              </div>
            </div>

            {/* Ingredients List */}
            {ingredientsList.length > 0 && (
              <div className="pt-6 border-t border-[#E9E2CE] space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#163D2D]">
                  Key Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ingredientsList.map((ing: string) => (
                    <span
                      key={ing}
                      className="px-3 py-1 bg-[#EFF1DC] text-[#174E37] text-xs font-semibold rounded-full border border-[#E9E2CE]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Customer Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="pt-12 border-t border-[#E9E2CE] space-y-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#163D2D]">
              Customer Reviews ({product.reviews.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((rev: any) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 rounded-2xl border border-[#E9E2CE] shadow-sm space-y-3"
                >
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F5B82E] text-[#F5B82E]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#163D2D] italic">“{rev.comment}”</p>
                  <div className="pt-2 border-t border-[#E9E2CE]/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#163D2D]">{rev.userName}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Verified Buyer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[#E9E2CE] space-y-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#163D2D]">
              You May Also Savor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  malayalamName={p.malayalamName}
                  culturalTag={p.culturalTag}
                  slug={p.slug}
                  shortDescription={p.shortDescription}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  image={p.image}
                  weight={p.weight}
                  stock={p.stock}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
