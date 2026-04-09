import { prisma } from '@/lib/prisma';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { MaxWidthWrapper } from '@/components/shared/max-width-wrapper';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'All Vehicles | Tailspin Transport',
  description: 'Browse our lineup of premium electric vehicles — from compact commuters to high-performance supercars.',
};

export default async function VehiclesPage() {
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
            ))}
          </div>
          
          {vehicles.length === 0 && (
            <div className="text-center py-16 glass-card rounded-xl">
              <p className="text-muted-foreground">No vehicles found in the lineup yet.</p>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
