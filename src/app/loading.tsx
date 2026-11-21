export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-foreground/10 border-t-primary dark:border-white/10 dark:border-t-sky" />
        </div>
        <p className="font-display text-lg font-bold text-navy dark:text-on-dark">
          Mendizo
        </p>
        <p className="text-xs font-medium text-foreground/50 dark:text-on-dark/50 animate-pulse">
          Loading content...
        </p>
      </div>
    </div>
  );
}
