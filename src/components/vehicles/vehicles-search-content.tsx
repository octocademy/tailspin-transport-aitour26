'use client';

import { useState, useMemo } from 'react';
import { Vehicle } from '@prisma/client';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface VehiclesSearchContentProps {
  vehicles: Vehicle[];
}

/**
 * Client-side search and filter UI for the vehicles catalogue.
 *
 * Supports:
 *   - Text search across name, category, and shortTagline (case-insensitive substring match)
 *   - Checkbox category filter sidebar
 *   - Min / max price range filter (user enters whole-dollar amounts; prices are stored as cents)
 *
 * Lazy state initializers are used throughout to satisfy the React Compiler's
 * `react-hooks/set-state-in-effect` rule (no derived state set inside useEffect).
 */
export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  /* ── State ── */
  const [searchQuery, setSearchQuery] = useState('');
  /* Set of currently-checked categories; lazy init avoids object re-creation on every render */
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => new Set());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  /* ── Derived data ── */

  /** Sorted list of unique categories derived from the current vehicle dataset */
  const categories = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.category))].sort(),
    [vehicles],
  );

  /** Price displayed in the sidebar helpers (min/max of full catalogue) */
  const cataloguePriceRange = useMemo(() => {
    if (vehicles.length === 0) return { min: 0, max: 0 };
    const prices = vehicles.map((vehicle) => vehicle.price);
    return {
      min: Math.min(...prices) / 100,
      max: Math.max(...prices) / 100,
    };
  }, [vehicles]);

  /** Vehicles that pass all active filters */
  const filteredVehicles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const minCents = minPrice !== '' ? parseFloat(minPrice) * 100 : null;
    const maxCents = maxPrice !== '' ? parseFloat(maxPrice) * 100 : null;

    return vehicles.filter((vehicle) => {
      /* Text search — name, category, tagline */
      if (query) {
        const haystack = `${vehicle.name} ${vehicle.category} ${vehicle.shortTagline}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      /* Category filter — only applied when at least one box is checked */
      if (selectedCategories.size > 0 && !selectedCategories.has(vehicle.category)) {
        return false;
      }

      /* Price range — skip if the value is blank or not a valid number */
      if (minCents !== null && !isNaN(minCents) && vehicle.price < minCents) return false;
      if (maxCents !== null && !isNaN(maxCents) && vehicle.price > maxCents) return false;

      return true;
    });
  }, [vehicles, searchQuery, selectedCategories, minPrice, maxPrice]);

  /* ── Helpers ── */

  const hasActiveFilters =
    searchQuery !== '' || selectedCategories.size > 0 || minPrice !== '' || maxPrice !== '';

  /** Toggle a single category in the selection set */
  function toggleCategory(category: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  /** Reset all filters to their default (empty) state */
  function clearFilters() {
    setSearchQuery('');
    setSelectedCategories(new Set());
    setMinPrice('');
    setMaxPrice('');
  }

  /* ── Render ── */
  return (
    <div className="flex gap-8 items-start">
      {/* ════════════════════ Sidebar ════════════════════ */}
      <aside className="w-60 flex-shrink-0 space-y-6 sticky top-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* ── Category checkboxes ── */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </p>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Price range ── */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Price (USD)
          </p>
          <p className="text-xs text-muted-foreground/70">
            ${Math.round(cataloguePriceRange.min).toLocaleString()} –{' '}
            ${Math.round(cataloguePriceRange.max).toLocaleString()}
          </p>
          <div className="space-y-2">
            {/* Min price */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                $
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="pl-7 text-sm"
                min={0}
                aria-label="Minimum price in dollars"
              />
            </div>
            {/* Max price */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                $
              </span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-7 text-sm"
                min={0}
                aria-label="Maximum price in dollars"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════ Main content ════════════════════ */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by name, type, or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 text-sm"
            aria-label="Search vehicles"
          />
        </div>

        {/* Results counter */}
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of{' '}
          {vehicles.length} vehicles
        </p>

        {/* Vehicle grid or empty state */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-3 gap-7">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <p className="text-muted-foreground">No vehicles match your search.</p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="mt-3 text-primary hover:text-primary/80"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
