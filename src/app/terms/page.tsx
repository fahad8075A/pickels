import React from "react";

export default function TermsPage() {
  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            LEGAL NOTICE
          </span>
          <h1 className="text-4xl font-serif font-black text-[#163D2D] mt-1">
            Terms & Conditions
          </h1>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-6 text-[#163D2D] text-sm leading-relaxed">
          <p className="text-[#68786B]">
            Welcome to Zezty Pickles. By accessing our platform or purchasing any of our gourmet pickles, you agree to be bound by the following Terms and Conditions.
          </p>
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">Product Representation</h2>
            <p className="text-[#68786B]">
              Because our pickles are prepared in small artisanal batches with natural produce and seasonal spices, subtle variations in texture, color, and tanginess may naturally occur across harvests.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">Pricing & Taxes</h2>
            <p className="text-[#68786B]">
              All listed product prices on Zezty Pickles are expressed in Indian Rupees (INR) and are inclusive of all applicable Goods and Services Tax (GST).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
