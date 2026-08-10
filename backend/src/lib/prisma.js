const { PrismaClient } = require('@prisma/client');

// Prevent multiple PrismaClient instances in dev (nodemon hot-reload) from
// exhausting the connection pool.
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
