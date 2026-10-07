# Testing Guide — Zezty Pickles

## 1. Automated Unit & Integration Tests
Run all automated test suites using Vitest:
```bash
npm run test
```

### Covered Test Scenarios
- **Line Subtotal Calculation**: Ensures integer-based price multiplication avoids IEEE 754 float precision errors.
- **Free Shipping Threshold**: Verifies ₹0 shipping when subtotal >= ₹499 and flat ₹50 shipping below.
- **Coupon Percentage & Cap**: Validates 10% coupon reductions and minimum order thresholds.
- **Cryptographic Token Verification**: Tests HMAC SHA-256 token signing, claims preservation, and rejection of tampered strings.
- **Role Permissions**: Confirms distinction between `CUSTOMER` and `ADMIN`.

## 2. Type Checking
Run strict TypeScript verification:
```bash
npx tsc --noEmit
```

## 3. Production Build Validation
Run compilation and asset generation:
```bash
npm run build
```
