import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { isS3Configured, uploadToS3, getS3DownloadSignedUrl } from "@/lib/s3";

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

    // If S3 is configured, upload to S3 and generate URL
    if (isS3Configured()) {
      try {
        const s3Key = `uploads/products/${filename}`;
        await uploadToS3(s3Key, buffer, file.type || "image/jpeg");
        // Generate presigned URL for viewing or direct link
        const signedUrl = await getS3DownloadSignedUrl(s3Key, 86400 * 7); // 7 days or custom
        return NextResponse.json({ success: true, url: signedUrl, key: s3Key });
      } catch (s3Err) {
        console.warn("S3 upload failed, falling back to local storage:", s3Err);
      }
    }

    // In serverless / cloud deployments (like Vercel) where filesystem is ephemeral and not served by CDN,
    // return dataUrl so the image is stored in PostgreSQL and displayed on all devices.
    const isCloudServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    if (isCloudServerless) {
      return NextResponse.json({ success: true, url: dataUrl });
    }

    try {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      const publicUrl = `/images/products/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    } catch (fsError) {
      console.warn("Filesystem write failed, using data URL fallback:", fsError);
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
