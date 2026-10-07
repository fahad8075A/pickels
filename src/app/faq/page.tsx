import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "Are Zezty Pickles made with artificial preservatives or synthetic vinegar?",
      a: "Never! All our pickles are 100% natural. They are naturally preserved using salt, turmeric, and pure cold-pressed mustard oil. We never add synthetic chemical preservatives, artificial food coloring, or vinegar.",
    },
    {
      q: "What is the shelf life of Zezty Pickles?",
      a: "Our pickles have a natural shelf life of 12 months from the packaging date when stored in a cool, dry place. Always use a clean, dry spoon to maintain purity and longevity.",
    },
    {
      q: "How does your delivery work?",
      a: "We ship nationwide across India within 24–48 hours of your order. Delivery typically takes 2–4 business days in major metros and 3–6 business days in other regions. Shipping is completely FREE on all orders of ₹499 or more.",
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes! We offer Cash on Delivery across supported Indian postal PIN codes, as well as instant online payment via Razorpay, UPI, cards, and net banking.",
    },
    {
      q: "Can I cancel or modify my order?",
      a: "You can request order modifications or cancellations before the package is dispatched by contacting our customer care via WhatsApp or email at orders@zeztypickles.com.",
    },
    {
      q: "What should I do if a jar arrives damaged?",
      a: "We pack our glass jars in heavy-duty protective cushioned transit cartons. In the rare event of transit damage, simply send us a photo of the package within 48 hours of delivery and we will dispatch a free immediate replacement jar or issue a 100% refund.",
    },
  ];

  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h1 className="text-4xl font-serif font-black text-[#163D2D]">
            Got Questions? We Have Answers.
          </h1>
          <p className="text-sm text-[#68786B]">
            Everything you need to know about our handcrafted pickles, ingredients, and delivery.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E2CE] shadow-sm space-y-2"
            >
              <h3 className="font-serif font-bold text-lg text-[#163D2D] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#174E37] flex-shrink-0" />
                <span>{item.q}</span>
              </h3>
              <p className="text-sm text-[#68786B] pl-7 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-[#EFF1DC] rounded-3xl border border-[#E9E2CE] text-center space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#163D2D]">
            Have another question not listed here?
          </h3>
          <p className="text-sm text-[#68786B]">
            Our support team is always delighted to assist you with pickle pairings and orders.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#174E37] text-[#FFF9EC] rounded-full text-xs font-semibold hover:bg-[#0B4A32]"
          >
            Contact Customer Support <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
