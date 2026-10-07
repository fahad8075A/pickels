import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `custom-${Date.now()}-${cleanOriginalName}`;
    const uploadDir = path.join(process.cwd(), "public", "images", "products");

    try {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      const publicUrl = `/images/products/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    } catch (fsError) {
      // In serverless environments where filesystem is read-only, return base64 data url
      console.warn("Filesystem write failed, using data URL fallback:", fsError);
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
