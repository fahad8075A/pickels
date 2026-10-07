import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            FULFILLMENT & LOGISTICS
          </span>
          <h1 className="text-4xl font-serif font-black text-[#163D2D] mt-1">
            Shipping Policy
          </h1>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-6 text-[#163D2D] text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">1. Processing Time</h2>
            <p className="text-[#68786B]">
              Every order is prepared with care. Standard dispatch time is 24 to 48 working hours from our artisanal kitchen facility in Gurugram, India. Orders placed on Sundays or national holidays are dispatched on the next working day.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">2. Shipping Charges</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#68786B]">
              <li><strong>Orders of ₹499 and above:</strong> FREE Express Delivery anywhere in India.</li>
              <li><strong>Orders under ₹499:</strong> A nominal flat delivery fee of ₹50 applies.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">3. Estimated Delivery Timelines</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#68786B]">
              <li><strong>Delhi NCR:</strong> 1–2 business days.</li>
              <li><strong>Metro Cities (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad):</strong> 2–4 business days.</li>
              <li><strong>Rest of India:</strong> 3–6 business days.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">4. Packaging & Glass Jar Protection</h2>
            <p className="text-[#68786B]">
              Our glass jars are secured in multi-layered biodegradable corrugated transit cartons tested for shock resistance to prevent any transit leakage or breakage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
