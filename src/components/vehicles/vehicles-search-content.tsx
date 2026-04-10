'use client';

import { useState, useMemo } from 'react';
import { Vehicle } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { VehicleFilterSidebar } from '@/components/vehicles/vehicle-filter-sidebar';
import { Search, X } from 'lucide-react';

interface VehiclesSearchContentProps {
  /** All vehicles fetched from the database */
  vehicles: Vehicle[];
}

/* Client component that handles text search, category filters, and price range filtering */
export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  /* Derive min and max prices from the data */
  const { minPrice, maxPrice } = useMemo(() => {
    if (vehicles.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = vehicles.map((v) => v.price);
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [vehicles]);

  /* Initialize price range from vehicle data — lazy initializer runs once on mount */
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    if (vehicles.length === 0) return [0, 0];
    const prices = vehicles.map((v) => v.price);
    return [Math.min(...prices), Math.max(...prices)];
  });

  /* Derive unique categories from the vehicle data, sorted alphabetically */
  const categories = useMemo(() => {
    const unique = [...new Set(vehicles.map((v) => v.category))];
    return unique.sort();
  }, [vehicles]);

  /* Toggle a category in/out of the selected list */
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  /* Reset all filters to their default state */
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
  };

  /* Determine if any filters are currently active */
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategories.length > 0 ||
    priceRange[0] > minPrice ||
    priceRange[1] < maxPrice;

  /* Apply all filters: text search, category, and price range */
  const filteredVehicles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return vehicles.filter((vehicle) => {
      /* Text search — matches against name and tagline */
      if (query) {
        const matchesName = vehicle.name.toLowerCase().includes(query);
        const matchesTagline = vehicle.shortTagline.toLowerCase().includes(query);
        if (!matchesName && !matchesTagline) return false;
      }

      /* Category filter — vehicle must be in one of the selected categories */
      if (selectedCategories.length > 0 && !selectedCategories.includes(vehicle.category)) {
        return false;
      }

      /* Price range filter */
      if (vehicle.price < priceRange[0] || vehicle.price > priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [vehicles, searchQuery, selectedCategories, priceRange]);

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search vehicles by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11 rounded-lg border-border/60 bg-card shadow-sm focus-visible:ring-primary/30"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main content area: sidebar + vehicle grid */}
      <div className="flex gap-10">
        <VehicleFilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Vehicle grid + results counter */}
        <div className="flex-1 space-y-5">
          {/* Results counter */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredVehicles.length} of {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
          </p>

          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card rounded-xl">
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? 'No vehicles match your filters. Try adjusting your search or filters.'
                  : 'No vehicles found in the lineup yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
