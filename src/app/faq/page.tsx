import { Metadata } from "next";
import { Zap } from "lucide-react";
import { MaxWidthWrapper } from "@/components/shared/max-width-wrapper";
import { FaqSection } from "@/components/faq/faq-section";

export const metadata: Metadata = {
  title: "FAQ | Tailspin Transport",
  description:
    "Find answers to common questions about Tailspin Transport electric vehicles — ordering, delivery, charging, warranties, and more.",
};

export default function FaqPage() {
  return (
    <div className="flex flex-col pb-16">
      {/* Page header */}
      <section className="py-16 bg-aurora">
        <MaxWidthWrapper className="text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Everything you need to know about Tailspin Transport electric
              vehicles — from ordering to ownership. Can&apos;t find what
              you&apos;re looking for? Reach out to our team anytime.
            </p>
            <div className="text-primary/40 tracking-[0.5em] text-sm select-none">
              ⚡ ⚡ ⚡
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* FAQ sections */}
      <section className="py-12">
        <MaxWidthWrapper className="max-w-4xl">
          <FaqSection />
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
