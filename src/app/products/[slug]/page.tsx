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

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      isPublished: true,
    },
    take: 3,
  });

  const ingredientsList = product.ingredients
    ? product.ingredients.split(",").map((i) => i.trim())
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
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#174E37]">
            {product.category.name}
          </Link>
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
                <span className="px-3.5 py-1 bg-[#F5B82E] text-[#063D29] text-xs font-black uppercase rounded-full shadow">
                  Handcrafted Small Batch
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
                {product.category.name}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#163D2D] mt-1">
                {product.name}
              </h1>
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
                  Sun-Cured In Glass Jars
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
                  {ingredientsList.map((ing) => (
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
        <div className="pt-12 border-t border-[#E9E2CE] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#163D2D]">
                Customer Reviews ({product.reviews.length})
              </h2>
              <p className="text-xs text-[#68786B]">Real verified customer opinions</p>
            </div>
          </div>

          {product.reviews.length === 0 ? (
            <p className="text-sm text-[#68786B] italic">No reviews yet for this product. Be the first to try it!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 rounded-2xl border border-[#E9E2CE] shadow-sm space-y-3"
                >
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F5B82E] text-[#F5B82E]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#163D2D] italic">“{rev.comment}”</p>
                  <div className="pt-2 border-t border-[#E9E2CE]/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#163D2D]">{rev.userName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
