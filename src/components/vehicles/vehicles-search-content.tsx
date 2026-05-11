"use client";

import { useMemo, useRef, useState } from "react";
import type { Vehicle } from "@prisma/client";
import { Search, SlidersHorizontal } from "lucide-react";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildVehicleSearchableText } from "@/lib/vehicle-search";

interface VehiclesSearchContentProps {
  vehicles: Vehicle[];
}

interface SemanticSearchResponse {
  enhanced: boolean;
  orderedIds: string[];
}

/**
 * Client-side vehicle search and filtering panel for the /vehicles page.
 * Includes semantic ranking enhancement with automatic fallback to local filtering.
 */
export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rangeQuery, setRangeQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [semanticOrderedIds, setSemanticOrderedIds] = useState<string[]>([]);
  const [semanticState, setSemanticState] = useState<"idle" | "loading" | "enhanced" | "fallback">("idle");
  const requestCounterRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(vehicles.map((vehicle) => vehicle.category))).sort((a, b) => a.localeCompare(b)),
    [vehicles],
  );

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const normalizedRange = rangeQuery.trim().toLowerCase();
    const parsedMinPrice = minPrice === "" ? null : Number(minPrice);
    const parsedMaxPrice = maxPrice === "" ? null : Number(maxPrice);

    const locallyFilteredVehicles = vehicles.filter((vehicle) => {
      const searchableText = buildVehicleSearchableText(vehicle);
      const matchesText = normalizedSearch.length === 0 || searchableText.includes(normalizedSearch);
      const matchesRange = normalizedRange.length === 0 || vehicle.range.toLowerCase().includes(normalizedRange);
      const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(vehicle.category);

      const priceInGBP = vehicle.price / 100;
      const matchesMinPrice = parsedMinPrice === null || priceInGBP >= parsedMinPrice;
      const matchesMaxPrice = parsedMaxPrice === null || priceInGBP <= parsedMaxPrice;

      return matchesText && matchesRange && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    if (normalizedSearch.length === 0 || semanticOrderedIds.length === 0) {
      return locallyFilteredVehicles;
    }

    // Semantic search returns ranked IDs, while local filters decide the final inclusion set.
    const semanticRanking = new Map(semanticOrderedIds.map((vehicleId, index) => [vehicleId, index]));
    return [...locallyFilteredVehicles].sort((a, b) => {
      const leftScore = semanticRanking.get(a.id) ?? Number.POSITIVE_INFINITY;
      const rightScore = semanticRanking.get(b.id) ?? Number.POSITIVE_INFINITY;

      if (leftScore === rightScore) {
        return a.name.localeCompare(b.name);
      }

      return leftScore - rightScore;
    });
  }, [maxPrice, minPrice, rangeQuery, searchQuery, selectedCategories, semanticOrderedIds, vehicles]);

  const visibleVehiclesCount = filteredVehicles.length;

  async function requestSemanticOrdering(query: string) {
    const normalizedQuery = query.trim();
    requestCounterRef.current += 1;
    const currentRequest = requestCounterRef.current;

    if (normalizedQuery.length === 0) {
      setSemanticOrderedIds([]);
      setSemanticState("idle");
      return;
    }

    setSemanticState("loading");

    try {
      const response = await fetch(`/api/vehicles/semantic-search?q=${encodeURIComponent(normalizedQuery)}`);
      if (!response.ok) {
        throw new Error("Semantic search request failed");
      }

      const payload = (await response.json()) as SemanticSearchResponse;
      if (currentRequest !== requestCounterRef.current) {
        return;
      }

      setSemanticOrderedIds(payload.orderedIds);
      setSemanticState(payload.enhanced ? "enhanced" : "fallback");
    } catch {
      if (currentRequest !== requestCounterRef.current) {
        return;
      }

      setSemanticOrderedIds([]);
      setSemanticState("fallback");
    }
  }

  function scheduleSemanticOrdering(query: string) {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      void requestSemanticOrdering(query);
    }, 350);
  }

  function handleSearchQueryChange(value: string) {
    setSearchQuery(value);
    scheduleSemanticOrdering(value);
  }

  function toggleCategory(category: string) {
    setSelectedCategories((prevCategories) => {
      const updated = new Set(prevCategories);
      if (updated.has(category)) {
        updated.delete(category);
      } else {
        updated.add(category);
      }

      return updated;
    });
  }

  function clearAllFilters() {
    setSearchQuery("");
    setRangeQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories(new Set());
    setSemanticOrderedIds([]);
    setSemanticState("idle");
    requestCounterRef.current += 1;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }

  const semanticStatusText =
    semanticState === "loading"
      ? "Checking semantic ranking…"
      : semanticState === "enhanced"
        ? "Results are semantically ranked."
        : semanticState === "fallback"
          ? "Semantic ranking unavailable, showing local results."
          : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="h-fit space-y-6 rounded-xl border border-border/50 bg-card p-5 shadow-sm">
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Search & Filters
          </p>
          <p className="text-sm text-muted-foreground">
            Search by name, type, tagline, or range. Then narrow by category and price.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="vehicle-search" className="text-sm font-medium text-foreground">
            Search vehicles
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="vehicle-search"
              value={searchQuery}
              onChange={(event) => handleSearchQueryChange(event.target.value)}
              placeholder="Try sedan, crossover, family, or 500 km"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="range-search" className="text-sm font-medium text-foreground">
            Driving range
          </label>
          <Input
            id="range-search"
            value={rangeQuery}
            onChange={(event) => setRangeQuery(event.target.value)}
            placeholder="e.g. 560 km"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Vehicle type</p>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                htmlFor={`vehicle-type-${category.toLowerCase()}`}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/40"
              >
                <input
                  id={`vehicle-type-${category.toLowerCase()}`}
                  type="checkbox"
                  checked={selectedCategories.has(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                <span className="text-sm text-foreground">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Price range (GBP)</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="min-price" className="text-xs text-muted-foreground">
                Min £
              </label>
              <Input
                id="min-price"
                type="number"
                min="0"
                step="1000"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="max-price" className="text-xs text-muted-foreground">
                Max £
              </label>
              <Input
                id="max-price"
                type="number"
                min="0"
                step="1000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="100000"
              />
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          Clear filters
        </Button>
      </aside>

      <section className="space-y-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Showing {visibleVehiclesCount} of {vehicles.length} vehicles
          </p>
          {semanticStatusText && <p className="text-xs text-muted-foreground">{semanticStatusText}</p>}
        </div>

        {visibleVehiclesCount > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-card px-6 py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-foreground">No vehicles matched your filters.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try widening your price range, removing a type filter, or searching with a shorter keyword.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
