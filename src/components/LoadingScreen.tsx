export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard data"
    >
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
      </div>

      <div className="relative w-[92%] max-w-md rounded-3xl border border-border/70 bg-card/90 px-7 py-8 text-center shadow-xl backdrop-blur-xl animate-fade-in">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 shadow-sm">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute h-10 w-10 rounded-full border-2 border-primary/20" />
            <span className="absolute h-10 w-10 animate-spin rounded-full border-2 border-transparent border-t-primary" />

            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-primary"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="10"
                r="2.2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-foreground">
            Preparing Mental Health Atlas
          </p>

          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Loading facility records, district denominators, and boundary layers.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 overflow-hidden rounded-full bg-muted">
          <div className="h-1.5 w-1/2 animate-[loadingBar_1.8s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>

        {/* Loading steps */}
        <div className="mt-5 grid gap-2 text-left">
          <div className="flex items-center gap-2 rounded-xl bg-muted/45 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] text-muted-foreground">
              Reading facility directory
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-muted/45 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
            <span className="text-[11px] text-muted-foreground">
              Loading district indicators
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-muted/45 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
            <span className="text-[11px] text-muted-foreground">
              Rendering national map layers
            </span>
          </div>
        </div>

        <span className="sr-only">
          Loading Mental Health Atlas dashboard data. Please wait.
        </span>
      </div>

      <style>
        {`
          @keyframes loadingBar {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(60%);
            }
            100% {
              transform: translateX(220%);
            }
          }
        `}
      </style>
    </div>
  );
}
