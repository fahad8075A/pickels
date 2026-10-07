import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const [hero, story, promo, coupons, messages] = await Promise.all([
      prisma.heroContent.findFirst({ where: { id: "default" } }),
      prisma.storyContent.findFirst({ where: { id: "default" } }),
      prisma.promoBanner.findFirst({ where: { id: "default" } }),
      prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    ]);

    return NextResponse.json({
      hero,
      story,
      promo,
      coupons,
      messages,
    });
  } catch (error) {
    console.error("CMS GET error:", error);
    return NextResponse.json({ error: "Failed to fetch CMS content" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: "Section and data are required" }, { status: 400 });
    }

    if (section === "hero") {
      await prisma.heroContent.upsert({
        where: { id: "default" },
        update: data,
        create: { id: "default", ...data },
      });
    } else if (section === "story") {
      await prisma.storyContent.upsert({
        where: { id: "default" },
        update: data,
        create: { id: "default", ...data },
      });
    } else if (section === "promo") {
      await prisma.promoBanner.upsert({
        where: { id: "default" },
        update: data,
        create: { id: "default", ...data },
      });
    } else if (section === "coupon") {
      await prisma.coupon.create({
        data: {
          code: data.code.toUpperCase().trim(),
          discountType: data.discountType || "FIXED",
          discountValue: Number(data.discountValue),
          minOrderAmount: Number(data.minOrderAmount) || 0,
          maxUses: Number(data.maxUses) || 100,
          isActive: true,
        },
      });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: `CMS_UPDATE: ${section}`,
        actorEmail: admin.email,
        details: JSON.stringify(data),
      },
    });

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/our-story");

    return NextResponse.json({ success: true, message: `${section} updated successfully` });
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    console.error("CMS PUT error:", error);
    return NextResponse.json({ error: "Failed to update CMS" }, { status: 500 });
  }
}
