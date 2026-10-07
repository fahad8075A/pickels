import React from "react";
import Link from "next/link";
import { CheckCircle2, PackageCheck, ArrowRight, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: {
    orderNumber?: string;
  };
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = searchParams;

  let order = null;
  if (orderNumber) {
    order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
  }

  return (
    <div className="py-20 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
        
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            ORDER CONFIRMED
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#163D2D]">
            Thank You for Your Order!
          </h1>
          <p className="text-sm sm:text-base text-[#68786B] max-w-lg mx-auto">
            Your homemade pickle jars are being carefully packed with love. We will notify you once your order is dispatched.
          </p>
        </div>

        {order ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E2CE] shadow-md text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E9E2CE] gap-2">
              <div>
                <p className="text-xs text-[#68786B]">Order Reference Number</p>
                <p className="font-mono font-bold text-lg text-[#163D2D]">{order.orderNumber}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-[#68786B]">Payment Method</p>
                <span className="inline-block px-3 py-1 bg-[#EFF1DC] text-[#174E37] text-xs font-bold rounded-full">
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay Online Paid"}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div>
              <p className="text-xs font-semibold text-[#68786B] uppercase mb-1">Shipping Destination</p>
              <p className="text-sm text-[#163D2D] leading-relaxed">{order.shippingAddress}</p>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-[#68786B] uppercase">Jars Ordered</p>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                  <span className="text-[#163D2D]">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-bold text-[#163D2D]">₹{item.total}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#E9E2CE] flex justify-between items-baseline">
              <span className="font-serif font-bold text-base text-[#163D2D]">Total Amount</span>
              <span className="font-serif font-black text-2xl text-[#174E37]">₹{order.total}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-[#E9E2CE] shadow-sm">
            <p className="text-sm text-[#163D2D]">
              Order Number: <strong className="font-mono">{orderNumber || "Pending"}</strong>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/track-order?orderNumber=${orderNumber || ""}`}
            className="w-full sm:w-auto px-6 py-3 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm hover:bg-[#0B4A32] shadow flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" /> Track Order Status
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 border-2 border-[#174E37] text-[#174E37] rounded-full font-semibold text-sm hover:bg-[#EFF1DC]"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
