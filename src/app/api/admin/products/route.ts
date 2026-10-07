import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();

    const {
      name,
      slug,
      shortDescription,
      fullDescription,
      sku,
      categoryId,
      price,
      originalPrice,
      image,
      ingredients,
      weight,
      stock,
      isFeatured,
      isBestseller,
      isPublished,
    } = data;

    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        shortDescription: shortDescription || "",
        fullDescription: fullDescription || "",
        sku: sku || `ZP-${Date.now()}`,
        categoryId,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        image: image || "/images/products/mango-pickle.jpg",
        ingredients: ingredients || "",
        weight: weight || "350g",
        stock: Number(stock) || 50,
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: `PRODUCT_CREATE: ${newProduct.name}`,
        actorEmail: admin.email,
        details: JSON.stringify({ id: newProduct.id, price: newProduct.price }),
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        action: `PRODUCT_UPDATE: ${updated.name}`,
        actorEmail: admin.email,
        details: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const deleted = await prisma.product.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        action: `PRODUCT_DELETE: ${deleted.name}`,
        actorEmail: admin.email,
        details: JSON.stringify({ id: deleted.id }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
