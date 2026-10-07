import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

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
          
          {/* Left: Kerala Muslim Mother in Traditional Kitchen */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-[#FFF9EC]">
              <Image
                src="/images/story/kerala-mother-story.jpg"
                alt="Warm Kerala Muslim mother preparing authentic homemade mango pickle in a traditional Malabar courtyard kitchen"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
              />
            </div>

            {/* Subtle handwritten-style Malayalam badge overlay */}
            <div className="absolute -bottom-5 -right-2 sm:bottom-4 sm:-right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-[#E9E2CE] transform rotate-2">
              <p className="font-serif italic text-base sm:text-lg text-[#174E37] font-bold flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-[#174E37] text-[#174E37]" />
                <span>“വീട്ടിലെ രുചി”</span>
              </p>
              <p className="text-[10px] text-[#68786B] uppercase tracking-widest font-semibold mt-0.5">
                Authentic Malabar & Kerala Family Recipe
              </p>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#174E37]">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B82E]" />
              <span>OUR STORY • അമ്മയുടെ കൈപ്പുണ്യം</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#163D2D] leading-tight">
              From Our Kitchen <br />
              <span className="italic text-[#174E37]">to Your Table</span>
            </h2>

            <div className="inline-block px-3.5 py-1 bg-[#EFF1DC] text-[#174E37] rounded-full text-xs font-bold border border-[#E9E2CE]">
              നാടിന്റെ രുചി, വീട്ടിലെ സ്നേഹം
            </div>

            <p className="text-base sm:text-lg text-[#68786B] leading-relaxed">
              At Zezty Pickles, every jar begins with a memory.
            </p>

            <p className="text-base text-[#68786B] leading-relaxed">
              Inspired by the traditional kitchens of Kerala and the rich food culture of Malabar, our pickles are made with carefully selected ingredients, time-honoured recipes and the warmth of homemade cooking.
            </p>

            <p className="text-sm sm:text-base text-[#163D2D] font-medium leading-relaxed bg-[#EFF1DC]/70 p-4 rounded-2xl border border-[#E9E2CE]">
              From the tang of raw mangoes to the aroma of mustard seeds, curry leaves and traditional spices, every jar carries a little piece of home to your table.
            </p>

            <div className="pt-2">
              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm shadow-md hover:bg-[#0B4A32] active:scale-95 transition-all group"
              >
                <span>Learn Our Story →</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

