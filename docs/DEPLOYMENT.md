# Deployment & Hosting Guide — Zezty Pickles

## 1. Hosting on Vercel / Railway / AWS
Zezty Pickles is ready for standard containerized or serverless deployment.

### Production Environment Variables
Set the following environment variables in your hosting dashboard:
```dotenv
DATABASE_URL="postgresql://user:password@host:5432/zezty_pickles?sslmode=require"
AUTH_SECRET="your-generated-32-character-secret"
NEXT_PUBLIC_APP_URL="https://zeztypickles.com"

ADMIN_SEED_EMAIL="admin@zeztypickles.com"
ADMIN_SEED_PASSWORD="AStrongUniquePassword!"

RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."
```

### Switching to PostgreSQL for Production
1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Generate and deploy migrations:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```
3. Build the application:
   ```bash
   npm run build
   npm run start
   ```
