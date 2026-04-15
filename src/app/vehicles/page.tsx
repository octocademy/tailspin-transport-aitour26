import { prisma } from '@/lib/prisma';
import { MaxWidthWrapper } from '@/components/shared/max-width-wrapper';
import { VehiclesSearchContent } from '@/components/vehicles/vehicles-search-content';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'All Vehicles | Tailspin Transport',
  description: 'Browse our lineup of premium electric vehicles — from compact commuters to high-performance supercars.',
};

export default async function VehiclesPage() {
  /* Fetch all vehicles server-side; pass to the client search/filter component */
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-14">
      <MaxWidthWrapper>
        <div className="flex flex-col gap-10">
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-primary font-medium tracking-[0.15em] uppercase text-xs">
              <Zap className="h-3.5 w-3.5" />
              Our Lineup
            </p>
            <h1 className="text-4xl font-[family-name:var(--font-playfair)] font-bold tracking-tight text-foreground">
              All Vehicles
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Explore our full range of electric vehicles. From the efficient Ion to the
              breathtaking Apex supercar — there&apos;s an EV for every journey.
            </p>
          </div>

          {/* Divider */}
          <div className="sparkle-divider">⚡ ⚡ ⚡</div>

          {/* Search bar + sidebar filters + vehicle grid */}
          <VehiclesSearchContent vehicles={vehicles} />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
