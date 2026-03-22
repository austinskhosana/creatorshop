// Prisma 7 — connection URLs live here, not in schema.prisma
// DIRECT_URL is used for migrations (direct connection, port 5432)
// DATABASE_URL is passed to PrismaClient at runtime (pooled, port 6543)

/** @type {import('@prisma/config').PrismaConfig} */
module.exports = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL,
  },
};
