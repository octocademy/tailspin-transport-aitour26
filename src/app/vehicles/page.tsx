import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { MaxWidthWrapper } from '@/components/shared/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'All Vehicles | Tailspin Transport',
  description: 'Browse our lineup of premium electric vehicles — from compact commuters to high-performance supercars.',
};

interface VehiclesPageProps {
  searchParams?: Promise<{
    range?: string;
    type?: string;
  }>;
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedRange = resolvedSearchParams?.range?.trim() ?? '';
  const selectedType = resolvedSearchParams?.type?.trim() ?? '';
  const hasActiveFilters = Boolean(selectedRange || selectedType);

  const categoryOptions = await prisma.vehicle.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(selectedRange ? { range: { contains: selectedRange } } : {}),
      ...(selectedType ? { category: selectedType } : {}),
    },
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

          <form className="grid grid-cols-[minmax(0,1fr)_220px_auto_auto] items-end gap-3 rounded-xl border border-border/40 bg-card/60 p-4">
            <div className="space-y-1">
              <label htmlFor="range" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Search by range
              </label>
              <Input
                id="range"
                name="range"
                defaultValue={selectedRange}
                placeholder='Try "560 km"'
                aria-label="Search vehicles by range"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="type" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Type
              </label>
              <select
                id="type"
                name="type"
                defaultValue={selectedType}
                aria-label="Filter vehicles by type"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">All types</option>
                {categoryOptions.map(({ category }) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit">Search</Button>
            <Button variant="outline" asChild>
              <Link href="/vehicles">Clear</Link>
            </Button>
          </form>
          
          {/* Divider */}
          <div className="sparkle-divider">⚡ ⚡ ⚡</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
            ))}
          </div>
          
          {vehicles.length === 0 && (
            <div className="text-center py-16 glass-card rounded-xl">
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? 'No vehicles matched your range and type filters.'
                  : 'No vehicles found in the lineup yet.'}
              </p>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
