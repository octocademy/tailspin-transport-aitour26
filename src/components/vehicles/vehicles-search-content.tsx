'use client';

import { useMemo, useState } from 'react';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { Input } from '@/components/ui/input';

interface VehiclesSearchContentProps {
  vehicles: {
    id: string;
    name: string;
    slug: string;
    price: number;
    shortTagline: string;
    category: string;
    range: string;
    imageUrl: string;
    isFeatured: boolean;
  }[];
}

/* Extracts numeric range values from strings like "652 km". */
function parseRangeInKm(range: string) {
  const rangeMatch = range.match(/\d+/);
  return rangeMatch ? Number.parseInt(rangeMatch[0], 10) : null;
}

export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  const [typeQuery, setTypeQuery] = useState('');
  const [minRangeQuery, setMinRangeQuery] = useState('');
  const [maxRangeQuery, setMaxRangeQuery] = useState('');

  const filteredVehicles = useMemo(() => {
    const normalizedTypeQuery = typeQuery.trim().toLowerCase();
    const minimumRange = minRangeQuery.trim() === '' ? null : Number.parseInt(minRangeQuery, 10);
    const maximumRange = maxRangeQuery.trim() === '' ? null : Number.parseInt(maxRangeQuery, 10);

    return vehicles.filter((vehicle) => {
      const vehicleRange = parseRangeInKm(vehicle.range);
      const typeMatches =
        normalizedTypeQuery === '' ||
        vehicle.category.toLowerCase().includes(normalizedTypeQuery) ||
        vehicle.name.toLowerCase().includes(normalizedTypeQuery);

      if (!typeMatches) {
        return false;
      }

      if (minimumRange !== null && (vehicleRange === null || vehicleRange < minimumRange)) {
        return false;
      }

      if (maximumRange !== null && (vehicleRange === null || vehicleRange > maximumRange)) {
        return false;
      }

      return true;
    });
  }, [maxRangeQuery, minRangeQuery, typeQuery, vehicles]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/60 bg-card/70 p-4 shadow-cloud md:grid-cols-3">
        <Input
          aria-label="Search by vehicle type"
          placeholder="Search by type (SUV, Sedan, or Touring...)"
          value={typeQuery}
          onChange={(event) => setTypeQuery(event.target.value)}
        />
        <Input
          aria-label="Minimum range in km"
          placeholder="Min range (km)"
          type="number"
          value={minRangeQuery}
          onChange={(event) => setMinRangeQuery(event.target.value)}
        />
        <Input
          aria-label="Maximum range in km"
          placeholder="Max range (km)"
          type="number"
          value={maxRangeQuery}
          onChange={(event) => setMaxRangeQuery(event.target.value)}
        />
      </div>

      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag />
          ))}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center glass-card">
          <p className="text-muted-foreground">No vehicles match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
