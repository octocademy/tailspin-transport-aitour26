'use client';

import { Vehicle } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

/**
 * Parses the numeric km value from a formatted range string like "480 km".
 * Returns 0 for invalid or empty strings.
 */
export function parseRangeKm(rangeStr: string): number {
  return parseInt(rangeStr, 10) || 0;
}

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  priceMin: string;
  priceMax: string;
  rangeMin: string;
  rangeMax: string;
}

export const defaultFilters: FilterState = {
  searchQuery: '',
  selectedCategories: [],
  priceMin: '',
  priceMax: '',
  rangeMin: '',
  rangeMax: '',
};

interface VehiclesFilterSidebarProps {
  allVehicles: Vehicle[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
}

/**
 * Sidebar panel with category checkboxes, range filter (km), and price range
 * filter (GBP). Prices are stored as Int in pence; the UI accepts/displays £.
 */
export function VehiclesFilterSidebar({
  allVehicles,
  filters,
  onFiltersChange,
  resultCount,
}: VehiclesFilterSidebarProps) {
  /* Derive unique, sorted categories from the full vehicle list */
  const categories = Array.from(
    new Set(allVehicles.map((v) => v.category))
  ).sort();

  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.selectedCategories.length > 0 ||
    filters.priceMin !== '' ||
    filters.priceMax !== '' ||
    filters.rangeMin !== '' ||
    filters.rangeMax !== '';

  function handleCategoryToggle(category: string) {
    const next = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    onFiltersChange({ ...filters, selectedCategories: next });
  }

  function handleReset() {
    onFiltersChange(defaultFilters);
  }

  return (
    <aside className="w-64 flex-shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{resultCount}</span> of{' '}
        <span className="font-semibold text-foreground">{allVehicles.length}</span> vehicles
      </p>

      {/* Category filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </h3>
        <div className="space-y-2">
          {categories.map((category) => {
            const checked = filters.selectedCategories.includes(category);
            return (
              <label
                key={category}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCategoryToggle(category)}
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {category}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price range filter (GBP) */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price (£)
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span>
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => onFiltersChange({ ...filters, priceMin: e.target.value })}
              className="pl-6 h-8 text-sm"
            />
          </div>
          <span className="text-muted-foreground text-xs">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span>
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => onFiltersChange({ ...filters, priceMax: e.target.value })}
              className="pl-6 h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Range filter (km) */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Range (km)
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.rangeMin}
            onChange={(e) => onFiltersChange({ ...filters, rangeMin: e.target.value })}
            className="h-8 text-sm"
          />
          <span className="text-muted-foreground text-xs">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.rangeMax}
            onChange={(e) => onFiltersChange({ ...filters, rangeMax: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
      </div>
    </aside>
  );
}
