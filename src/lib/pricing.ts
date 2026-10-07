import { prisma } from "./prisma";

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface ValidatedLineItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
}

export interface CartCalculationResult {
  items: ValidatedLineItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: {
    code: string;
    discountValue: number;
    discountType: string;
  } | null;
  errors: string[];
}

export async function calculateCartServer(
  cartItems: CartItemInput[],
  couponCode?: string | null
): Promise<CartCalculationResult> {
  const errors: string[] = [];

  if (!cartItems || cartItems.length === 0) {
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      shippingFee: 0,
      total: 0,
      appliedCoupon: null,
      errors: ["Cart is empty"],
    };
  }

  const productIds = cartItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isPublished: true,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  const validatedItems: ValidatedLineItem[] = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      errors.push(`Product with ID ${item.productId} is no longer available.`);
      continue;
    }

    if (item.quantity <= 0) {
      continue;
    }

    const requestedQty = item.quantity;
    const finalQty = Math.min(requestedQty, product.stock);

    if (finalQty < requestedQty) {
      errors.push(
        `Only ${product.stock} units of ${product.name} are available in stock.`
      );
    }

    if (finalQty > 0) {
      const lineTotal = product.price * finalQty;
      subtotal += lineTotal;
      validatedItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        quantity: finalQty,
        lineTotal,
        availableStock: product.stock,
      });
    }
  }

  // Shipping Calculation: Free delivery on subtotal >= 499, else ₹50
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 50;

  // Coupon Calculation
  let discount = 0;
  let appliedCoupon = null;

  if (couponCode && couponCode.trim() !== "" && subtotal > 0) {
    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      errors.push(`Coupon '${cleanCode}' is invalid or inactive.`);
    } else if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      errors.push(`Coupon '${cleanCode}' has expired.`);
    } else if (coupon.usedCount >= coupon.maxUses) {
      errors.push(`Coupon '${cleanCode}' has reached its maximum usage limit.`);
    } else if (subtotal < coupon.minOrderAmount) {
      errors.push(
        `Coupon '${cleanCode}' requires a minimum order value of ₹${coupon.minOrderAmount}.`
      );
    } else {
      if (coupon.discountType === "PERCENTAGE") {
        const rawDiscount = Math.round((subtotal * coupon.discountValue) / 100);
        discount = coupon.maxDiscount
          ? Math.min(rawDiscount, coupon.maxDiscount)
          : rawDiscount;
      } else {
        discount = Math.min(coupon.discountValue, subtotal);
      }

      appliedCoupon = {
        code: coupon.code,
        discountValue: discount,
        discountType: coupon.discountType,
      };
    }
  }

  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    items: validatedItems,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    errors,
  };
}
