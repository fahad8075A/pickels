# Entity Relationship Diagram — Zezty Pickles

This document outlines the database entities, constraints, and relationships powering the Zezty Pickles e-commerce platform via Prisma ORM and PostgreSQL / SQLite.

```mermaid
erDiagram
    USER ||--o{ ADDRESS : "has many"
    USER ||--o{ ORDER : "places"
    USER ||--o{ REVIEW : "writes"
    
    CATEGORY ||--o{ PRODUCT : "contains"
    
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    PRODUCT ||--o{ REVIEW : "reviewed in"
    
    ORDER ||--|{ ORDER_ITEM : "contains"
    
    COUPON ||--o{ ORDER : "applied to"

    USER {
        string id PK
        string email UK
        string name
        string passwordHash
        string phone
        string role "CUSTOMER | ADMIN"
        datetime createdAt
        datetime updatedAt
    }

    ADDRESS {
        string id PK
        string userId FK
        string fullName
        string phone
        string addressLine
        string city
        string state
        string postalCode
        boolean isDefault
        datetime createdAt
    }

    CATEGORY {
        string id PK
        string name
        string slug UK
        string description
        string image
        datetime createdAt
    }

    PRODUCT {
        string id PK
        string name
        string slug UK
        string shortDescription
        string fullDescription
        string sku UK
        string categoryId FK
        int price
        int originalPrice
        string image
        string ingredients
        string weight
        int stock
        boolean isFeatured
        boolean isBestseller
        boolean isPublished
        datetime createdAt
        datetime updatedAt
    }

    ORDER {
        string id PK
        string orderNumber UK
        string userId FK
        string guestEmail
        string guestName
        string guestPhone
        string shippingAddress
        int subtotal
        int discount
        int shippingFee
        int total
        string status "PENDING_PAYMENT | CONFIRMED | PROCESSING | PACKED | SHIPPED | DELIVERED | CANCELLED"
        string paymentMethod "COD | RAZORPAY"
        string paymentStatus "PENDING | PAID | FAILED | REFUNDED"
        string razorpayOrderId
        string razorpayPaymentId
        string trackingNumber
        string courierName
        string notes
        datetime createdAt
        datetime updatedAt
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId FK
        string productName
        string productImage
        int price
        int quantity
        int total
    }

    COUPON {
        string id PK
        string code UK
        string discountType "PERCENTAGE | FIXED"
        int discountValue
        int minOrderAmount
        int maxDiscount
        int maxUses
        int usedCount
        boolean isActive
        datetime expiresAt
        datetime createdAt
    }

    REVIEW {
        string id PK
        string productId FK
        string userId FK
        string userName
        string userAvatar
        int rating
        string comment
        boolean isApproved
        boolean isVerifiedPurchase
        datetime createdAt
    }

    CONTACT_MESSAGE {
        string id PK
        string name
        string email
        string phone
        string subject
        string message
        boolean isRead
        datetime createdAt
    }

    NEWSLETTER_SUBSCRIBER {
        string id PK
        string email UK
        boolean isActive
        datetime createdAt
    }

    AUDIT_LOG {
        string id PK
        string action
        string actorEmail
        string details
        datetime createdAt
    }
```

## Modeling Rules & Constraints
- **Money Values**: Handled in integer INR Rupees or Paise to prevent IEEE 754 floating point arithmetic issues.
- **Snapshot Pricing**: `OrderItem` stores the product name, image, and price at the time of purchase so historical receipts are immutable even when catalog prices change.
- **Auditing**: Administrative stock changes, order status updates, and product creations write non-sensitive metadata entries to `AuditLog`.
