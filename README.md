# Zezty Pickles — Premium Indian Pickles E-Commerce Platform

A production-ready e-commerce platform for **Zezty Pickles**, handcrafted with **Next.js 14 App Router, TypeScript (strict mode), Tailwind CSS, and Prisma ORM**.

Designed with rich Indian culinary branding: deep forest greens, warm cream paper textures, Playfair Display typography, sun-cured pickle jars, and interactive shopping workflows.

---

## 🌟 Key Features

1. **Brand-Accurate Homepage**:
   - Announcement bar & botanical logo
   - Wide Hero with culinary photography & handcrafted badge
   - 4-pillar botanical benefits strip
   - Bestselling product cards with live cart connection
   - "Our Story" split section with terracotta serving bowl
   - 6 pure ingredients showcase
   - Verified customer reviews & star ratings
   - Deep-green promotional CTA banner
   - Comprehensive footer with functional newsletter & links

2. **Full Product Catalog & Details**:
   - Server-rendered catalog at `/products` with category filtering and sorting
   - Product detail pages at `/products/[slug]` with quantity selection, ingredient tags, trust highlights, and related pickles
   - Live search at `/search` across titles, ingredients, and descriptions

3. **Persistent Cart & Fast Slide-Out Drawer**:
   - Universal slide-out `CartDrawer` accessible on every page
   - Full cart management page at `/cart` with coupon redemption (`WELCOME10`, `TASTE50`)
   - Free shipping calculation threshold (Free above ₹499, flat ₹50 below)

4. **Secure Checkout & Indian Payments**:
   - Guest & authenticated customer checkout at `/checkout`
   - Cash on Delivery (COD) and Razorpay integration with server-side HMAC signature verification
   - Verified order confirmation at `/checkout/success` and payment decline handler at `/checkout/failed`
   - Real-time fulfillment tracking at `/track-order` with live status stepper

5. **Customer Accounts & Admin Portal**:
   - Customer authentication at `/login` and `/register` with bcrypt password hashing and HTTP-only cookies
   - Customer account at `/account` displaying order history and saved addresses
   - Protected Admin Dashboard at `/admin` featuring real database metrics (Revenue, Orders, Low Stock Alerts), live fulfillment status updates, and catalog stock editing

6. **Automated Testing & Documentation**:
   - Automated unit tests with Vitest for pricing, shipping, coupons, and cryptographic tokens
   - Complete documentation suite with Mermaid diagrams in `docs/`

---

## 🛠️ Quick Start & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed
```bash
npx prisma db push
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

- **Administrator**:
  - Email: `admin@zeztypickles.com`
  - Password: `AdminPassword123!`
  - Portal: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Customer**:
  - Email: `customer@example.com`
  - Password: `Customer123!`

---

## 🧪 Testing & Validation

```bash
# Run automated tests
npm run test

# Type check
npx tsc --noEmit

# Production build
npm run build
```

---

## 📚 Documentation Deliverables

- [Architecture Specification](file:///docs/ARCHITECTURE.md)
- [User Journeys & Mermaid Workflows](file:///docs/USER_FLOWS.md)
- [Database Schema & ER Diagram](file:///docs/ER_DIAGRAM.md)
- [REST API Catalog](file:///docs/API_SPEC.md)
- [Payment Lifecycle](file:///docs/PAYMENT_FLOW.md)
- [Security Guidelines](file:///docs/SECURITY.md)
- [Testing Guide](file:///docs/TESTING.md)
- [Deployment Instructions](file:///docs/DEPLOYMENT.md)
