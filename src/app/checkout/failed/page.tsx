import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

interface FailedPageProps {
  searchParams: {
    reason?: string;
  };
}

export default function CheckoutFailedPage({ searchParams }: FailedPageProps) {
  const { reason } = searchParams;

  return (
    <div className="py-24 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-serif font-black text-[#163D2D]">
          Payment Not Completed
        </h1>

        <p className="text-sm text-[#68786B] leading-relaxed">
          {reason
            ? decodeURIComponent(reason)
            : "Your payment attempt was cancelled or could not be verified by the bank. No money has been deducted from your account."}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/checkout"
            className="w-full sm:w-auto px-6 py-3 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm hover:bg-[#0B4A32] shadow flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Checkout
          </Link>
          <Link
            href="/cart"
            className="w-full sm:w-auto px-6 py-3 border border-[#E9E2CE] bg-white text-[#163D2D] rounded-full font-semibold text-sm hover:bg-[#EFF1DC] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
