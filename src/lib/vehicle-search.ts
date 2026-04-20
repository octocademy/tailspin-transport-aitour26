interface VehicleSearchFields {
  name: string;
  shortTagline: string;
  category: string;
  range: string;
}

/**
 * Normalizes the primary searchable fields into a single lowercase string.
 */
export function buildVehicleSearchableText(vehicle: VehicleSearchFields): string {
  return `${vehicle.name} ${vehicle.shortTagline} ${vehicle.category} ${vehicle.range}`.toLowerCase();
}
