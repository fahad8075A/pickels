# API Specification — Zezty Pickles

All endpoints use JSON payloads and standard HTTP status codes.

| Endpoint | Method | Auth | Role | Purpose |
|---|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Any | Customer registration |
| `/api/auth/login` | `POST` | Public | Any | Customer/Admin authentication |
| `/api/auth/logout` | `POST` | Public | Any | Clears session cookie |
| `/api/auth/me` | `GET` | Public | Any | Retrieves active session user |
| `/api/cart/validate` | `POST` | Public | Any | Revalidates cart items & coupons |
| `/api/orders` | `POST` | Public | Any | Submits guest/user order & creates payment |
| `/api/payments/verify` | `POST` | Public | Any | Verifies Razorpay HMAC signature |
| `/api/contact` | `POST` | Public | Any | Submits customer care message |
| `/api/newsletter` | `POST` | Public | Any | Subscribes email address |
| `/api/admin/stats` | `GET` | Cookie | ADMIN | Retrieves real database metrics |
| `/api/admin/orders` | `GET` | Cookie | ADMIN | Retrieves all orders |
| `/api/admin/orders` | `PATCH`| Cookie | ADMIN | Updates fulfillment status |
| `/api/admin/products`| `GET` | Public | Any | Retrieves catalog products |
| `/api/admin/products`| `POST`| Cookie | ADMIN | Creates new product |
| `/api/admin/products`| `PUT` | Cookie | ADMIN | Updates product or stock |
| `/api/admin/products`| `DELETE`|Cookie| ADMIN | Removes product |
