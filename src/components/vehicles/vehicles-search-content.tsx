'use client';

import { useMemo, useState } from 'react';
import type { Vehicle } from '@prisma/client';
import { Search, Sparkles } from 'lucide-react';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VehiclesSearchContentProps {
  vehicles: Vehicle[];
}

interface SemanticSearchResult {
  id?: string;
  slug?: string;
}

/* Handles local text/category/price filtering and optional semantic search enhancement */
export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [semanticIds, setSemanticIds] = useState<string[]>([]);
  const [semanticError, setSemanticError] = useState('');
  const [isSemanticLoading, setIsSemanticLoading] = useState(false);
  const [hasAttemptedSemanticSearch, setHasAttemptedSemanticSearch] = useState(false);

  const categories = useMemo(
    () =>
      [...new Set(vehicles.map((vehicle) => vehicle.category))].sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' }),
      ),
    [vehicles],
  );

  const slugToIdMap = useMemo(
    () => new Map(vehicles.map((vehicle) => [vehicle.slug, vehicle.id])),
    [vehicles],
  );

  const filteredVehicles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const parsedMinPrice = Number(minPrice);
    const parsedMaxPrice = Number(maxPrice);
    const hasMinPrice = minPrice.trim() !== '' && !Number.isNaN(parsedMinPrice);
    const hasMaxPrice = maxPrice.trim() !== '' && !Number.isNaN(parsedMaxPrice);
    const selectedCategorySet = new Set(selectedCategories);
    const semanticIdSet = new Set(semanticIds);

    const localMatches = vehicles.filter((vehicle) => {
      const searchableText = `${vehicle.name} ${vehicle.category} ${vehicle.shortTagline} ${vehicle.range}`.toLowerCase();
      const matchesText = normalizedQuery === '' || searchableText.includes(normalizedQuery);
      const matchesCategory =
        selectedCategorySet.size === 0 || selectedCategorySet.has(vehicle.category);
      // Prices are stored in minor units (cents/pence), so divide by 100 for user-entered major units.
      const vehiclePriceInDollars = vehicle.price / 100;
      const matchesMinPrice = !hasMinPrice || vehiclePriceInDollars >= parsedMinPrice;
      const matchesMaxPrice = !hasMaxPrice || vehiclePriceInDollars <= parsedMaxPrice;

      return matchesText && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    if (semanticIdSet.size === 0) {
      return localMatches;
    }

    const semanticMatches = localMatches.filter((vehicle) => semanticIdSet.has(vehicle.id));
    const nonSemanticMatches = localMatches.filter((vehicle) => !semanticIdSet.has(vehicle.id));
    return [...semanticMatches, ...nonSemanticMatches];
  }, [maxPrice, minPrice, query, selectedCategories, semanticIds, vehicles]);

  function toggleCategory(category: string) {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((value) => value !== category)
        : [...currentCategories, category],
    );
  }

  function clearFilters() {
    setQuery('');
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSemanticIds([]);
    setSemanticError('');
    setHasAttemptedSemanticSearch(false);
  }

  async function runSemanticSearch() {
    const trimmedQuery = query.trim();
    setHasAttemptedSemanticSearch(true);
    if (!trimmedQuery) {
      setSemanticIds([]);
      setSemanticError('');
      return;
    }

    setIsSemanticLoading(true);
    setSemanticError('');

    try {
      const response = await fetch(`/api/vehicles/semantic-search?q=${encodeURIComponent(trimmedQuery)}`);
      const payload = (await response.json()) as {
        matches?: SemanticSearchResult[];
        message?: string;
      };

      if (!response.ok || !payload.matches) {
        setSemanticIds([]);
        setSemanticError(payload.message ?? 'AI search is unavailable, showing local results.');
        return;
      }

      const resolvedIds = payload.matches
        .map((result) => result.id ?? (result.slug ? slugToIdMap.get(result.slug) : undefined))
        .filter((value): value is string => Boolean(value));

      setSemanticIds(resolvedIds);
      if (resolvedIds.length === 0) {
        setSemanticError('No AI-ranked matches found, showing local results.');
      }
    } catch {
      setSemanticIds([]);
      setSemanticError('AI search is unavailable, showing local results.');
    } finally {
      setIsSemanticLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-8 items-start">
      <aside className="glass-card rounded-xl border border-border/50 p-5 space-y-5 sticky top-24">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Filter Vehicles</h2>
          <p className="text-xs text-muted-foreground">
            Narrow by category and price range.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Categories</p>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 accent-primary"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Price (USD)</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>
          Clear filters
        </Button>
      </aside>

      <div className="space-y-5">
        <div className="glass-card rounded-xl border border-border/50 p-5 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search by name, category, tagline, or range..."
                className="pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={runSemanticSearch}
              disabled={isSemanticLoading}
            >
              <Sparkles className="h-4 w-4" />
              {isSemanticLoading ? 'Searching...' : 'AI Search'}
            </Button>
          </div>

          <div className="flex items-center justify-between gap-2 text-sm">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of{' '}
              <span className="font-semibold text-foreground">{vehicles.length}</span> vehicles
            </p>
            {hasAttemptedSemanticSearch && (
              <p className="text-xs text-muted-foreground">Local search always serves as the fallback.</p>
            )}
          </div>

          {semanticError && (
            <p className="text-xs text-muted-foreground" role="status" aria-live="polite">
              {semanticError}
            </p>
          )}
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl border border-border/50">
            <p className="text-muted-foreground">No vehicles match your current search and filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
