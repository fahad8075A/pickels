# Architecture Specification — Zezty Pickles

## 1. Overview
Zezty Pickles is architected using Next.js 14 App Router, React 18, TypeScript (strict mode), Tailwind CSS, and Prisma ORM. It couples high-performance Server Components with targeted interactive Client Components, ensuring low bundle sizes, instant first-contentful paint, and robust SEO.

## 2. Component Boundaries
- **Server Components (Default)**:
  - Homepage (`src/app/page.tsx`), catalog listing (`src/app/products/page.tsx`), product details (`src/app/products/[slug]/page.tsx`), story, ingredients, policies, order confirmation, and admin container.
  - Data fetching executed directly on the server through Prisma.
- **Client Components (`"use client"`)**:
  - `Header`: Interactive navigation drawer, search bar expansion, live cart badge.
  - `CartDrawer` & `CartPage`: Cart state persistence via Zustand and localStorage.
  - `ProductCard` & `ProductDetailActions`: Quantity increment/decrement, Add-to-Basket triggers.
  - `CheckoutPage`: Multi-step address inputs, payment gateway modal integration.
  - `AdminDashboardClient`: Real-time order status updates and stock editing.

## 3. Data Flow and Session Architecture
- **Stateless HMAC-Signed Cookies**:
  - Authentication tokens signed server-side using SHA-256 HMAC and `AUTH_SECRET`.
  - HTTP-only cookies prevent Cross-Site Scripting (XSS) token theft.
  - Verified in `getCurrentUser()`, `requireAuth()`, and `requireAdmin()`.
- **Authoritative Server Pricing**:
  - Client sends requested items and quantities.
  - Server fetches database records, recalculates subtotals, verifies available stock, evaluates active coupon eligibility, and adds shipping fees.
  - Client state is never trusted for billing or inventory deduction.
