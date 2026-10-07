import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPaymentSettings, updatePaymentSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getPaymentSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch payment settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    await updatePaymentSettings(body);

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "PAYMENT_SETTINGS_UPDATED",
        actorEmail: admin.email,
        details: JSON.stringify({
          updatedFields: Object.keys(body),
          updatedAt: new Date().toISOString(),
        }),
      },
    });

    const updatedSettings = await getPaymentSettings();

    return NextResponse.json({
      success: true,
      message: "Payment and bank settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    console.error("Failed to update payment settings:", error);
    return NextResponse.json({ error: "Failed to update payment settings" }, { status: 500 });
  }
}
