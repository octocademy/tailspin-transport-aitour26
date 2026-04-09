import Link from 'next/link';
import { ShoppingBag, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl">
      {/* Sleek gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-accent pointer-events-none z-50" />
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Zap className="h-5 w-5 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="text-xl font-[family-name:var(--font-playfair)] font-bold tracking-tight text-primary group-hover:opacity-80 transition-opacity">
              Tailspin Transport
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild className="text-foreground/70 hover:text-primary hover:bg-primary/5">
              <Link href="/vehicles">
                ⚡ Vehicles
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-foreground/70 hover:text-primary hover:bg-primary/5">
              <Link href="/our-story">
                📖 Our Story
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-foreground/70 hover:text-primary hover:bg-primary/5">
              <Link href="/faq">
                ❓ FAQ
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-primary" aria-label="Cart">
            <ShoppingBag className="h-6 w-6" />
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
