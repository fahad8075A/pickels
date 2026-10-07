import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Safe fallback for DATABASE_URL for PostgreSQL across serverless and hosting environments
const resolvedUrl =
  process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "" && !process.env.DATABASE_URL.startsWith("file:")
    ? process.env.DATABASE_URL
    : "postgresql://postgres:postgres@localhost:5432/zezty_pickles?schema=public";


export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
