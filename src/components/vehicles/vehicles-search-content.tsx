'use client';

import { useState, useMemo } from 'react';
import { Vehicle } from '@prisma/client';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { VehiclesFilterSidebar, FilterState, defaultFilters, parseRangeKm } from '@/components/vehicles/vehicles-filter-sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface VehiclesSearchContentProps {
  vehicles: Vehicle[];
}

/**
 * Client component that owns all search and filter state for the All Vehicles
 * page. Filters combine with AND logic — a vehicle must match every active
 * filter to appear in results.
 *
 * Prices are stored in pence (GBP); price filter inputs accept pounds (£).
 * Range is stored as a formatted string (e.g. "480 km"); the range filter
 * parses the numeric km value for comparison.
 */
export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  /* Lazy initialiser avoids calling setState in an effect (React Compiler rule) */
  const [filters, setFilters] = useState<FilterState>(() => defaultFilters);

  /* Derived: filtered vehicle list — recomputes only when filters or vehicles change */
  const filteredVehicles = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();
    const priceMinPence = filters.priceMin !== '' ? parseFloat(filters.priceMin) * 100 : null;
    const priceMaxPence = filters.priceMax !== '' ? parseFloat(filters.priceMax) * 100 : null;
    const rangeMinKm = filters.rangeMin !== '' ? parseFloat(filters.rangeMin) : null;
    const rangeMaxKm = filters.rangeMax !== '' ? parseFloat(filters.rangeMax) : null;

    return vehicles.filter((vehicle) => {
      /* Text search — searches name, category, and tagline */
      if (query) {
        const haystack = [vehicle.name, vehicle.category, vehicle.shortTagline]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      /* Category filter */
      if (
        filters.selectedCategories.length > 0 &&
        !filters.selectedCategories.includes(vehicle.category)
      ) {
        return false;
      }

      /* Price filter — price is stored in pence; inputs are in GBP (£) */
      if (priceMinPence !== null && vehicle.price < priceMinPence) return false;
      if (priceMaxPence !== null && vehicle.price > priceMaxPence) return false;

      /* Range filter — range is a formatted string like "480 km"; parse km value */
      const vehicleRangeKm = parseRangeKm(vehicle.range);
      if (rangeMinKm !== null && vehicleRangeKm < rangeMinKm) return false;
      if (rangeMaxKm !== null && vehicleRangeKm > rangeMaxKm) return false;

      return true;
    });
  }, [vehicles, filters]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search bar — full width above the sidebar+grid layout */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search vehicles by name, category, or description…"
          value={filters.searchQuery}
          onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
          className="pl-10 h-11 text-sm bg-card border-border/60 focus-visible:ring-primary/30"
        />
      </div>

      {/* Sidebar + vehicle grid */}
      <div className="flex gap-8 items-start">
        {/* Filter sidebar */}
        <VehiclesFilterSidebar
          allVehicles={vehicles}
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredVehicles.length}
        />

        {/* Vehicle grid */}
        <div className="flex-1 min-w-0">
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card rounded-xl border border-border/30">
              <p className="text-muted-foreground text-sm">
                No vehicles match your search. Try adjusting the filters or search term.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
