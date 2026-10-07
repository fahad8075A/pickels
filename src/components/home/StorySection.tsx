import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function StorySection() {
  return (
    <section className="py-20 md:py-28 bg-[#F8F1DF] border-b border-[#E9E2CE] relative overflow-hidden">
      {/* Decorative botanical accents */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#174E37">
          <circle cx="20" cy="20" r="15" />
          <path d="M10,20 Q50,0 90,40" stroke="#174E37" strokeWidth="4" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Pickle Bowl Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-[#FFF9EC]">
              <Image
                src="/images/banners/pickle-bowl-story.jpg"
                alt="Traditional Indian pickle served in an earthen clay bowl"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>

            {/* Handwritten-style badge overlay celebrating Amma's Kaipunyam */}
            <div className="absolute -bottom-5 -right-2 sm:bottom-4 sm:-right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-[#E9E2CE] transform rotate-2">
              <p className="font-serif italic text-base sm:text-lg text-[#174E37] font-bold">
                “അമ്മയുടെ കൈപ്പുണ്യം • Amma&apos;s Touch”
              </p>
              <p className="text-[10px] text-[#68786B] uppercase tracking-widest font-semibold mt-0.5">
                Authentic Kerala Bharani Recipe
              </p>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#174E37]">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B82E]" />
              <span>അമ്മയുടെ കഥ • OUR KERALA HERITAGE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#163D2D] leading-tight">
              From Amma&apos;s Kitchen in Kerala <br />
              <span className="italic text-[#174E37]">to Your Table</span>
            </h2>

            <p className="text-base sm:text-lg text-[#68786B] leading-relaxed">
              At Zezty Pickles, our story begins in a traditional courtyard kitchen in Kerala, watching Amma tenderly slice raw green mangoes, marinating them with fragrant curry leaves, roasted fenugreek, and cold-pressed gingelly oil in ceramic <span className="font-semibold text-[#174E37]">ഭരണി (Bharani)</span> jars.
            </p>

            <p className="text-sm sm:text-base text-[#163D2D] font-medium leading-relaxed bg-[#EFF1DC]/70 p-4 rounded-2xl border border-[#E9E2CE]">
              “അമ്മയുടെ സ്നേഹവും തനത് കൈപ്പുണ്യവുമാണ് ഞങ്ങളുടെ ഓരോ അച്ചാർ കുപ്പിയിലുമുള്ളത്.” Every jar brings the authentic, comforting taste of mother&apos;s food back to your meals.
            </p>

            <div className="pt-2">
              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm shadow-md hover:bg-[#0B4A32] active:scale-95 transition-all group"
              >
                <span>Read Amma&apos;s Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
