import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/shared/max-width-wrapper";

export default function OurStoryPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center py-24">
      <MaxWidthWrapper className="text-center">
        <div className="flex flex-col items-center gap-6">
          {/* Decorative icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <Zap className="h-10 w-10 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold tracking-tight text-foreground">
            Our Story
          </h1>

          {/* Placeholder message */}
          <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
            Great journeys start with a single charge. We&apos;re writing
            the next chapter of electric mobility. Check back soon. ⚡
          </p>

          {/* Decorative divider */}
          <div className="text-primary/40 tracking-[0.5em] text-sm select-none">
            ⚡ ⚡ ⚡
          </div>

          {/* Back link */}
          <Button
            asChild
            variant="outline"
            className="rounded-full border-primary/30 text-primary hover:bg-primary/10 mt-2"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </MaxWidthWrapper>
    </main>
  );
}
