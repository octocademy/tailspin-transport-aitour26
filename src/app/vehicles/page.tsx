import { prisma } from '@/lib/prisma';
import { parseVehicleRangeKm, searchVehicleIdsWithAzure } from '@/lib/vehicle-search';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { MaxWidthWrapper } from '@/components/shared/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Prisma } from '@prisma/client';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'All Vehicles | Tailspin Transport',
  description: 'Browse our lineup of premium electric vehicles — from compact commuters to high-performance supercars.',
};

interface VehiclesPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minRange?: string;
    maxRange?: string;
  }>;
}

function parsePriceInPence(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed * 100);
}

function parsePositiveNumber(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function normalizeBounds(min: number | null, max: number | null) {
  if (min !== null && max !== null && min > max) {
    return { min: max, max: min };
  }

  return { min, max };
}

function trimQuery(value?: string) {
  return value?.trim() ?? '';
}

function getSearchStatusMessage(query: string, usedAzure: boolean, azureResultCount: number) {
  if (!query) {
    return null;
  }

  if (usedAzure && azureResultCount > 0) {
    return 'Azure AI Search ranking is active.';
  }

  return 'Azure AI Search unavailable; using local search fallback.';
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const filters = await searchParams;
  const query = trimQuery(filters.q);
  const selectedCategory = filters.category?.trim() || 'all';
  const priceBounds = normalizeBounds(parsePriceInPence(filters.minPrice), parsePriceInPence(filters.maxPrice));
  const rangeBounds = normalizeBounds(parsePositiveNumber(filters.minRange), parsePositiveNumber(filters.maxRange));

  const categories = await prisma.vehicle.findMany({
    distinct: ['category'],
    select: { category: true },
    orderBy: { category: 'asc' },
  });
  const categoryOptions = categories.map((item) => item.category);

  const andFilters: Prisma.VehicleWhereInput[] = [];
  const { ids: azureResultIds, usedAzure } = await searchVehicleIdsWithAzure(query);

  if (query) {
    if (azureResultIds.length > 0) {
      andFilters.push({
        id: {
          in: azureResultIds,
        },
      });
    } else {
      andFilters.push({
        OR: [
          { name: { contains: query } },
          { shortTagline: { contains: query } },
          { category: { contains: query } },
          { range: { contains: query } },
        ],
      });
    }
  }

  if (selectedCategory !== 'all') {
    andFilters.push({ category: selectedCategory });
  }

  if (priceBounds.min !== null || priceBounds.max !== null) {
    andFilters.push({
      price: {
        ...(priceBounds.min !== null ? { gte: priceBounds.min } : {}),
        ...(priceBounds.max !== null ? { lte: priceBounds.max } : {}),
      },
    });
  }

  const where = andFilters.length > 0 ? { AND: andFilters } : undefined;

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    const rangeKm = parseVehicleRangeKm(vehicle.range);
    if (rangeKm === null) {
      return rangeBounds.min === null && rangeBounds.max === null;
    }

    if (rangeBounds.min !== null && rangeKm < rangeBounds.min) {
      return false;
    }

    if (rangeBounds.max !== null && rangeKm > rangeBounds.max) {
      return false;
    }

    return true;
  });

  if (query && azureResultIds.length > 0) {
    const positionById = new Map(azureResultIds.map((id, index) => [id, index]));
    filteredVehicles.sort((vehicleA, vehicleB) => {
      const firstRank = positionById.get(vehicleA.id) ?? Number.POSITIVE_INFINITY;
      const secondRank = positionById.get(vehicleB.id) ?? Number.POSITIVE_INFINITY;
      return firstRank - secondRank;
    });
  }

  const searchSummary = query
    ? `Showing ${filteredVehicles.length} result${filteredVehicles.length === 1 ? '' : 's'} for “${query}”.`
    : `Showing all ${filteredVehicles.length} vehicle${filteredVehicles.length === 1 ? '' : 's'}.`;
  const searchStatusMessage = getSearchStatusMessage(query, usedAzure, azureResultIds.length);
  const filterPanelClassName = 'rounded-xl border border-border/60 bg-card p-5 shadow-sm';

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

          <form className="grid gap-7 lg:grid-cols-[260px_1fr]">
            <aside className={`h-fit space-y-6 ${filterPanelClassName}`}>
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Type</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input type="radio" name="category" value="all" defaultChecked={selectedCategory === 'all'} />
                    All types
                  </label>
                  {categoryOptions.map((category) => (
                    <label key={category} className="flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        defaultChecked={selectedCategory === category}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Price (GBP)</h2>
                <div className="grid gap-2">
                  <label htmlFor="minPrice" className="text-xs font-medium text-muted-foreground">Min (£)</label>
                  <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={filters.minPrice ?? ''}
                    aria-label="Minimum price in GBP"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="maxPrice" className="text-xs font-medium text-muted-foreground">Max (£)</label>
                  <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={filters.maxPrice ?? ''}
                    aria-label="Maximum price in GBP"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Range (km)</h2>
                <div className="grid gap-2">
                  <label htmlFor="minRange" className="text-xs font-medium text-muted-foreground">Min</label>
                  <Input
                    id="minRange"
                    name="minRange"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={filters.minRange ?? ''}
                    aria-label="Minimum range in kilometers"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="maxRange" className="text-xs font-medium text-muted-foreground">Max</label>
                  <Input
                    id="maxRange"
                    name="maxRange"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={filters.maxRange ?? ''}
                    aria-label="Maximum range in kilometers"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Apply filters</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/vehicles">Clear</Link>
                </Button>
              </div>
            </aside>

            <div className="space-y-5">
              <div className={filterPanelClassName}>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[260px] flex-1 space-y-2">
                    <label htmlFor="q" className="text-sm font-medium text-foreground">
                      Search vehicles
                    </label>
                    <Input
                      id="q"
                      name="q"
                      defaultValue={query}
                      placeholder="Search by model, tagline, type, or range"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{searchSummary}</p>
                {searchStatusMessage && (
                  <p className="mt-1 text-xs text-muted-foreground">{searchStatusMessage}</p>
                )}
              </div>
            </div>
          </form>
          
          <section aria-labelledby="vehicles-results-heading" className="space-y-7">
            <h2 id="vehicles-results-heading" className="sr-only">Vehicle search results</h2>

            {/* Divider */}
            <div className="sparkle-divider">⚡ ⚡ ⚡</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-16 glass-card rounded-xl">
                <p className="text-muted-foreground">No vehicles matched your search and filters.</p>
              </div>
            )}
          </section>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
