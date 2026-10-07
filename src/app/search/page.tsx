import React from "react";
import ProductCard from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || "";

  let products: any[] = [];
  if (query) {
    products = await prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: query } },
          { shortDescription: { contains: query } },
          { fullDescription: { contains: query } },
          { ingredients: { contains: query } },
        ],
      },
      include: { category: true },
    });
  }

  return (
    <div className="py-12 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            CATALOG SEARCH
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#163D2D]">
            Search Results {query && `for “${query}”`}
          </h1>

          {/* Search Box */}
          <form method="GET" action="/search" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#68786B] absolute left-4 top-3.5" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search pickles, mango, garlic..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E9E2CE] rounded-full text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#174E37] text-[#FFF9EC] rounded-full text-sm font-semibold hover:bg-[#0B4A32]"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {query && products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E9E2CE] p-8 max-w-lg mx-auto space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#163D2D]">No matching pickles found</h3>
            <p className="text-xs text-[#68786B]">
              We couldn&apos;t find any pickles matching &quot;{query}&quot;. Try searching for &quot;mango&quot;, &quot;garlic&quot;, or &quot;veg&quot;.
            </p>
            <Link
              href="/products"
              className="inline-block mt-2 px-6 py-2 bg-[#174E37] text-[#FFF9EC] rounded-full text-xs font-semibold"
            >
              Browse All Pickles
            </Link>
          </div>
        ) : (
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
                stock={product.stock}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
