import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies();
  clearSessionCookie(cookieStore);
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
