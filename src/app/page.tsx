import React from "react";
import HeroSection from "@/components/home/HeroSection";
import BenefitsStrip from "@/components/home/BenefitsStrip";
import BestsellersSection from "@/components/home/BestsellersSection";
import StorySection from "@/components/home/StorySection";
import IngredientsSection from "@/components/home/IngredientsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PromoBanner from "@/components/home/PromoBanner";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { price: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to load products from database:", error);
  }

  // Graceful fallback with Kerala Amma's touch
  const defaultProducts = [
    {
      id: "prod-mango-pickle",
      name: "Kerala Mango Pickle • മാങ്ങാ അച്ചാർ",
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
      id: "prod-garlic-pickle",
      name: "Garlic Pickle • വെളുത്തുള്ളി അച്ചാർ",
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
      id: "prod-mixed-veg-pickle",
      name: "Nadan Veg Pickle • പച്ചക്കറി അച്ചാർ",
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

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div className="flex flex-col">
      <HeroSection />
      <BenefitsStrip />
      <BestsellersSection products={displayProducts} />
      <StorySection />
      <IngredientsSection />
      <TestimonialsSection />
      <PromoBanner />
    </div>
  );
}
