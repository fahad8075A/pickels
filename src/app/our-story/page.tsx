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
            OUR STORY • അമ്മയുടെ കൈപ്പുണ്യം
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#163D2D]">
            From Our Kitchen to Your Table
          </h1>
          <p className="text-lg font-serif italic text-[#174E37]">
            “നാടിന്റെ രുചി, വീട്ടിലെ സ്നേഹം • വീട്ടിലെ രുചി”
          </p>
          <p className="text-base sm:text-lg text-[#68786B] leading-relaxed">
            At Zezty Pickles, every jar begins with a memory. Inspired by the traditional kitchens of Kerala and the rich food culture of Malabar, our pickles are made with carefully selected ingredients, time-honoured recipes and the warmth of homemade cooking.
          </p>
        </div>

        {/* Story Section 1: The Malabar & Kerala Heritage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <Image
                src="/images/story/kerala-mother-story.jpg"
                alt="A warm Kerala Muslim mother preparing authentic homemade pickle with fresh mangoes and spices in a Malabar courtyard kitchen"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>
            <div className="absolute -bottom-4 -right-2 sm:bottom-4 sm:-right-4 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-[#E9E2CE]">
              <span className="font-serif italic text-sm text-[#174E37] font-bold">
                “അമ്മയുടെ സ്നേഹവും നാടൻ കൈപ്പുണ്യവും”
              </span>
            </div>
          </div>
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-serif font-bold text-[#163D2D]">
              Rooted in the Flavours of Malabar & Kerala Kitchens
            </h2>
            <p className="text-sm sm:text-base text-[#68786B] leading-relaxed">
              Growing up in Kerala, family kitchens were the heart of every home. The air was rich with the fragrance of green mangoes, roasted fenugreek, mustard crackling in cold-pressed oil, and freshly plucked curry leaves.
            </p>
            <p className="text-sm sm:text-base text-[#68786B] leading-relaxed">
              Every summer, mothers across Malabar carefully cured pickles in traditional glazed ceramic <span className="font-semibold text-[#174E37]">ഭരണി (Bharani)</span> jars, sealing them with white muslin cloth to mature naturally. Made with patience, without artificial vinegar or synthetic colors.
            </p>
            <p className="text-sm sm:text-base text-[#163D2D] font-medium bg-[#EFF1DC] p-4 rounded-2xl border border-[#E9E2CE]">
              “From the tang of raw mangoes to the aroma of mustard seeds, curry leaves and traditional spices, every jar carries a little piece of home to your table.”
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
