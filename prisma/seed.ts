import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const vehicles = [
  {
    name: 'Tailspin Aero',
    slug: 'tailspin-aero',
    price: 4499900,
    shortTagline: 'Our flagship sedan — long range, exhilarating performance, and sleek design.',
    category: 'Sedan',
    range: '652 km',
    imageUrl: '/images/products/aero.png',
    isFeatured: true,
  },
  {
    name: 'Tailspin Terra',
    slug: 'tailspin-terra',
    price: 5299900,
    shortTagline: 'A full-size SUV with panoramic glass roof and room for the whole family.',
    category: 'SUV',
    range: '560 km',
    imageUrl: '/images/products/terra.png',
    isFeatured: true,
  },
  {
    name: 'Tailspin Ion',
    slug: 'tailspin-ion',
    price: 2799900,
    shortTagline: 'Compact, efficient, and perfect for the daily commute.',
    category: 'Compact',
    range: '417 km',
    imageUrl: '/images/products/ion.png',
    isFeatured: false,
  },
  {
    name: 'Tailspin Voyager',
    slug: 'tailspin-voyager',
    price: 6199900,
    shortTagline: 'The ultimate electric road-tripper with unmatched range and comfort.',
    category: 'Touring',
    range: '837 km',
    imageUrl: '/images/products/voyager.png',
    isFeatured: true,
  },
  {
    name: 'Tailspin Pulse',
    slug: 'tailspin-pulse',
    price: 3499900,
    shortTagline: 'A spirited crossover that combines agility with everyday practicality.',
    category: 'Crossover',
    range: '499 km',
    imageUrl: '/images/products/pulse.png',
    isFeatured: false,
  },
  {
    name: 'Tailspin Apex',
    slug: 'tailspin-apex',
    price: 8999900,
    shortTagline: 'Pure electric supercar — 0 to 60 in 1.9 seconds, zero emissions.',
    category: 'Sports',
    range: '451 km',
    imageUrl: '/images/products/apex.png',
    isFeatured: false,
  },
];


async function main() {
  console.log('Start seeding ...');
  for (const vehicle of vehicles) {
    const result = await prisma.vehicle.upsert({
      where: { slug: vehicle.slug },
      update: vehicle,
      create: vehicle,
    });
    console.log(`Created vehicle with id: ${result.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
