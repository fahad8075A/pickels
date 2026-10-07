import crypto from "crypto";

export function getRazorpayCredentials() {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_live_Tl05XPZnqWHlxe";
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET || "SAOAxeNNNQ0NeeaOsmTtz3FQ";

  const isMock =
    !keyId ||
    keyId.includes("mock") ||
    !keySecret ||
    keySecret.includes("mock");

  return { keyId, keySecret, isMock };
}

export const isMockPaymentMode = false; // Live payment enabled with user's live credentials

export interface CreatePaymentOrderParams {
  amountInPaise: number;
  currency: string;
  receipt: string;
}

export async function createPaymentOrder(params: CreatePaymentOrderParams) {
  const { keyId, keySecret } = getRazorpayCredentials();

  // Real live Razorpay API call
  const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      amount: Math.round(params.amountInPaise),
      currency: params.currency || "INR",
      receipt: params.receipt,
      payment_capture: 1, // Automatically capture customer payments
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("Razorpay API Error:", err);
    throw new Error(
      `Razorpay order creation failed: ${err.error?.description || JSON.stringify(err)}`
    );
  }

  const data = await response.json();
  return { ...data, isMock: false };
}

export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const { keySecret } = getRazorpayCredentials();

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");

  return expectedSignature === params.razorpaySignature;
}
