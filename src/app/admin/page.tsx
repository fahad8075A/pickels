import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch real database records
  const [totalOrders, totalProducts, totalCustomers, orders, products, categories] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      prisma.category.findMany(),
    ]);

  const paidOrders = await prisma.order.findMany({
    where: {
      OR: [{ paymentStatus: "PAID" }, { status: "DELIVERED" }, { status: "CONFIRMED" }],
    },
    select: { total: true },
  });

  const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.total, 0);

  const pendingOrders = await prisma.order.count({
    where: { status: { in: ["PENDING_PAYMENT", "CONFIRMED", "PROCESSING"] } },
  });

  const lowStockProducts = products.filter((p) => p.stock <= 20);

  return (
    <div className="py-12 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E9E2CE] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#174E37] text-[#FFF9EC] text-xs font-bold rounded-full flex items-center gap-1.5 shadow">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5B82E]" /> Zezty Pickles Admin Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#163D2D] mt-2">
              Operations & Store Management
            </h1>
            <p className="text-xs text-[#68786B]">
              Logged in as Administrator: {user.email}
            </p>
          </div>
        </div>

        {/* Dashboard Client Area */}
        <AdminDashboardClient
          initialStats={{
            totalOrders,
            totalProducts,
            totalCustomers,
            totalRevenue,
            pendingOrders,
            lowStockCount: lowStockProducts.length,
          }}
          initialOrders={orders}
          initialProducts={products}
          categories={categories}
        />

      </div>
    </div>
  );
}
