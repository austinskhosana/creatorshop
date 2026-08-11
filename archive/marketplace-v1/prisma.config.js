// Prisma 7 — connection URLs live here, not in schema.prisma
// DIRECT_URL is used for migrations (direct connection, port 5432)
// DATABASE_URL is passed to PrismaClient at runtime (pooled, port 6543)

const fs = require("fs");
const path = require("path");

// Load .env and .env.local manually — Prisma evaluates this before Next.js loads env
[".env", ".env.local"].forEach((file) => {
  const envFile = path.join(__dirname, file);
  if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, "utf8")
      .split("\n")
      .forEach((line) => {
        const match = line.match(/^([^=]+)=(['"]?)(.*)\2\s*$/);
        if (match) process.env[match[1].trim()] = match[3];
      });
  }
});

/** @type {import('@prisma/config').PrismaConfig} */
module.exports = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL,
  },
};
