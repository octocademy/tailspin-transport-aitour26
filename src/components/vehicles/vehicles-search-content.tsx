'use client';

import { useMemo, useState } from 'react';
import type { Vehicle } from '@prisma/client';
import { Search, SlidersHorizontal } from 'lucide-react';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface VehiclesSearchContentProps {
  vehicles: Vehicle[];
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseRangeKm(rangeValue: string): number | null {
  const match = rangeValue.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRange, setMinRange] = useState('');
  const [maxRange, setMaxRange] = useState('');

  const categories = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.category))].sort((a, b) => a.localeCompare(b)),
    [vehicles],
  );

  const filteredVehicles = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const minPriceValue = parseOptionalNumber(minPrice);
    const maxPriceValue = parseOptionalNumber(maxPrice);
    const minRangeValue = parseOptionalNumber(minRange);
    const maxRangeValue = parseOptionalNumber(maxRange);

    return vehicles.filter((vehicle) => {
      const vehiclePriceUsd = vehicle.price / 100;
      const vehicleRangeKm = parseRangeKm(vehicle.range);
      const searchableText = [vehicle.name, vehicle.category, vehicle.shortTagline, vehicle.range]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !normalizedSearchTerm || searchableText.includes(normalizedSearchTerm);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(vehicle.category);
      const matchesMinPrice = minPriceValue === null || vehiclePriceUsd >= minPriceValue;
      const matchesMaxPrice = maxPriceValue === null || vehiclePriceUsd <= maxPriceValue;
      const matchesMinRange =
        minRangeValue === null || (vehicleRangeKm !== null && vehicleRangeKm >= minRangeValue);
      const matchesMaxRange =
        maxRangeValue === null || (vehicleRangeKm !== null && vehicleRangeKm <= maxRangeValue);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinRange &&
        matchesMaxRange
      );
    });
  }, [maxPrice, maxRange, minPrice, minRange, searchTerm, selectedCategories, vehicles]);

  function toggleCategory(category: string) {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((existingCategory) => existingCategory !== category)
        : [...previous, category],
    );
  }

  function clearFilters() {
    setSearchTerm('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setMinRange('');
    setMaxRange('');
  }

  return (
    <section className="grid grid-cols-[290px_1fr] gap-8">
      <aside className="h-fit rounded-xl border border-border/50 bg-card/60 p-5 shadow-cloud">
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Search &amp; Filters
          </p>
          <p className="text-sm text-muted-foreground">Use text, type, price, and range to narrow the lineup.</p>
        </div>

        <div className="mt-5 space-y-5">
          <div className="space-y-2">
            <label htmlFor="vehicles-search" className="text-sm font-medium text-foreground">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="vehicles-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Name, type, tagline, range..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Vehicle Type</p>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Price Range (USD)</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                min={0}
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="Min"
              />
              <Input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="Max"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Driving Range (km)</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                min={0}
                value={minRange}
                onChange={(event) => setMinRange(event.target.value)}
                placeholder="Min"
              />
              <Input
                type="number"
                min={0}
                value={maxRange}
                onChange={(event) => setMaxRange(event.target.value)}
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <Button variant="outline" className="mt-6 w-full" onClick={clearFilters}>
          Clear filters
        </Button>
      </aside>

      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of{' '}
          <span className="font-semibold text-foreground">{vehicles.length}</span> vehicles
        </p>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-3 gap-7">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-card/60 py-16 text-center shadow-cloud">
            <p className="text-muted-foreground">
              No vehicles match these filters yet. Try widening the search range.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
