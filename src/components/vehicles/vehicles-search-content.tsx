"use client";

import { useMemo, useState } from "react";
import type { Vehicle } from "@prisma/client";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleCard } from "@/components/vehicles/vehicle-card";

interface VehiclesSearchContentProps {
  vehicles: Vehicle[];
  categories: string[];
}

function parseRangeKilometers(rangeText: string) {
  const match = rangeText.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function parseFilterNumber(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function VehiclesSearchContent({ vehicles, categories }: VehiclesSearchContentProps) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");

  // Pre-compute searchable text and numeric range values once per vehicle list update.
  const searchableVehicles = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        vehicle,
        searchableText: `${vehicle.name} ${vehicle.category} ${vehicle.shortTagline}`.toLowerCase(),
        rangeKm: parseRangeKilometers(vehicle.range),
      })),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const minPriceValue = parseFilterNumber(minPrice);
    const maxPriceValue = parseFilterNumber(maxPrice);
    const minRangeValue = parseFilterNumber(minRange);
    const maxRangeValue = parseFilterNumber(maxRange);

    return searchableVehicles
      .filter(({ vehicle, searchableText, rangeKm }) => {
        const textMatch =
          normalizedQuery.length === 0 ||
          searchableText.includes(normalizedQuery);

        const categoryMatch =
          selectedCategories.length === 0 || selectedCategories.includes(vehicle.category);

        // Convert stored minor units into major currency units for filter comparisons.
        const vehiclePriceDollars = vehicle.price / 100;
        const minPriceMatch = minPriceValue === null || vehiclePriceDollars >= minPriceValue;
        const maxPriceMatch = maxPriceValue === null || vehiclePriceDollars <= maxPriceValue;

        const minRangeMatch = minRangeValue === null || (rangeKm !== null && rangeKm >= minRangeValue);
        const maxRangeMatch = maxRangeValue === null || (rangeKm !== null && rangeKm <= maxRangeValue);

        return (
          textMatch &&
          categoryMatch &&
          minPriceMatch &&
          maxPriceMatch &&
          minRangeMatch &&
          maxRangeMatch
        );
      })
      .map(({ vehicle }) => vehicle);
  }, [query, selectedCategories, minPrice, maxPrice, minRange, maxRange, searchableVehicles]);

  function toggleCategory(category: string) {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((cat) => cat !== category)
        : [...currentCategories, category]
    );
  }

  function clearFilters() {
    setQuery("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRange("");
    setMaxRange("");
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="space-y-6 rounded-xl border border-border/50 bg-card p-5 shadow-sm">
        <div className="space-y-1.5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Search & Filters
          </p>
          <p className="text-sm text-muted-foreground">Find vehicles by type, range, and price.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="vehicle-search" className="text-sm font-medium text-foreground">
            Search vehicles
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="vehicle-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, type, or tagline"
              className="pl-9"
            />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">Type</legend>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">Price range (USD)</legend>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min"
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">Range (km)</legend>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={minRange}
              onChange={(event) => setMinRange(event.target.value)}
              placeholder="Min"
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={maxRange}
              onChange={(event) => setMaxRange(event.target.value)}
              placeholder="Max"
            />
          </div>
        </fieldset>

        <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>
          Clear filters
        </Button>
      </aside>

      <section className="space-y-5" aria-live="polite">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of{" "}
          <span className="font-semibold text-foreground">{vehicles.length}</span> vehicles
        </p>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/70 bg-card/60 p-10 text-center">
            <p className="text-base font-medium text-foreground">No matching vehicles found.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing the search text or widening your filters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
