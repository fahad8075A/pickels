import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
      malayalamName,
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
      weightVariants,
      stock,
      isFeatured,
      isBestseller,
      isPublished,
    } = data;

    let targetCategoryId = categoryId;
    if (!targetCategoryId) {
      const defaultCat = await prisma.category.findFirst();
      if (defaultCat) {
        targetCategoryId = defaultCat.id;
      } else {
        const createdCat = await prisma.category.create({
          data: { name: "Traditional Pickles", slug: "traditional-pickles" },
        });
        targetCategoryId = createdCat.id;
      }
    }

    if (!name || !slug || !price) {
      return NextResponse.json({ error: "Missing name, slug, or price" }, { status: 400 });
    }

    const formattedWeightVariants =
      typeof weightVariants === "string"
        ? weightVariants
        : Array.isArray(weightVariants)
        ? JSON.stringify(weightVariants)
        : null;

    const newProduct = await prisma.product.create({
      data: {
        name: String(name).trim(),
        malayalamName: malayalamName ? String(malayalamName).trim() : null,
        slug: String(slug).trim(),
        shortDescription: shortDescription || "",
        fullDescription: fullDescription || shortDescription || "",
        sku: sku ? String(sku).trim() : `ZP-${Date.now()}`,
        categoryId: targetCategoryId,
        price: Math.round(Number(price)),
        originalPrice: originalPrice ? Math.round(Number(originalPrice)) : null,
        image: image || "/images/products/mango-pickle.jpg",
        ingredients: ingredients || "Traditional Spices, Cold-Pressed Oil, Salt",
        weight: weight || "350g",
        weightVariants: formattedWeightVariants,
        stock: Math.round(Number(stock)) || 50,
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
      include: { category: true },
    });

    await prisma.auditLog.create({
      data: {
        action: `PRODUCT_CREATE: ${newProduct.name}`,
        actorEmail: admin.email,
        details: JSON.stringify({ id: newProduct.id, price: newProduct.price }),
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/admin");
      if (newProduct.slug) {
        revalidatePath(`/products/${newProduct.slug}`);
      }
    } catch (revErr) {
      console.warn("Path revalidation warning:", revErr);
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Create product error:", error);
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A product with this slug or SKU already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error?.message || "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    const data = await req.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Explicitly whitelist valid Prisma fields to prevent unknown field errors
    const updateData: Record<string, any> = {};

    if (data.name !== undefined) updateData.name = String(data.name).trim();
    if (data.malayalamName !== undefined) {
      updateData.malayalamName = data.malayalamName ? String(data.malayalamName).trim() : null;
    }
    if (data.slug !== undefined) updateData.slug = String(data.slug).trim();
    if (data.shortDescription !== undefined) updateData.shortDescription = String(data.shortDescription);
    if (data.fullDescription !== undefined) updateData.fullDescription = String(data.fullDescription);
    if (data.sku !== undefined) updateData.sku = String(data.sku).trim();
    if (data.image !== undefined) updateData.image = String(data.image);
    if (data.ingredients !== undefined) updateData.ingredients = String(data.ingredients);
    if (data.weight !== undefined) updateData.weight = String(data.weight);

    if (data.categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: String(data.categoryId) } });
      if (cat) {
        updateData.categoryId = cat.id;
      }
    }

    if (data.price !== undefined && data.price !== null && data.price !== "") {
      const parsedPrice = Math.round(Number(data.price));
      if (!isNaN(parsedPrice)) updateData.price = parsedPrice;
    }

    if (data.originalPrice !== undefined) {
      if (data.originalPrice === null || data.originalPrice === "" || Number(data.originalPrice) === 0) {
        updateData.originalPrice = null;
      } else {
        const parsedOrig = Math.round(Number(data.originalPrice));
        updateData.originalPrice = !isNaN(parsedOrig) ? parsedOrig : null;
      }
    }

    if (data.stock !== undefined && data.stock !== null && data.stock !== "") {
      const parsedStock = Math.round(Number(data.stock));
      if (!isNaN(parsedStock)) updateData.stock = parsedStock;
    }

    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
    if (data.isBestseller !== undefined) updateData.isBestseller = Boolean(data.isBestseller);
    if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);

    if (data.weightVariants !== undefined) {
      updateData.weightVariants =
        typeof data.weightVariants === "string"
          ? data.weightVariants
          : Array.isArray(data.weightVariants)
          ? JSON.stringify(data.weightVariants)
          : null;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    await prisma.auditLog.create({
      data: {
        action: `PRODUCT_UPDATE: ${updated.name}`,
        actorEmail: admin.email,
        details: JSON.stringify({ id: updated.id, updatedFields: Object.keys(updateData) }),
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/admin");
      if (updated.slug) {
        revalidatePath(`/products/${updated.slug}`);
      }
    } catch (revErr) {
      console.warn("Path revalidation warning:", revErr);
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Another product with this slug or SKU already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 });
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

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/admin");
    } catch (revErr) {
      console.warn("Path revalidation warning:", revErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ADMIN_ONLY" || error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
