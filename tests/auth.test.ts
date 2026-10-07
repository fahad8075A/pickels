import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "../src/lib/auth";

describe("Cryptographic Authentication Engine", () => {
  it("generates and verifies valid session tokens", () => {
    const payload = {
      userId: "user-12345",
      email: "test@zeztypickles.com",
      role: "CUSTOMER",
      name: "Test Customer",
    };

    const token = signToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.includes(".")).toBe(true);

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe("user-12345");
    expect(decoded?.email).toBe("test@zeztypickles.com");
    expect(decoded?.role).toBe("CUSTOMER");
  });

  it("rejects tampered tokens", () => {
    const payload = {
      userId: "user-12345",
      email: "test@zeztypickles.com",
      role: "CUSTOMER",
      name: "Test Customer",
    };

    const token = signToken(payload);
    const tampered = token.slice(0, -4) + "XXXX";
    const decoded = verifyToken(tampered);
    expect(decoded).toBeNull();
  });

  it("identifies admin role correctly", () => {
    const adminToken = signToken({
      userId: "admin-1",
      email: "admin@zeztypickles.com",
      role: "ADMIN",
      name: "Administrator",
    });

    const decoded = verifyToken(adminToken);
    expect(decoded?.role).toBe("ADMIN");
  });
});
