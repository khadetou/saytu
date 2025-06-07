import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default company
  const defaultCompany = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Ma Société',
      email: 'contact@masociete.com',
      phone: '+33 1 23 45 67 89',
      website: 'https://masociete.com',
      address: '123 Rue de la Paix',
      city: 'Paris',
      country: 'France',
      isActive: true,
    },
  });

  console.log('✅ Default company created:', defaultCompany);

  // Create some sample todo categories
  const categories = [
    'Général',
    'Développement',
    'Marketing',
    'Ventes',
    'Support',
  ];

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
