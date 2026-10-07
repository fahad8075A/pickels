import React from "react";
import { BookOpen, Leaf, Flame, HeartHandshake } from "lucide-react";

export default function BenefitsStrip() {
  const benefits = [
    {
      title: "Traditional Recipes",
      subtitle: "അമ്മയുടെ കൈപ്പുണ്യം (Amma's Recipes)",
      icon: BookOpen,
    },
    {
      title: "Fresh Nadan Produce",
      subtitle: "നാടൻ ചേരുവകൾ (Backyard Fresh)",
      icon: Leaf,
    },
    {
      title: "Cured in Bharani",
      subtitle: "ഭരണിയിൽ മൂപ്പിച്ചത് (Ceramic Aged)",
      icon: Flame,
    },
    {
      title: "Packed with Amma's Love",
      subtitle: "അമ്മയുടെ സ്നേഹത്തോടെ (Homestyle Care)",
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="bg-[#EFF1DC] border-b border-[#E9E2CE] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#E9E2CE]/80">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center space-x-3.5 sm:space-x-4 ${
                  index !== 0 ? "pt-4 md:pt-0 md:pl-6" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/80 border border-[#E9E2CE] flex items-center justify-center text-[#174E37] flex-shrink-0 shadow-sm">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#163D2D]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#68786B] mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
