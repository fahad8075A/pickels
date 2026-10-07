import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, User, MapPin, LogOut, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Account Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#EFF1DC] text-[#174E37] rounded-full flex items-center justify-center font-serif font-black text-xl border border-[#E9E2CE]">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-2xl text-[#163D2D]">
                  {user.name}
                </h1>
                {user.role === "ADMIN" && (
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-[#68786B] mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#174E37] text-[#FFF9EC] rounded-full text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Shield className="w-3.5 h-3.5" /> Admin Portal
              </Link>
            )}

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 border border-[#E9E2CE] bg-[#FFF9EC] text-[#163D2D] rounded-full text-xs font-semibold hover:bg-[#E9E2CE] flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" /> Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order History (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#174E37]" />
              <h2 className="font-serif font-bold text-xl text-[#163D2D]">
                Order History ({user.orders.length})
              </h2>
            </div>

            {user.orders.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-[#E9E2CE] text-center space-y-3">
                <p className="text-sm text-[#68786B]">You have not placed any orders yet.</p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-2.5 bg-[#174E37] text-[#FFF9EC] rounded-full text-xs font-semibold shadow"
                >
                  Order Handcrafted Pickles
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-2xl border border-[#E9E2CE] shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E9E2CE] gap-2">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#163D2D]">
                          {order.orderNumber}
                        </span>
                        <p className="text-[11px] text-[#68786B]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#EFF1DC] text-[#174E37] text-xs font-bold rounded-full">
                          {order.status}
                        </span>
                        <span className="font-serif font-bold text-base text-[#163D2D]">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((i) => (
                        <div key={i.id} className="flex justify-between text-xs text-[#163D2D]">
                          <span>{i.quantity}x {i.productName}</span>
                          <span className="font-semibold">₹{i.total}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link
                        href={`/track-order?orderNumber=${order.orderNumber}`}
                        className="text-xs font-semibold text-[#174E37] hover:underline"
                      >
                        Track Status →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Addresses (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#174E37]" />
              <h2 className="font-serif font-bold text-xl text-[#163D2D]">
                Saved Addresses
              </h2>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-4">
              {user.addresses.length === 0 ? (
                <p className="text-xs text-[#68786B]">
                  No saved addresses yet. Address will be saved upon placing an order.
                </p>
              ) : (
                user.addresses.map((addr) => (
                  <div key={addr.id} className="p-3 bg-[#FFF9EC] rounded-xl border border-[#E9E2CE] text-xs space-y-1">
                    <p className="font-bold text-[#163D2D]">{addr.fullName}</p>
                    <p className="text-[#68786B]">{addr.addressLine}, {addr.city}</p>
                    <p className="text-[#68786B]">{addr.state} - {addr.postalCode}</p>
                    <p className="text-[#68786B]">Phone: {addr.phone}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
