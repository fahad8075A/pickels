import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            CUSTOMER SATISFACTION
          </span>
          <h1 className="text-4xl font-serif font-black text-[#163D2D] mt-1">
            Returns & Refund Policy
          </h1>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-6 text-[#163D2D] text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">1. Perishable Food Products</h2>
            <p className="text-[#68786B]">
              Due to the perishable and artisanal nature of food pickles, we do not accept general product returns once an opened jar has been delivered, in accordance with FSSAI hygiene standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">2. Damaged or Defective Deliveries</h2>
            <p className="text-[#68786B]">
              If your glass jar arrives broken, damaged in transit, or unsealed, we will gladly dispatch a free replacement jar immediately or process a 100% refund. Please notify us within 48 hours of delivery by emailing photos of the outer box and jar to <strong>orders@zeztypickles.com</strong> or WhatsApp +91 98765 43210.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-xl">3. Refund Processing Timeline</h2>
            <p className="text-[#68786B]">
              Approved refunds are credited back to the original payment method (bank account, UPI, card) within 5 to 7 business days from authorization.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
