import React from "react";
import ProductCard from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SlidersHorizontal, Sparkles } from "lucide-react";

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

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [dbProducts, dbCategories] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy,
        include: { category: true },
      }),
      prisma.category.findMany(),
    ]);
    products = dbProducts;
    categories = dbCategories;
  } catch (error) {
    console.error("Database query failed in /products, using fallback catalog:", error);
  }

  // Resilient fallback products for deployed environments
  const fallbackProducts = [
    {
      id: "9a0d2700-5f7f-4475-95a8-6e64022a68d8",
      name: "Mango Pickle",
      malayalamName: "മാങ്ങ അച്ചാർ",
      culturalTag: "നാടൻ രുചി",
      slug: "mango-pickle",
      shortDescription:
        "Amma's classic blend of raw green mangoes, roasted fenugreek, and mustard oil. Tangy, spicy, truly nostalgic.",
      price: 199,
      originalPrice: 249,
      image: "/images/products/mango-pickle.jpg",
      weight: "350g",
      stock: 150,
    },
    {
      id: "c08cf40d-540b-42ce-9535-1aa0238ae270",
      name: "Garlic Pickle",
      malayalamName: "വെളുത്തുള്ളി അച്ചാർ",
      culturalTag: "തനിനാടൻ രുചി",
      slug: "garlic-pickle",
      shortDescription:
        "Plump garlic cloves sautéed in cold-pressed oil and Amma's hand-crushed spices. Bold and aromatic.",
      price: 229,
      originalPrice: 279,
      image: "/images/products/garlic-pickle.jpg",
      weight: "350g",
      stock: 120,
    },
    {
      id: "0585636a-cb1c-4908-9570-4ecaecf17501",
      name: "Mixed Veg Pickle",
      malayalamName: "മിക്സഡ് വെജിറ്റബിൾ അച്ചാർ",
      culturalTag: "മലബാറിന്റെ രുചി",
      slug: "mixed-veg-pickle",
      shortDescription:
        "Wholesome Kerala Sadya style mix of seasonal veggies and aromatic spices. Pure homestyle flavor.",
      price: 189,
      originalPrice: 239,
      image: "/images/products/mixed-veg-pickle.jpg",
      weight: "400g",
      stock: 100,
    },
  ];

  const displayProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <div className="py-12 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF1DC] text-[#174E37] rounded-full text-xs font-bold border border-[#E9E2CE]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B82E]" />
            <span>തനത് കേരള അച്ചാറുകൾ • AMMA&apos;S PICKLE COLLECTION</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-[#163D2D]">
            Authentic Kerala Pickles
          </h1>
          <p className="text-sm sm:text-base text-[#68786B]">
            Handcrafted with Amma&apos;s heritage recipes, sun-cured in ceramic Bharani jars using pure cold-pressed gingelly oil and aromatic spices.
          </p>
        </div>

        {/* Filter Bar */}
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

          {/* Sort Selector with Link Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-[#68786B]" />
            <div className="flex gap-1.5 text-xs">
              <Link
                href={`/products${category ? `?category=${category}&sort=price-asc` : "?sort=price-asc"}`}
                className={`px-3 py-1.5 rounded-full border border-[#E9E2CE] font-semibold ${
                  sort === "price-asc" ? "bg-[#174E37] text-white" : "bg-[#FFF9EC] text-[#163D2D]"
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href={`/products${category ? `?category=${category}&sort=price-desc` : "?sort=price-desc"}`}
                className={`px-3 py-1.5 rounded-full border border-[#E9E2CE] font-semibold ${
                  sort === "price-desc" ? "bg-[#174E37] text-white" : "bg-[#FFF9EC] text-[#163D2D]"
                }`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              malayalamName={product.malayalamName}
              culturalTag={product.culturalTag}
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

      </div>
    </div>
  );
}
