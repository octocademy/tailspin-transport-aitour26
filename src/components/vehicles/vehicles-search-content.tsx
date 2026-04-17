'use client';

import { useMemo, useState } from 'react';
import type { Vehicle } from '@prisma/client';
import { Search } from 'lucide-react';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { Input } from '@/components/ui/input';

interface VehiclesSearchContentProps {
  vehicles: Vehicle[];
}

function parseRangeKilometers(range: string): number | null {
  const match = range.match(/\d+/);

  if (!match) {
    return null;
  }

  return Number.parseInt(match[0], 10);
}

export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [minimumRange, setMinimumRange] = useState('');

  const typeOptions = useMemo(
    () => ['all', ...new Set(vehicles.map((vehicle) => vehicle.category))],
    [vehicles],
  );

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const minimumRangeValue = minimumRange === '' ? null : Number.parseInt(minimumRange, 10);

    return vehicles.filter((vehicle) => {
      const isTypeMatch = selectedType === 'all' || vehicle.category === selectedType;
      const isQueryMatch =
        query.length === 0 ||
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.shortTagline.toLowerCase().includes(query) ||
        vehicle.category.toLowerCase().includes(query);

      const vehicleRange = parseRangeKilometers(vehicle.range);
      const isRangeMatch =
        minimumRangeValue === null ||
        (vehicleRange !== null && vehicleRange >= minimumRangeValue);

      return isTypeMatch && isQueryMatch && isRangeMatch;
    });
  }, [minimumRange, searchQuery, selectedType, vehicles]);

  return (
    <div className="space-y-8">
      <section
        className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm"
        aria-label="Vehicle search controls"
      >
        <div className="space-y-2">
          <label htmlFor="vehicle-search" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="vehicle-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Find by name, type, or tagline"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="vehicle-type" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Type
          </label>
          <select
            id="vehicle-type"
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
          >
            {typeOptions.map((typeOption) => (
              <option key={typeOption} value={typeOption}>
                {typeOption === 'all' ? 'All types' : typeOption}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="minimum-range" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Min range (km)
          </label>
          <Input
            id="minimum-range"
            type="number"
            min={0}
            value={minimumRange}
            onChange={(event) => setMinimumRange(event.target.value)}
            placeholder="e.g. 500"
          />
        </div>
      </section>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of{' '}
        <span className="font-semibold text-foreground">{vehicles.length}</span> vehicles
      </p>

      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/60 py-16 text-center">
          <p className="text-muted-foreground">No vehicles match your search. Try a different type or range.</p>
        </div>
      )}
    </div>
  );
}
