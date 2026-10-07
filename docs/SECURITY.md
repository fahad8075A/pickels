# Security & Reliability Policy — Zezty Pickles

## 1. Authentication & Cookie Protection
- Passwords hashed using `bcryptjs` with salt rounds = 10.
- Sessions stored in HTTP-Only, SameSite=Lax, Secure cookies.
- JavaScript running in the browser cannot access or read session tokens.

## 2. Server-Side Price & Inventory Protection
- All line items, subtotals, shipping charges, and discounts are calculated strictly on the server in `src/lib/pricing.ts`.
- Inventory is protected from concurrency race conditions by decrementing units within atomic database transactions (`prisma.$transaction`).
- Order placement fails gracefully if requested quantity exceeds current inventory stock.

## 3. IDOR (Insecure Direct Object Reference) Prevention
- Customers can only query orders associated with their own `userId` in `src/app/account/page.tsx`.
- Administrative routes (`/admin`, `/api/admin/*`) enforce role verification via `requireAdmin()`.
