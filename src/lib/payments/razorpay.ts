import crypto from "crypto";

const KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export const isMockPaymentMode =
  !KEY_ID ||
  KEY_ID.includes("mock") ||
  !KEY_SECRET ||
  KEY_SECRET.includes("mock");

export interface CreatePaymentOrderParams {
  amountInPaise: number;
  currency: string;
  receipt: string;
}

export async function createPaymentOrder(params: CreatePaymentOrderParams) {
  if (isMockPaymentMode) {
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entity: "order",
      amount: params.amountInPaise,
      amount_paid: 0,
      amount_due: params.amountInPaise,
      currency: params.currency,
      receipt: params.receipt,
      status: "created",
      isMock: true,
    };
  }

  // Real Razorpay API call
  const authHeader = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      amount: params.amountInPaise,
      currency: params.currency,
      receipt: params.receipt,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Razorpay order creation failed: ${JSON.stringify(err)}`);
  }

  const data = await response.json();
  return { ...data, isMock: false };
}

export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  if (isMockPaymentMode) {
    // In mock mode, allow test signature format or mock confirmation
    return (
      params.razorpaySignature === "mock_signature_valid" ||
      params.razorpaySignature.startsWith("mock_") ||
      params.razorpayOrderId.startsWith("order_mock_")
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");

  return expectedSignature === params.razorpaySignature;
}
