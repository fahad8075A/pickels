import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Award, Shield, Sun } from "lucide-react";

export default function OurStoryPage() {
  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            അമ്മയുടെ കഥ • KERALA HERITAGE & TRADITION
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#163D2D]">
            From Amma&apos;s Kitchen to Your Table
          </h1>
          <p className="text-lg font-serif italic text-[#174E37]">
            “അമ്മയുടെ സ്നേഹവും കൈപ്പുണ്യവും ഓരോ കുപ്പിയിലും”
          </p>
          <p className="text-base sm:text-lg text-[#68786B] leading-relaxed">
            At Zezty Pickles, we celebrate the warmth, aroma, and cherished memories of Kerala home kitchens. Every jar is slow-cured in traditional Bharani jars and handcrafted with Amma&apos;s time-honored recipes.
          </p>
        </div>

        {/* Story Section 1: The Origin */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <Image
                src="/images/banners/pickle-bowl-story.jpg"
                alt="Amma's pickle bowl and traditional Kerala spices"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>
          </div>
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-serif font-bold text-[#163D2D]">
              Preserving Amma&apos;s Authentic Kaipunyam (കൈപ്പുണ്യം)
            </h2>
            <p className="text-sm sm:text-base text-[#68786B] leading-relaxed">
              Growing up in a traditional Kerala Tharavadu, summer mornings meant the unforgettable fragrance of fresh green Kannimanga and cut mangoes tossed with cold-pressed gingelly oil, whole mustard seeds, and freshly crushed fiery red chillies.
            </p>
            <p className="text-sm sm:text-base text-[#68786B] leading-relaxed">
              We watched Amma meticulously seal large porcelain <span className="font-semibold text-[#174E37]">ഭരണി (Bharani)</span> jars with clean white muslin cloth, placing them in the warm courtyard sun so nature could slowly work its magic. No synthetic vinegars, no chemical preservatives, no shortcuts.
            </p>
            <p className="text-sm sm:text-base text-[#163D2D] font-medium bg-[#EFF1DC] p-4 rounded-2xl border border-[#E9E2CE]">
              We started Zezty Pickles to bring that true, comforting taste of Amma&apos;s cooking into modern homes across the country.
            </p>
          </div>
        </div>

        {/* Story Section 2: Four Core Pillars */}
        <div className="bg-[#F8F1DF] p-8 sm:p-12 rounded-3xl border border-[#E9E2CE]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-serif font-black text-[#163D2D]">
              Our Guiding Principles
            </h2>
            <p className="text-sm text-[#68786B] mt-1">
              What goes into every single jar of Zezty Pickles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E9E2CE] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EFF1DC] text-[#174E37] flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#163D2D]">Sun-Cured Naturally</h3>
              <p className="text-xs text-[#68786B] leading-relaxed">
                Aged gradually under the natural Indian sun for weeks to allow flavors to penetrate deeply.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E9E2CE] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EFF1DC] text-[#174E37] flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#163D2D]">Zero Preservatives</h3>
              <p className="text-xs text-[#68786B] leading-relaxed">
                Preserved naturally using salt, turmeric, and pure cold-pressed mustard oil. No vinegar, no artificial colors.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E9E2CE] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EFF1DC] text-[#174E37] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#163D2D]">Handcrafted Batches</h3>
              <p className="text-xs text-[#68786B] leading-relaxed">
                Produced in small batches to preserve grandmother&apos;s culinary precision and balance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E9E2CE] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EFF1DC] text-[#174E37] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#163D2D]">Farm Fresh Produce</h3>
              <p className="text-xs text-[#68786B] leading-relaxed">
                Directly supporting local spice growers and seasonal mango orchards across India.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm hover:bg-[#0B4A32] shadow-xl"
          >
            <span>Explore Our Pickles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
