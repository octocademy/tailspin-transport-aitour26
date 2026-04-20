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

function parseRangeInKm(range: string) {
  const matchedRange = range.match(/\d+/);
  return matchedRange ? Number.parseInt(matchedRange[0], 10) : null;
}

export function VehiclesSearchContent({ vehicles }: VehiclesSearchContentProps) {
  const [typeQuery, setTypeQuery] = useState('');
  const [minimumRangeQuery, setMinimumRangeQuery] = useState('');
  const [maximumRangeQuery, setMaximumRangeQuery] = useState('');

  const filteredVehicles = useMemo(() => {
    const normalizedTypeQuery = typeQuery.trim().toLowerCase();
    const minimumRange = minimumRangeQuery.trim() === '' ? null : Number.parseInt(minimumRangeQuery, 10);
    const maximumRange = maximumRangeQuery.trim() === '' ? null : Number.parseInt(maximumRangeQuery, 10);

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
  }, [maximumRangeQuery, minimumRangeQuery, typeQuery, vehicles]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/60 bg-card/70 p-4 shadow-cloud md:grid-cols-3">
        <Input
          aria-label="Search by vehicle type"
          placeholder="Search by type (SUV, Sedan, Touring...)"
          value={typeQuery}
          onChange={(event) => setTypeQuery(event.target.value)}
        />
        <Input
          aria-label="Minimum range in km"
          placeholder="Min range (km)"
          type="number"
          value={minimumRangeQuery}
          onChange={(event) => setMinimumRangeQuery(event.target.value)}
        />
        <Input
          aria-label="Maximum range in km"
          placeholder="Max range (km)"
          type="number"
          value={maximumRangeQuery}
          onChange={(event) => setMaximumRangeQuery(event.target.value)}
        />
      </div>

      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} hideFeaturedTag={true} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl py-16 text-center glass-card">
          <p className="text-muted-foreground">No vehicles match your range and type search.</p>
        </div>
      )}
    </div>
  );
}
