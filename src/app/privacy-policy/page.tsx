import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            DATA PROTECTION
          </span>
          <h1 className="text-4xl font-serif font-black text-[#163D2D] mt-1">
            Privacy Policy
          </h1>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-6 text-[#163D2D] text-sm leading-relaxed">
          <p className="text-[#68786B]">
            Zezty Pickles values your trust and is committed to protecting your personal information. This Privacy Policy details how we collect, store, and utilize your personal data during order processing.
          </p>
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">Information We Collect</h2>
            <p className="text-[#68786B]">
              We collect your name, shipping address, contact phone number, and email address solely for fulfilling orders, dispatch updates, and transactional receipts.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">Payment Security</h2>
            <p className="text-[#68786B]">
              We never store your credit/debit card numbers or UPI PINs. Online transactions are tokenized and processed securely through Razorpay in compliance with PCI-DSS standards.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
