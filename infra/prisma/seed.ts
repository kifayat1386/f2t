import { PrismaClient } from '@prisma/client'

// In a real app we would read this from the environment or use prisma.config.ts adapter
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

async function main() {
  console.log('Seeding database...')

  // 1. Create a Farm with PostGIS location
  const farm1 = await prisma.farm.create({
    data: {
      name: 'Bogra Premium Rice',
      ownerName: 'Rahim Ali',
      division: 'Rajshahi',
      district: 'Bogra',
      isVerified: true,
    },
  })

  // Add the PostGIS location manually via raw SQL
  await prisma.$executeRaw`
    UPDATE "Farm"
    SET "location" = ST_GeomFromText('POINT(89.3789 24.8481)', 4326)
    WHERE "id" = ${farm1.id};
  `

  // 2. Create Products and Variants
  const product1 = await prisma.product.create({
    data: {
      farmId: farm1.id,
      nameEn: 'Miniket Rice',
      nameBn: 'মিনিকেট চাল',
      basePriceP: 6500, // 65 BDT
      unit: 'kg',
      isOrganic: true,
      status: 'ACTIVE',
      variants: {
        create: [
          { nameEn: '5 KG Bag', nameBn: '৫ কেজি ব্যাগ', priceP: 32500, stock: 100 },
          { nameEn: '25 KG Sack', nameBn: '২৫ কেজি বস্তা', priceP: 160000, stock: 50 },
        ],
      },
    },
  })

  // 3. Create another Farm
  const farm2 = await prisma.farm.create({
    data: {
      name: 'Sylhet Spice Hub',
      ownerName: 'Kader Miah',
      division: 'Sylhet',
      district: 'Sylhet',
      isVerified: true,
    },
  })

  await prisma.$executeRaw`
    UPDATE "Farm"
    SET "location" = ST_GeomFromText('POINT(91.8800 24.8949)', 4326)
    WHERE "id" = ${farm2.id};
  `

  const product2 = await prisma.product.create({
    data: {
      farmId: farm2.id,
      nameEn: 'Turmeric Powder',
      nameBn: 'হলুদের গুঁড়া',
      basePriceP: 20000, // 200 BDT
      unit: 'kg',
      isOrganic: true,
      status: 'ACTIVE',
      variants: {
        create: [
          { nameEn: '250g Jar', nameBn: '২৫০ গ্রাম বয়াম', priceP: 5000, stock: 200 },
          { nameEn: '1 KG Pack', nameBn: '১ কেজি প্যাক', priceP: 19500, stock: 80 },
        ],
      },
    },
  })

  console.log('Seeding completed. ✅')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
