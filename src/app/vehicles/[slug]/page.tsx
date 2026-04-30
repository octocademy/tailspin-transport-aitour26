import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MaxWidthWrapper } from '@/components/shared/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Battery, Gauge, Zap, Timer, Cog, Users, BatteryCharging } from 'lucide-react';

/* USD currency formatter */
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

interface VehicleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { slug } });
  if (!vehicle) return { title: 'Vehicle Not Found' };

  return {
    title: `${vehicle.name} | Tailspin Transport`,
    description: vehicle.shortTagline,
  };
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { slug } });

  if (!vehicle) {
    notFound();
  }

  /* Specs data for the table */
  const specs = [
    { label: 'Range', value: vehicle.range, icon: Battery },
    { label: 'Top Speed', value: vehicle.topSpeed, icon: Gauge },
    { label: 'Acceleration', value: vehicle.acceleration, icon: Timer },
    { label: 'Power', value: vehicle.power, icon: Zap },
    { label: 'Drivetrain', value: vehicle.drivetrain, icon: Cog },
    { label: 'Seats', value: `${vehicle.seats}`, icon: Users },
    { label: 'Battery', value: vehicle.battery, icon: BatteryCharging },
  ];

  return (
    <div className="py-14">
      <MaxWidthWrapper>
        {/* Back navigation */}
        <Button variant="ghost" asChild className="mb-8 text-muted-foreground hover:text-foreground">
          <Link href="/vehicles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Vehicles
          </Link>
        </Button>

        {/* Hero section — image + key info side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Vehicle image */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-cloud-hover bg-muted/10">
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.name} — ${vehicle.shortTagline}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {vehicle.isFeatured && (
              <Badge className="absolute top-4 right-4 badge-enchanted border-0 text-sm font-semibold">
                ⚡ Featured
              </Badge>
            )}
          </div>

          {/* Vehicle info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {vehicle.category}
              </p>
              <h1 className="text-4xl lg:text-5xl font-[family-name:var(--font-playfair)] font-bold tracking-tight text-foreground">
                {vehicle.name}
              </h1>
              <p className="text-2xl font-bold text-primary">
                {usdFormatter.format(vehicle.price / 100)}
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {vehicle.description || vehicle.shortTagline}
            </p>

            {/* Quick stats highlight */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-muted/50 rounded-full px-4 py-2">
                <Battery className="h-4 w-4 text-primary" />
                {vehicle.range}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-muted/50 rounded-full px-4 py-2">
                <Gauge className="h-4 w-4 text-primary" />
                {vehicle.topSpeed}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-muted/50 rounded-full px-4 py-2">
                <Timer className="h-4 w-4 text-primary" />
                {vehicle.acceleration}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="sparkle-divider py-10">⚡ ⚡ ⚡</div>

        {/* Specifications table */}
        <section className="max-w-2xl">
          <h2 className="text-2xl font-[family-name:var(--font-playfair)] font-bold tracking-tight text-foreground mb-6">
            Specifications
          </h2>
          <div className="rounded-xl border border-border/50 overflow-hidden shadow-cloud">
            <table className="w-full">
              <tbody>
                {specs.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}
                  >
                    <td className="px-5 py-4 flex items-center gap-3">
                      <spec.icon className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-muted-foreground">{spec.label}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-semibold text-foreground">{spec.value}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </MaxWidthWrapper>
    </div>
  );
}
