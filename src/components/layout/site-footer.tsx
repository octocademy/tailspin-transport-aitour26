export function SiteFooter() {
  return (
    <footer className="border-t border-border/30 bg-muted/30 relative">
      <div className="container mx-auto py-10 px-4 md:py-14">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <span className="text-lg font-[family-name:var(--font-playfair)] font-bold text-primary">
              ⚡ Tailspin Transport
            </span>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Driving the future, zero emissions at a time 🔋
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Tailspin Transport. Engineered for tomorrow.
          </p>
        </div>
      </div>
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-accent pointer-events-none" />
    </footer>
  );
}
