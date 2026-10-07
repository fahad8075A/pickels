import React from "react";
import ProductCard from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort } = searchParams;

  let whereClause: any = { isPublished: true };
  if (category) {
    whereClause.category = { slug: category };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      orderBy,
      include: { category: true },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="py-12 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            OUR COMPLETE COLLECTION
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-[#163D2D]">
            Authentic Indian Pickles
          </h1>
          <p className="text-sm sm:text-base text-[#68786B]">
            Sun-cured in small batches using pure cold-pressed mustard oil and hand-ground spices.
          </p>
        </div>

        {/* Filter & Sorting Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white/80 rounded-2xl border border-[#E9E2CE] mb-10 shadow-sm">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                !category
                  ? "bg-[#174E37] text-[#FFF9EC]"
                  : "bg-[#EFF1DC] text-[#163D2D] hover:bg-[#E9E2CE]"
              }`}
            >
              All Pickles
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  category === cat.slug
                    ? "bg-[#174E37] text-[#FFF9EC]"
                    : "bg-[#EFF1DC] text-[#163D2D] hover:bg-[#E9E2CE]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-[#68786B]" />
            <form method="GET" action="/products" className="flex items-center">
              {category && <input type="hidden" name="category" value={category} />}
              <select
                name="sort"
                defaultValue={sort || "newest"}
                // @ts-ignore
                onChange="this.form.submit()"
                className="bg-[#FFF9EC] border border-[#E9E2CE] text-xs font-semibold text-[#163D2D] rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#174E37]"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E9E2CE] p-8">
            <h3 className="font-serif font-bold text-xl text-[#163D2D]">No products found</h3>
            <p className="text-sm text-[#68786B] mt-1">Try selecting another category or check back soon!</p>
            <Link
              href="/products"
              className="inline-block mt-4 px-6 py-2.5 bg-[#174E37] text-[#FFF9EC] rounded-full text-sm font-semibold"
            >
              View All Pickles
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
