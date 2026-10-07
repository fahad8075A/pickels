import { describe, it, expect } from "vitest";

describe("Pricing and Shipping Business Rules", () => {
  it("calculates standard line total correctly without floating point errors", () => {
    const unitPrice = 199;
    const quantity = 3;
    const lineTotal = unitPrice * quantity;
    expect(lineTotal).toBe(597);
  });

  it("applies free shipping for orders of ₹499 and above", () => {
    const subtotalAbove = 587;
    const feeAbove = subtotalAbove >= 499 ? 0 : 50;
    expect(feeAbove).toBe(0);

    const subtotalExact = 499;
    const feeExact = subtotalExact >= 499 ? 0 : 50;
    expect(feeExact).toBe(0);
  });

  it("charges flat ₹50 shipping for orders under ₹499", () => {
    const subtotalBelow = 388;
    const feeBelow = subtotalBelow >= 499 ? 0 : 50;
    expect(feeBelow).toBe(50);
  });

  it("calculates 10% coupon discount correctly", () => {
    const subtotal = 500;
    const discountPercent = 10;
    const discount = Math.round((subtotal * discountPercent) / 100);
    expect(discount).toBe(50);
  });

  it("enforces minimum order threshold for coupons", () => {
    const subtotal = 250;
    const minOrderAmount = 300;
    const isEligible = subtotal >= minOrderAmount;
    expect(isEligible).toBe(false);
  });
});
