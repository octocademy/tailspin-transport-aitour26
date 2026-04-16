'use client';

import { useMemo, useState } from 'react';
import { Vehicle } from '@prisma/client';
import { Search, Sparkles, X } from 'lucide-react';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VehiclesSearchContentProps {
  vehicles: Vehicle[];
}

function parseUsdToCents(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsedValue = Number.parseFloat(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return Math.round(parsedValue * 100);
}

function matchesVehicleText(vehicle: Vehicle, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const searchIndex = [vehicle.name, vehicle.category, vehicle.shortTagline, vehicle.range]
    .filter((value): value is string => Boolean(value))
    .join(' ')
    .toLowerCase();
  return searchIndex.includes(query.toLowerCase().trim());
}

export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minUsdPrice, setMinUsdPrice] = useState('');
  const [maxUsdPrice, setMaxUsdPrice] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(vehicles.map((vehicle) => vehicle.category))).sort((a, b) => a.localeCompare(b)),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    const minPriceInCents = parseUsdToCents(minUsdPrice);
    const maxPriceInCents = parseUsdToCents(maxUsdPrice);

    return vehicles.filter((vehicle) => {
      const matchesText = matchesVehicleText(vehicle, query);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(vehicle.category);
      const matchesMinPrice = minPriceInCents === null || vehicle.price >= minPriceInCents;
      const matchesMaxPrice = maxPriceInCents === null || vehicle.price <= maxPriceInCents;

      return matchesText && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [maxUsdPrice, minUsdPrice, query, selectedCategories, vehicles]);

  function toggleCategory(category: string) {
    setSelectedCategories((currentSelectedCategories) =>
      currentSelectedCategories.includes(category)
        ? currentSelectedCategories.filter((selectedCategory) => selectedCategory !== category)
        : [...currentSelectedCategories, category]
    );
  }

  function clearFilters() {
    setQuery('');
    setSelectedCategories([]);
    setMinUsdPrice('');
    setMaxUsdPrice('');
  }

  return (
    <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
      <aside className="glass-card rounded-xl border border-border/60 p-5 space-y-6 sticky top-24">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">Search</h2>
          <div className="relative">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="vehicle-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, type, tagline, range"
              className="pl-9"
              aria-label="Search vehicles by name, type, tagline, or range"
            />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Instant local search
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">Type</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">Price range (USD)</h3>
          <div className="space-y-2">
            <Input
              type="number"
              min="0"
              step="1000"
              value={minUsdPrice}
              onChange={(event) => setMinUsdPrice(event.target.value)}
              placeholder="Min"
              aria-label="Minimum price in USD"
            />
            <Input
              type="number"
              min="0"
              step="1000"
              value={maxUsdPrice}
              onChange={(event) => setMaxUsdPrice(event.target.value)}
              placeholder="Max"
              aria-label="Maximum price in USD"
            />
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      </aside>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of{' '}
          <span className="font-semibold text-foreground">{vehicles.length}</span> vehicles
        </p>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl border border-border/60">
            <p className="text-muted-foreground">
              No vehicles matched your filters. Try clearing filters or broadening your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
