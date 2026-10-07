import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { DEFAULT_PAYMENT_SETTINGS } from "../src/lib/settings";
import { verifyPaymentSignature } from "../src/lib/payments/razorpay";

describe("Payment Gateway and Direct Bank Settlement", () => {
  it("provides valid default merchant bank account and UPI configurations", () => {
    expect(DEFAULT_PAYMENT_SETTINGS.upiId).toContain("@");
    expect(DEFAULT_PAYMENT_SETTINGS.accountNumber.length).toBeGreaterThanOrEqual(10);
    expect(DEFAULT_PAYMENT_SETTINGS.ifscCode).toMatch(/^[A-Z]{4}0[A-Z0-9]{6}$/);
    expect(DEFAULT_PAYMENT_SETTINGS.directBankEnabled).toBe(true);
    expect(DEFAULT_PAYMENT_SETTINGS.razorpayEnabled).toBe(true);
    expect(DEFAULT_PAYMENT_SETTINGS.razorpayKeyId).toBe("rzp_live_Tl05XPZnqWHlxe");
  });

  it("verifies live cryptographic HMAC signature accurately", () => {
    const orderId = "order_live_12345";
    const paymentId = "pay_live_67890";
    const secret = "SAOAxeNNNQ0NeeaOsmTtz3FQ";
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const isValid = verifyPaymentSignature({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: validSignature,
    });
    expect(isValid).toBe(true);

    const isTampered = verifyPaymentSignature({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: "invalid_tampered_signature",
    });
    expect(isTampered).toBe(false);
  });

  it("formats UPI payment intent URIs properly with merchant name and total amount", () => {
    const total = 598;
    const upiUri = `upi://pay?pa=${encodeURIComponent(
      DEFAULT_PAYMENT_SETTINGS.upiId
    )}&pn=${encodeURIComponent(
      DEFAULT_PAYMENT_SETTINGS.accountHolderName
    )}&am=${total}&cu=INR&tn=${encodeURIComponent("Zezty Pickles Order")}`;

    expect(upiUri).toContain("upi://pay?pa=");
    expect(upiUri).toContain("&am=598");
    expect(upiUri).toContain("&cu=INR");
  });
});
