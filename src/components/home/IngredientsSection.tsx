import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function IngredientsSection() {
  const ingredients = [
    {
      name: "Raw Mangoes",
      malayalamName: "മാങ്ങ",
      description: "For that authentic Kerala tang.",
      image: "/images/ingredients/raw-mangoes.jpg",
    },
    {
      name: "Garlic",
      malayalamName: "വെളുത്തുള്ളി",
      description: "Slow-roasted & rich in flavor.",
      image: "/images/ingredients/garlic.jpg",
    },
    {
      name: "Red Chillies",
      malayalamName: "ചുവന്ന മുളക്",
      description: "Crushed for perfect Kerala heat.",
      image: "/images/ingredients/red-chillies.jpg",
    },
    {
      name: "Mustard Seeds",
      malayalamName: "കടുക്",
      description: "Cracked for traditional crunch.",
      image: "/images/ingredients/mustard-seeds.jpg",
    },
    {
      name: "Curry Leaves",
      malayalamName: "കറിവേപ്പില",
      description: "Fresh aromatic backyard aroma.",
      image: "/images/ingredients/curry-leaves.jpg",
    },
    {
      name: "Traditional Spices",
      malayalamName: "പരമ്പരാഗത മസാലകൾ",
      description: "Amma's secret roasted spice blend.",
      image: "/images/ingredients/traditional-spices.jpg",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FFF9EC] border-b border-[#E9E2CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF1DC] text-[#174E37] rounded-full text-xs font-bold border border-[#E9E2CE]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B82E]" />
            <span>തനിനാടൻ ചേരുവകൾ • PURE INGREDIENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#163D2D]">
            Pure Ingredients. Authentic Taste.
          </h2>
          <p className="text-base text-[#68786B] leading-relaxed">
            We use only the finest natural produce from Kerala to bring you pickles that are wholesome, flavorful, and true to Amma&apos;s kitchen.
          </p>
        </div>

        {/* 6 Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {ingredients.map((item) => (
            <Link
              key={item.name}
              href="/ingredients"
              className="group bg-white rounded-2xl p-4 border border-[#E9E2CE] hover:border-[#174E37]/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 border-2 border-[#E9E2CE] group-hover:border-[#174E37] transition-colors">
                <Image
                  src={item.image}
                  alt={`${item.name} - ${item.malayalamName}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 140px, 160px"
                />
              </div>

              <h3 className="font-serif font-bold text-base text-[#163D2D] group-hover:text-[#174E37] transition-colors">
                {item.name}
              </h3>
              <p className="text-xs font-semibold text-[#174E37] mt-0.5">
                {item.malayalamName}
              </p>
              <p className="text-xs text-[#68786B] mt-1">
                {item.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
