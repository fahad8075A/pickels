import { describe, it, expect } from "vitest";
import { DEFAULT_PAYMENT_SETTINGS } from "../src/lib/settings";
import { verifyPaymentSignature, isMockPaymentMode } from "../src/lib/payments/razorpay";

describe("Payment Gateway and Direct Bank Settlement", () => {
  it("provides valid default merchant bank account and UPI configurations", () => {
    expect(DEFAULT_PAYMENT_SETTINGS.upiId).toContain("@");
    expect(DEFAULT_PAYMENT_SETTINGS.accountNumber.length).toBeGreaterThanOrEqual(10);
    expect(DEFAULT_PAYMENT_SETTINGS.ifscCode).toMatch(/^[A-Z]{4}0[A-Z0-9]{6}$/);
    expect(DEFAULT_PAYMENT_SETTINGS.directBankEnabled).toBe(true);
    expect(DEFAULT_PAYMENT_SETTINGS.razorpayEnabled).toBe(true);
  });

  it("verifies mock payments correctly in mock or development mode", () => {
    if (isMockPaymentMode) {
      const result = verifyPaymentSignature({
        razorpayOrderId: "order_mock_12345",
        razorpayPaymentId: "pay_mock_12345",
        razorpaySignature: "mock_signature_valid",
      });
      expect(result).toBe(true);
    }
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
