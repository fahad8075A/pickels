import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { calculateCartServer } from "@/lib/pricing";
import { createPaymentOrder, isMockPaymentMode } from "@/lib/payments/razorpay";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      items,
      couponCode,
      paymentMethod, // "COD" | "RAZORPAY" | "DIRECT_BANK" | "DIRECT_UPI"
      shippingDetails,
      notes,
      utrNumber,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.addressLine || !shippingDetails.postalCode) {
      return NextResponse.json({ error: "Complete shipping details are required" }, { status: 400 });
    }

    // 1. Authoritative Server-side Price & Stock Calculation
    const calc = await calculateCartServer(items, couponCode);

    if (calc.errors.length > 0 && calc.items.length === 0) {
      return NextResponse.json({ error: calc.errors.join(", ") }, { status: 400 });
    }

    // Generate readable order number e.g. ZP-20261007-4821
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderNumber = `ZP-${datePrefix}-${randomSuffix}`;

    const formattedAddress = `${shippingDetails.fullName}, ${shippingDetails.phone ? `Phone: ${shippingDetails.phone}, ` : ""}${shippingDetails.addressLine}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.postalCode}`;

    const isOnlinePayment = paymentMethod === "RAZORPAY";
    const isDirectBank = paymentMethod === "DIRECT_BANK" || paymentMethod === "DIRECT_UPI";

    const orderPaymentMethod = isOnlinePayment
      ? "RAZORPAY"
      : isDirectBank
      ? "DIRECT_BANK"
      : "COD";

    const formattedNotes = [
      notes,
      utrNumber ? `[Bank/UPI Transfer UTR: ${utrNumber}]` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    // 2. Database Transaction to Create Order and Line Items
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.userId || null,
          guestName: !user ? shippingDetails.fullName : null,
          guestEmail: !user ? shippingDetails.email : null,
          guestPhone: !user ? shippingDetails.phone : null,
          shippingAddress: formattedAddress,
          subtotal: calc.subtotal,
          discount: calc.discount,
          shippingFee: calc.shippingFee,
          total: calc.total,
          status: isOnlinePayment ? "PENDING_PAYMENT" : "CONFIRMED",
          paymentMethod: orderPaymentMethod,
          paymentStatus: isDirectBank ? "PENDING_VERIFICATION" : "PENDING",
          razorpayPaymentId: utrNumber ? `UTR-${utrNumber}` : null,
          notes: formattedNotes || null,
          items: {
            create: calc.items.map((item) => ({
              productId: item.productId,
              productName: item.name,
              productImage: item.image,
              price: item.price,
              quantity: item.quantity,
              total: item.lineTotal,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // If COD or Direct Bank, safely decrement stock and increment coupon usage
      if (!isOnlinePayment) {
        for (const item of calc.items) {
          try {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          } catch (stockErr) {
            console.warn("Stock update skipped for item:", item.productId, stockErr);
          }
        }

        if (calc.appliedCoupon) {
          try {
            await tx.coupon.update({
              where: { code: calc.appliedCoupon.code },
              data: { usedCount: { increment: 1 } },
            });
          } catch (couponErr) {
            console.warn("Coupon usage increment skipped:", couponErr);
          }
        }
      }

      return order;
    });

    // 3. If Online Payment, generate Razorpay Order
    let razorpayOrder = null;
    if (isOnlinePayment) {
      try {
        razorpayOrder = await createPaymentOrder({
          amountInPaise: newOrder.total * 100,
          currency: "INR",
          receipt: newOrder.orderNumber,
        });

        await prisma.order.update({
          where: { id: newOrder.id },
          data: { razorpayOrderId: razorpayOrder.id },
        });
      } catch (payErr: any) {
        console.error("Payment order generation failed:", payErr);
        return NextResponse.json(
          {
            error:
              payErr?.message ||
              "Failed to initialize payment gateway. Please retry or choose Direct Bank Transfer.",
          },
          { status: 500 }
        );
      }
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      "rzp_live_Tl05XPZnqWHlxe";

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
        status: newOrder.status,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        notes: newOrder.notes,
      },
      razorpayOrder,
      razorpayKeyId: keyId,
      isMockPayment: isMockPaymentMode,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create order. Please check inputs and try again." },
      { status: 500 }
    );
  }
}
