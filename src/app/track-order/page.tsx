import React from "react";
import { prisma } from "@/lib/prisma";
import { Package, Truck, CheckCircle2, Clock, Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface TrackOrderProps {
  searchParams: {
    orderNumber?: string;
  };
}

export default async function TrackOrderPage({ searchParams }: TrackOrderProps) {
  const { orderNumber } = searchParams;

  let order = null;
  if (orderNumber && orderNumber.trim()) {
    order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.trim() },
      include: { items: true },
    });
  }

  const steps = [
    { key: "CONFIRMED", label: "Order Confirmed", icon: CheckCircle2 },
    { key: "PROCESSING", label: "Curing & Packing", icon: Package },
    { key: "SHIPPED", label: "In Transit", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return 0;
      case "PROCESSING":
        return 1;
      case "PACKED":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            LIVE FULFILLMENT
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#163D2D]">
            Track Your Pickle Order
          </h1>
          <p className="text-sm text-[#68786B]">
            Enter your order reference number to view current dispatch status and delivery details.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E9E2CE] shadow-sm">
          <form method="GET" action="/track-order" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#68786B] absolute left-4 top-3.5" />
              <input
                type="text"
                name="orderNumber"
                defaultValue={orderNumber || ""}
                placeholder="e.g. ZP-20261007-4821"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-full text-sm text-[#163D2D] font-mono focus:outline-none focus:ring-1 focus:ring-[#174E37]"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#174E37] text-[#FFF9EC] rounded-full text-sm font-semibold hover:bg-[#0B4A32] shadow"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Order Details Result */}
        {orderNumber && !order && (
          <div className="bg-white p-8 rounded-3xl border border-[#E9E2CE] text-center space-y-2">
            <Clock className="w-8 h-8 text-[#68786B] mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#163D2D]">
              Order Not Found
            </h3>
            <p className="text-sm text-[#68786B]">
              We couldn&apos;t find an order matching <span className="font-mono font-bold">{orderNumber}</span>. Please verify your order number and retry.
            </p>
          </div>
        )}

        {order && (
          <div className="bg-white p-8 rounded-3xl border border-[#E9E2CE] shadow-md space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E9E2CE] gap-4">
              <div>
                <p className="text-xs text-[#68786B]">Order Number</p>
                <p className="font-mono font-black text-xl text-[#163D2D]">{order.orderNumber}</p>
                <p className="text-xs text-[#68786B] mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="sm:text-right">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF1DC] text-[#174E37] border border-[#E9E2CE]">
                  Status: {order.status}
                </span>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="py-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                {steps.map((st, idx) => {
                  const Icon = st.icon;
                  const isDone = idx <= currentStepIndex;
                  return (
                    <div key={st.key} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDone
                            ? "bg-[#174E37] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-semibold ${isDone ? "text-[#163D2D]" : "text-gray-400"}`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking info if dispatched */}
            {order.trackingNumber && (
              <div className="p-4 bg-[#EFF1DC] rounded-2xl border border-[#E9E2CE] text-sm text-[#163D2D]">
                <p className="font-bold">Courier Partner: {order.courierName || "Bluedart / Delhivery"}</p>
                <p className="font-mono mt-0.5">Tracking AWB: {order.trackingNumber}</p>
              </div>
            )}

            {/* Delivery address & items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E9E2CE] text-sm">
              <div>
                <p className="text-xs font-bold text-[#68786B] uppercase mb-1">Delivering To</p>
                <p className="text-[#163D2D]">{order.shippingAddress}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#68786B] uppercase mb-1">Items in Parcel</p>
                {order.items.map((i) => (
                  <p key={i.id} className="text-[#163D2D]">
                    {i.quantity}x {i.productName} (₹{i.total})
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
