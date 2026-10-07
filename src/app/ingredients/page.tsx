import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function IngredientsPage() {
  const items = [
    {
      title: "Raw Ramkela Mangoes",
      subtitle: "For that perfect tangy bite",
      image: "/images/ingredients/raw-mangoes.jpg",
      description:
        "We source tart, firm green Ramkela mangoes harvested at the peak of freshness. Hand-sliced to preserve maximum crispness during the slow sun fermentation process.",
    },
    {
      title: "Desi Garlic Cloves",
      subtitle: "Rich, pungent & robust",
      image: "/images/ingredients/garlic.jpg",
      description:
        "Whole native Indian garlic cloves peeled fresh. Marinated slowly so that their fiery sharpness mellows into a rich, aromatic, garlicky richness.",
    },
    {
      title: "Sun-Dried Red Chillies",
      subtitle: "For vibrant color & authentic heat",
      image: "/images/ingredients/red-chillies.jpg",
      description:
        "A balanced blend of Kashmiri chillies for royal crimson color and Guntur chillies for the quintessential kick that authentic achar lovers crave.",
    },
    {
      title: "Yellow & Black Mustard Seeds",
      subtitle: "For nutty aroma & crackle",
      image: "/images/ingredients/mustard-seeds.jpg",
      description:
        "Coarsely hand-cracked mustard seeds (rai and sarson) that develop natural enzymes to lightly ferment the pickle and impart the famous Indian achar bite.",
    },
    {
      title: "Fresh Curry Leaves",
      subtitle: "For botanical herbal notes",
      image: "/images/ingredients/curry-leaves.jpg",
      description:
        "Handpicked fresh curry leaves gently bloomed in warm mustard oil, lending a refreshing earthy aroma and heritage South Indian touch.",
    },
    {
      title: "Traditional Spice Blend",
      subtitle: "Methi, Saunf, Kalonji & Hing",
      image: "/images/ingredients/traditional-spices.jpg",
      description:
        "Our proprietary blend of fenugreek (methi), fennel (saunf), nigella seeds (kalonji), turmeric (haldi), and pure compounded asafoetida (hing).",
    },
  ];

  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            TRANSPARENCY & PURITY
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-[#163D2D]">
            Pure Ingredients. Authentic Taste.
          </h1>
          <p className="text-base sm:text-lg text-[#68786B]">
            Every single ingredient we use is natural, responsibly sourced, and completely free from artificial preservatives, MSG, and synthetic colors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl overflow-hidden border border-[#E9E2CE] shadow-sm hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="relative aspect-video w-full bg-[#F8F1DF] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-semibold text-[#174E37] block">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#163D2D] mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#68786B] mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm hover:bg-[#0B4A32] shadow-xl"
          >
            <span>Taste the Purity in Our Jars</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
