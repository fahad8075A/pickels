import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-16 md:py-20 bg-[#FFF9EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#063D29] text-[#FFF9EC] overflow-hidden shadow-2xl border border-[#0B4A32]">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#174E37]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 z-10 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5B82E] block">
                അമ്മയുടെ കൈപ്പുണ്യം • TASTE OF KERALA
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#FFF9EC] leading-tight">
                Bring Home Amma&apos;s <br />
                <span className="text-[#F5B82E] italic">Real Taste.</span>
              </h2>

              <p className="text-sm font-semibold text-[#F5B82E]">
                കേരളത്തിന്റെ തനത് നാടൻ അച്ചാറുകൾ നിങ്ങളുടെ വീട്ടിലെത്തിക്കൂ.
              </p>

              <p className="text-base sm:text-lg text-[#EFF1DC]/90 max-w-lg mx-auto lg:mx-0">
                Authentic. Fresh. Bharani-Aged. Zezty Pickles.
              </p>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F5B82E] text-[#063D29] rounded-full font-bold text-sm shadow-xl hover:bg-yellow-400 active:scale-95 transition-all group"
                >
                  <span>Shop Amma&apos;s Pickles • വാങ്ങൂ</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Photograph */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
                <Image
                  src="/images/banners/promo-banner.jpg"
                  alt="Zezty Pickles served with hot rotis and traditional Indian meal"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
