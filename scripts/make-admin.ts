import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Please provide an email address: npx tsx scripts/make-admin.ts user@email.com')
    process.exit(1)
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }
  
  const url = new URL(connectionString)
  if (url.protocol === 'mysql:') {
    url.protocol = 'mariadb:'
  }
  const mariadbConnectionString = url.toString()
  const adapter = new PrismaMariaDb(mariadbConnectionString)
  const prisma = new PrismaClient({ adapter })

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    console.log(`Successfully promoted ${user.email} to ADMIN`)
  } catch (error) {
    console.error(`Error: User with email ${email} not found or database error.`)
  } finally {
    await prisma.$disconnect()
  }
}

main()
