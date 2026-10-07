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
### Deploying to Render (render.com)
The repository contains a native `render.yaml` blueprint.

1. **New Web Service**:
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **New +** -> **Blueprint** (or **Web Service**)
   - Connect your GitHub repository `fahad8075A/pickels`
2. **Build & Start Commands**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `file:./dev.db` (or Render PostgreSQL internal database URL)
   - `NEXT_PUBLIC_APP_URL`: Your Render service URL (e.g., `https://zezty-pickles.onrender.com`)
   - `JWT_SECRET`: Random 32+ character string
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
4. **Deploy**:
   - Click **Apply** or **Create Web Service**.
   - Render will build and deploy the Next.js application automatically on every git push!

