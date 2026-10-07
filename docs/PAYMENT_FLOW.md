# Payment Integration & Lifecycle — Zezty Pickles

## 1. Sequence Diagram

```mermaid
sequenceDiagram
    actor Customer
    participant UI as Next.js Client
    participant Server as Server Route Handlers
    participant DB as Database (Prisma)
    participant Gateway as Razorpay

    Customer->>UI: Selects Payment Method & Clicks "Place Order"
    UI->>Server: POST /api/orders (items, address, method)
    Server->>DB: Check stock & fetch prices
    Server->>DB: Create Order with status PENDING_PAYMENT
    Server->>Gateway: Create order with amount in paise
    Gateway-->>Server: razorpay_order_id
    Server-->>UI: { orderId, razorpayOrder, isMockPayment }
    UI->>Gateway: Open Razorpay modal or trigger mock verification
    Gateway-->>UI: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    UI->>Server: POST /api/payments/verify
    Server->>Server: HMAC-SHA256 signature verification
    Server->>DB: In transaction: update Order to CONFIRMED & decrement stock
    Server-->>UI: { success: true, orderNumber }
    UI-->>Customer: Redirect to /checkout/success
```

## 2. Mock vs Live Mode
- When `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` contain `mock` or are blank, the payment adapter activates **Local Mock Mode**.
- In mock mode, developers can test checkout end-to-end without real financial credentials.
- When live Razorpay test or production keys (`rzp_test_...` / `rzp_live_...`) are provided, the system executes real API order creation and cryptographic signature checks.
