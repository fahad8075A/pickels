"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface HeroSectionProps {
  content?: {
    eyebrow?: string;
    heading?: string;
    malayalamText?: string;
    description?: string;
    primaryBtnText?: string;
    primaryBtnLink?: string;
    secondaryBtnText?: string;
    secondaryBtnLink?: string;
    heroImage?: string;
    badgeText?: string;
  };
}

export default function HeroSection({ content }: HeroSectionProps) {
  const eyebrow = content?.eyebrow || "തനത് കേരള അച്ചാറുകൾ • AMMA'S TRADITIONAL KERALA PICKLES";
  const heading = content?.heading || "A Little Tang, A Lot of Tradition.";
  const malayalamText = content?.malayalamText || "അമ്മയുടെ സ്നേഹവും കൈപ്പുണ്യവും നിറഞ്ഞ തനത് നാടൻ രുചി.";
  const description =
    content?.description ||
    "Handcrafted Kerala pickles prepared with Amma's traditional recipes, garden-fresh ingredients, and the warmth of a Kerala home kitchen.";
  const primaryBtnText = content?.primaryBtnText || "Shop Amma's Pickles";
  const primaryBtnLink = content?.primaryBtnLink || "/products";
  const secondaryBtnText = content?.secondaryBtnText || "Amma's Story • അമ്മയുടെ കഥ";
  const secondaryBtnLink = content?.secondaryBtnLink || "/our-story";
  const heroImage = content?.heroImage || "/images/banners/hero-pickles.jpg";
  const badgeText = content?.badgeText || "അമ്മയുടെ കൈപ്പുണ്യം";

  return (
    <section className="relative overflow-hidden bg-[#FFF9EC] py-12 md:py-20 lg:py-24 border-b border-[#E9E2CE]">
      {/* Decorative leaf watermarks in corners */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="#174E37">
          <path d="M40,160 C80,120 120,80 180,20 C180,80 140,140 40,160 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content (7 columns on large desktop) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF1DC] text-[#174E37] text-xs font-bold tracking-wider border border-[#E9E2CE]">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B82E]" />
              <span>{eyebrow}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#163D2D] tracking-tight leading-[1.15]">
              {heading}
            </h1>

            <p className="text-base sm:text-lg text-[#68786B] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {description} <span className="font-semibold text-[#174E37] block sm:inline mt-1 sm:mt-0">{malayalamText}</span>
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href={primaryBtnLink}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-base shadow-lg hover:bg-[#0B4A32] active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={secondaryBtnLink}
                className="w-full sm:w-auto px-8 py-3.5 border-2 border-[#174E37] text-[#174E37] rounded-full font-semibold text-base hover:bg-[#EFF1DC]/60 active:scale-95 transition-all text-center"
              >
                {secondaryBtnText}
              </Link>
            </div>

            {/* Micro Highlights with Malayalam */}
            <div className="pt-6 border-t border-[#E9E2CE]/70 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <p className="font-serif font-bold text-xl text-[#163D2D]">100%</p>
                <p className="text-xs text-[#68786B]">നാടൻ രുചി (Nadan Taste)</p>
              </div>
              <div>
                <p className="font-serif font-bold text-xl text-[#163D2D]">Bharani</p>
                <p className="text-xs text-[#68786B]">ഭരണിയിൽ പാകപ്പെടുത്തിയത്</p>
              </div>
              <div>
                <p className="font-serif font-bold text-xl text-[#163D2D]">Zero</p>
                <p className="text-xs text-[#68786B]">മായമില്ലാത്തത് (Pure & Pure)</p>
              </div>
            </div>
          </div>

          {/* Right Image Composition (5 columns on large desktop) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Circular badge celebrating Amma's Kaipunyam */}
            <div className="absolute -top-4 -left-4 sm:top-2 sm:left-2 z-20 bg-[#F5B82E] text-[#063D29] w-28 h-28 rounded-full p-2 flex flex-col items-center justify-center text-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform border-2 border-white">
              <ShieldCheck className="w-5 h-5 mb-0.5 text-[#063D29]" />
              <span className="text-[11px] font-black leading-tight">
                {badgeText}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-tighter text-[#174E37]">
                Amma&apos;s Touch
              </span>
            </div>

            {/* Main composition image card */}
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-[#F8F1DF]">
              <Image
                src={heroImage}
                alt="Zezty Pickles Mango Pickle Composition with fresh mangoes and spices"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
