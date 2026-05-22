export function ComingSoon() {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Clarum
        </p>
        <h1 className="mt-6 font-display text-5xl leading-tight text-foreground md:text-7xl">
          Coming soon.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Nothing hidden. Everything tested. We're putting the final touches on
          the storefront. Check back shortly.
        </p>
      </div>
    </div>
  );
}
