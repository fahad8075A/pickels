import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  weight: string;
  weightVariants?: string | null;
  stock: number;
}

interface BestsellersSectionProps {
  products: ProductItem[];
}

export default function BestsellersSection({ products }: BestsellersSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-[#FFF9EC] border-b border-[#E9E2CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#174E37] block mb-2">
              തനത് നാടൻ അച്ചാറുകൾ • OUR BESTSELLERS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#163D2D]">
              Signature Pickles, Crafted with Care
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#174E37] hover:text-[#0B4A32] mt-4 md:mt-0 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              shortDescription={product.shortDescription}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              weight={product.weight}
              weightVariants={product.weightVariants}
              stock={product.stock}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
