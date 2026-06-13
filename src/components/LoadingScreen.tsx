export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard data"
    >
      <div className="flex max-w-sm flex-col items-center gap-5 rounded-2xl border border-border bg-card px-6 py-7 text-center shadow-sm animate-fade-in">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="block h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <span className="block h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <span className="block h-2.5 w-2.5 rounded-full bg-primary animate-bounce" />
        </div>

        <div>
          <p className="text-[13px] font-semibold text-foreground tracking-wide">
            Loading dashboard data
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Loading facilities, district denominators, and boundary layers from static data files.
          </p>
        </div>
      </div>
    </div>
  );
}
