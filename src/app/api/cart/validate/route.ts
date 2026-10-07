import { NextResponse } from "next/server";
import { calculateCartServer } from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const { items, couponCode } = await req.json();

    const result = await calculateCartServer(items || [], couponCode);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Cart validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate cart on server" },
      { status: 500 }
    );
  }
}
