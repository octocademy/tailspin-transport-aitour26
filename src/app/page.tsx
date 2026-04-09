import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { MaxWidthWrapper } from '@/components/shared/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

export default async function Home() {
  const featuredVehicles = await prisma.vehicle.findMany({
    where: { isFeatured: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col pb-12">
      {/* ⚡ Hero Section — full-width cinematic banner */}
      <section className="relative min-h-[520px] md:min-h-[600px] overflow-hidden">
        {/* Full-bleed hero image as background */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-cinematic.png"
            alt="Sleek electric vehicle driving along a futuristic road at sunset"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay — ensures text readability on left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          {/* Subtle bottom fade for clean section transition */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Hero content overlaid on the left side */}
        <MaxWidthWrapper className="relative z-10 flex items-center min-h-[520px] md:min-h-[600px]">
          <div className="max-w-xl space-y-8 py-16">
            <div className="space-y-5">
              <p className="flex items-center gap-2 text-primary font-medium tracking-[0.2em] uppercase text-sm">
                <Zap className="h-4 w-4" />
                The Future of Driving
              </p>
              <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-playfair)] font-bold tracking-tight leading-[1.1] text-foreground">
                Drive into
                <span className="block text-primary mt-2">tomorrow</span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Welcome to Tailspin Transport — where cutting-edge electric vehicles 
              meet uncompromising performance. Zero emissions, limitless possibilities.
            </p>
            <div className="pt-2 flex gap-4">
              <Button asChild size="lg" className="rounded-full shadow-cloud text-base px-8 py-6 font-semibold">
                <Link href="/vehicles">
                  Explore Vehicles <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/10 text-base px-8 py-6">
                <Link href="/our-story">
                  Our Story
                </Link>
              </Button>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* ⚡ Divider */}
      <div className="sparkle-divider py-8">⚡ ⚡ ⚡</div>

      {/* ⚡ Featured Vehicles Section */}
      <section className="pb-16">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-primary font-medium tracking-[0.15em] uppercase text-xs">
                <Zap className="h-3.5 w-3.5" />
                Top Picks
              </p>
              <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-bold tracking-tight text-foreground">
                Featured Vehicles
              </h2>
              <p className="text-sm text-muted-foreground">
                Our most advanced electric vehicles, engineered for the road ahead
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary/80 hover:bg-primary/5">
              <Link href="/vehicles">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-border/30 rounded-xl glass-card">
              <p className="text-muted-foreground">No featured vehicles selected yet.</p>
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Button variant="outline" className="w-full border-primary/30 text-primary" asChild>
              <Link href="/vehicles">
                View all vehicles
              </Link>
            </Button>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
