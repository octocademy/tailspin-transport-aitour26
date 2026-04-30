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
    description: 'The Tailspin Aero redefines what a sedan can be. With its aerodynamic silhouette, whisper-quiet cabin, and class-leading range, it delivers a driving experience that is both thrilling and refined. Advanced autopilot capabilities and a minimalist interior put you in control of the future.',
    topSpeed: '250 km/h',
    acceleration: '0–100 km/h in 3.1s',
    power: '380 kW',
    drivetrain: 'Dual Motor AWD',
    seats: 5,
    battery: '100 kWh',
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
    description: 'The Tailspin Terra is built for families who refuse to compromise. A panoramic glass roof floods the cabin with natural light, while three rows of spacious seating keep everyone comfortable. Off-road capable and highway refined — Terra conquers every terrain with ease.',
    topSpeed: '210 km/h',
    acceleration: '0–100 km/h in 4.5s',
    power: '350 kW',
    drivetrain: 'Dual Motor AWD',
    seats: 7,
    battery: '110 kWh',
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
    description: 'The Tailspin Ion proves that going electric doesn\'t mean going without. Nimble in city traffic, efficient on the motorway, and packed with smart technology — Ion makes the daily commute something to look forward to. Its compact footprint hides a surprisingly spacious interior.',
    topSpeed: '195 km/h',
    acceleration: '0–100 km/h in 5.8s',
    power: '200 kW',
    drivetrain: 'Single Motor RWD',
    seats: 5,
    battery: '65 kWh',
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
    description: 'Born for the open road, the Tailspin Voyager delivers an industry-leading range that eliminates range anxiety entirely. Luxurious reclining seats, a premium sound system, and adaptive air suspension turn every long drive into a first-class experience. Adventure awaits — no compromises.',
    topSpeed: '220 km/h',
    acceleration: '0–100 km/h in 3.8s',
    power: '400 kW',
    drivetrain: 'Tri Motor AWD',
    seats: 5,
    battery: '140 kWh',
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
    description: 'The Tailspin Pulse strikes the perfect balance between sporty handling and everyday versatility. Its raised ride height gives you a commanding view of the road, while the agile chassis keeps every corner engaging. With generous cargo space and rapid charging, Pulse fits your life — not the other way around.',
    topSpeed: '215 km/h',
    acceleration: '0–100 km/h in 4.2s',
    power: '310 kW',
    drivetrain: 'Dual Motor AWD',
    seats: 5,
    battery: '82 kWh',
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
    description: 'The Tailspin Apex is engineering artistry in motion. With blistering acceleration, track-honed aerodynamics, and a carbon-fibre monocoque chassis, it delivers supercar thrills with zero tailpipe emissions. Limited to 500 units worldwide — this is automotive history, electrified.',
    topSpeed: '330 km/h',
    acceleration: '0–100 km/h in 1.9s',
    power: '750 kW',
    drivetrain: 'Tri Motor AWD',
    seats: 2,
    battery: '95 kWh',
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
