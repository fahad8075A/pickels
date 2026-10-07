import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Reshma Nair",
      location: "Kochi, Kerala",
      avatar: "/images/testimonials/priya-sharma.jpg",
      rating: 5,
      review: "നാട്ടിലെ അമ്മ ഉണ്ടാക്കുന്ന അതേ തനത് രുചി! The mango pickle is so authentic, full of flavor and reminds me of Onam Sadya back home.",
    },
    {
      name: "Rahul Varma",
      location: "Thrissur / Bengaluru",
      avatar: "/images/testimonials/rahul-verma.jpg",
      rating: 5,
      review: "Best Garlic Pickle I've ever had! Just like what Amma used to age in ceramic Bharani jars. Outstanding quality and zero artificial taste.",
    },
    {
      name: "Ananya Pillai",
      location: "Kozhikode, Kerala",
      avatar: "/images/testimonials/ananya-patel.jpg",
      rating: 5,
      review: "അമ്മയുടെ കൈപ്പുണ്യം ശരിക്കും അറിയാം! Fresh, spicy and pure. It is now a permanent favorite with our daily rice and curd.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F8F1DF] border-b border-[#E9E2CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#174E37] block mb-2">
              HAPPY CUSTOMERS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#163D2D]">
              Real People. Real Love.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#174E37] hover:text-[#0B4A32] mt-4 md:mt-0 group"
          >
            <span>View More Reviews</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Testimonials 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-3xl p-8 border border-[#E9E2CE] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
            >
              <div className="space-y-4">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-[#F5B82E]/40" />

                {/* Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#F5B82E] text-[#F5B82E]"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-[#163D2D] text-sm sm:text-base leading-relaxed italic">
                  “{t.review}”
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-3.5 pt-6 mt-6 border-t border-[#E9E2CE]/70">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E9E2CE] flex-shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#163D2D]">
                    {t.name}
                  </h4>
                  <p className="text-xs text-[#68786B]">{t.location} • Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
