import React from "react";
import HeroSection from "@/components/home/HeroSection";
import BenefitsStrip from "@/components/home/BenefitsStrip";
import BestsellersSection from "@/components/home/BestsellersSection";
import StorySection from "@/components/home/StorySection";
import IngredientsSection from "@/components/home/IngredientsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PromoBanner from "@/components/home/PromoBanner";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let products: any[] = [];
  let heroContent: any = null;

  try {
    const [dbProducts, dbHero] = await Promise.all([
      prisma.product.findMany({
        where: { isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.heroContent.findFirst({ where: { id: "default" } }),
    ]);

    products = dbProducts;
    heroContent = dbHero;
  } catch (error) {
    console.error("Failed to load products/CMS from database:", error);
  }

  // Graceful fallback with Kerala Amma's touch
  const defaultProducts = [
    {
      id: "9a0d2700-5f7f-4475-95a8-6e64022a68d8",
      name: "Mango Pickle",
      malayalamName: "മാങ്ങ അച്ചാർ",
      culturalTag: "നാടൻ രുചി",
      slug: "mango-pickle",
      shortDescription:
        "A classic blend of raw green mangoes, roasted fenugreek, and cold-pressed gingelly oil. Tangy, spicy, truly nostalgic.",
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
        "Plump whole garlic cloves slow-sautéed in cold-pressed oil and Amma's hand-crushed roasted spices. Bold and aromatic.",
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
        "Wholesome Kerala Sadya style mix of crisp carrots, lime, cauliflower, and green chillies in aromatic spices.",
      price: 189,
      originalPrice: 239,
      image: "/images/products/mixed-veg-pickle.jpg",
      weight: "400g",
      stock: 100,
    },
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div className="flex flex-col">
      <HeroSection content={heroContent} />
      <BenefitsStrip />
      <BestsellersSection products={displayProducts} />
      <StorySection />
      <IngredientsSection />
      <TestimonialsSection />
      <PromoBanner />
    </div>
  );
}
