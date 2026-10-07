import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Safe fallback for DATABASE_URL across serverless and hosting environments
const defaultDbPath = path.join(process.cwd(), "prisma", "dev.db");
const resolvedUrl =
  process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== ""
    ? process.env.DATABASE_URL
    : `file:${defaultDbPath}`;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedUrl;
}

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
