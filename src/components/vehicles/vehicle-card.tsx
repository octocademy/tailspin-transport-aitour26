import Image from 'next/image';
import { Vehicle } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Battery } from 'lucide-react';

/* Reusable GBP currency formatter — created once, shared across all card instances */
const gbpFormatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

interface VehicleCardProps {
  vehicle: Vehicle;
  hideFeaturedTag?: boolean;
}

/* Sleek vehicle card with glass effect and subtle lift on hover */
export function VehicleCard({ vehicle, hideFeaturedTag = false }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group p-0 gap-0 bg-card border border-border/50 hover-lift shadow-cloud hover:shadow-cloud-hover transition-all duration-300 rounded-xl">
      {/* Image area with subtle dark overlay for depth */}
      <div className="relative aspect-[16/10] bg-muted/10 overflow-hidden rounded-t-xl">
        <Image
          src={vehicle.imageUrl}
          alt={vehicle.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Subtle gradient overlay at bottom of image for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
        {vehicle.isFeatured && !hideFeaturedTag && (
          <Badge className="absolute top-3 right-3 badge-enchanted border-0 text-xs font-semibold">
            ⚡ Featured
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg leading-tight text-foreground">
              {vehicle.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
              {vehicle.category}
            </p>
          </div>
          <span className="font-bold text-primary text-lg whitespace-nowrap">
            {gbpFormatter.format(vehicle.price / 100)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {vehicle.shortTagline}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-primary font-medium">
          <Battery className="h-3.5 w-3.5" />
          <span>Range: {vehicle.range}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2 font-medium shadow-cloud" variant="default">
          <ShoppingBag className="h-4 w-4" />
          Configure &amp; Order
        </Button>
      </CardFooter>
    </Card>
  );
}
