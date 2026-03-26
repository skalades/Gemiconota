import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'

async function main() {
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

  // Create Test Products
  const products = [
    {
      name: 'Heritage Hoodie',
      buyPrice: 200000,
      sellPrice: 250000,
      description: 'Hoodie eksklusif dengan bordir logo Gemiconota.',
      stockType: 'READY' as const,
      stockCount: 50,
    },
    {
      name: 'Signature Bag',
      buyPrice: 150000,
      sellPrice: 185000,
      description: 'Tas selempang praktis untuk alumni aktif.',
      stockType: 'READY' as const,
      stockCount: 30,
    },
    {
      name: 'Tech Tee',
      buyPrice: 100000,
      sellPrice: 120000,
      description: 'Kaos bahan premium dengan desain minimalist.',
      stockType: 'READY' as const,
      stockCount: 100,
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, '-') }, // just a dummy unique id for seed
      update: {},
      create: {
        id: product.name.toLowerCase().replace(/\s+/g, '-'),
        ...product
      }
    })
  }

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminId = 'admin-user-id';
  await prisma.user.upsert({
    where: { email: 'admin@gemiconota.com' },
    update: { role: 'ADMIN' },
    create: {
      id: adminId,
      email: 'admin@gemiconota.com',
      name: 'Admin Gemiconota',
      password: hashedPassword,
      role: 'ADMIN',
      profile: {
        create: {
          id: 'admin-profile-id',
          graduationYear: 2010,
        }
      }
    }
  })

  console.log('Seed data created successfully with MariaDB adapter!')
  await prisma.$disconnect()
}

main().catch(console.error)
