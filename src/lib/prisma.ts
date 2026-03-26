// Force refresh Prisma Client
import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }
  
  // PrismaMariaDb adapter requires mariadb:// protocol
  const url = new URL(connectionString)
  if (url.protocol === 'mysql:') {
    url.protocol = 'mariadb:'
  }
  const mariadbConnectionString = url.toString()
  
  const adapter = new PrismaMariaDb(mariadbConnectionString)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

