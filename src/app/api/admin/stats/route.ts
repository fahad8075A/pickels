import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();

    const [totalOrders, totalProducts, totalCustomers, orders, lowStockProducts] =
      await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { items: true },
        }),
        prisma.product.findMany({
          where: { stock: { lte: 20 } },
          select: { id: true, name: true, stock: true, sku: true },
        }),
      ]);

    // Calculate revenue from paid or confirmed orders
    const paidOrders = await prisma.order.findMany({
      where: {
        OR: [{ paymentStatus: "PAID" }, { status: "DELIVERED" }],
      },
      select: { total: true },
    });

    const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.total, 0);

    const pendingOrders = await prisma.order.count({
      where: {
        status: { in: ["PENDING_PAYMENT", "CONFIRMED", "PROCESSING"] },
      },
    });

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue,
      pendingOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders: orders,
    });
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
