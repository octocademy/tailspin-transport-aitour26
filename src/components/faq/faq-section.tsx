"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqCategories } from "@/data/faq-data";

/**
 * FaqSection renders all FAQ categories with expandable accordion items.
 * Each category is visually separated with a heading and icon.
 */
export function FaqSection() {
  return (
    <div className="space-y-12">
      {faqCategories.map((category) => (
        <div key={category.slug} className="space-y-4">
          {/* Category header */}
          <div className="flex items-center gap-3 pb-2 border-b border-border/50">
            <span className="text-xl" role="img" aria-label={category.label}>
              {category.icon}
            </span>
            <h2 className="text-xl font-[family-name:var(--font-playfair)] font-semibold text-foreground">
              {category.label}
            </h2>
          </div>

          {/* Accordion items for this category */}
          <Accordion type="multiple" className="w-full">
            {category.items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-base font-medium text-foreground/90 hover:text-primary hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
