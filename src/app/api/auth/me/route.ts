import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie, getCurrentUser } from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies();
  clearSessionCookie(cookieStore);
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user });
}
