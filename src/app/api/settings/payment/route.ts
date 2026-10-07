import { NextResponse } from "next/server";
import { getPaymentSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getPaymentSettings();
    return NextResponse.json({
      success: true,
      settings: {
        upiId: settings.upiId,
        accountHolderName: settings.accountHolderName,
        accountNumber: settings.accountNumber,
        bankName: settings.bankName,
        ifscCode: settings.ifscCode,
        accountType: settings.accountType,
        branch: settings.branch,
        instructions: settings.instructions,
        razorpayKeyId: settings.razorpayKeyId,
        razorpayEnabled: settings.razorpayEnabled,
        directBankEnabled: settings.directBankEnabled,
        codEnabled: settings.codEnabled,
      },
    });
  } catch (error) {
    console.error("Failed to fetch public payment settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment settings" },
      { status: 500 }
    );
  }
}
