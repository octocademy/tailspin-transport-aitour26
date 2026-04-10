'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

/* USD currency formatter for price display */
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

interface VehicleFilterSidebarProps {
  /** All unique categories available for filtering */
  categories: string[];
  /** Currently selected category filters */
  selectedCategories: string[];
  /** Callback when a category checkbox is toggled */
  onCategoryChange: (category: string) => void;
  /** The absolute min price (in cents) across all vehicles */
  minPrice: number;
  /** The absolute max price (in cents) across all vehicles */
  maxPrice: number;
  /** Currently selected price range [min, max] in cents */
  priceRange: [number, number];
  /** Callback when the price slider changes */
  onPriceRangeChange: (range: [number, number]) => void;
  /** Callback to reset all filters */
  onClearFilters: () => void;
  /** Whether any filters are currently active */
  hasActiveFilters: boolean;
}

/* Sidebar panel with category checkboxes and price range slider */
export function VehicleFilterSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  minPrice,
  maxPrice,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
  hasActiveFilters,
}: VehicleFilterSidebarProps) {
  return (
    <aside className="w-64 shrink-0 space-y-8">
      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground gap-1.5 -ml-2"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters
        </Button>
      )}

      {/* Category filter section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Category
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2.5">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price range filter section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Price Range
        </h3>
        <div className="space-y-4 px-1">
          <Slider
            min={minPrice}
            max={maxPrice}
            step={100000}
            value={priceRange}
            onValueChange={(val) => onPriceRangeChange(val as [number, number])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{usdFormatter.format(priceRange[0] / 100)}</span>
            <span>{usdFormatter.format(priceRange[1] / 100)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
