import React from "react";
import { BookOpen, Leaf, Flame, HeartHandshake } from "lucide-react";

export default function BenefitsStrip() {
  const benefits = [
    {
      title: "Traditional Recipes",
      subtitle: "നാടൻ രുചി",
      icon: BookOpen,
    },
    {
      title: "Fresh Ingredients",
      subtitle: "പുതിയ ചേരുവകൾ",
      icon: Leaf,
    },
    {
      title: "Small Batch",
      subtitle: "ചെറിയ ബാച്ചുകളിൽ",
      icon: Flame,
    },
    {
      title: "Packed with Love",
      subtitle: "സ്നേഹത്തോടെ പായ്ക്ക് ചെയ്തത്",
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
                  <p className="text-xs font-semibold text-[#174E37] mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
