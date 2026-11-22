export default function ProfileLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading profile">
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded-full bg-foreground/10 dark:bg-white/10" />
        <div className="h-8 w-44 animate-pulse rounded-lg bg-foreground/10 dark:bg-white/10" />
        <div className="h-3 w-80 max-w-full animate-pulse rounded-full bg-foreground/10 dark:bg-white/10" />
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-[24px] border border-foreground/10 bg-white dark:border-white/8 dark:bg-white/[0.04]">
          <div className="h-24 animate-pulse bg-foreground/5 dark:bg-white/5" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex justify-center">
              <div className="h-24 w-24 animate-pulse rounded-full border-[3px] border-white bg-foreground/10 dark:border-[#1b2c36] dark:bg-white/10" />
            </div>
            <div className="mx-auto mt-4 h-5 w-32 animate-pulse rounded bg-foreground/10 dark:bg-white/10" />
            <div className="mx-auto mt-2 h-3 w-44 max-w-full animate-pulse rounded bg-foreground/10 dark:bg-white/10" />
            <div className="mx-auto mt-4 h-6 w-24 animate-pulse rounded-full bg-foreground/10 dark:bg-white/10" />
            <div className="mt-6 h-20 animate-pulse rounded-2xl bg-foreground/5 dark:bg-white/5" />
            <div className="mt-3 h-12 animate-pulse rounded-2xl bg-foreground/5 dark:bg-white/5" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[22px] border border-foreground/10 bg-white p-6 dark:border-white/8 dark:bg-white/[0.038] sm:p-7">
            <div className="h-5 w-40 animate-pulse rounded bg-foreground/10 dark:bg-white/10" />
            <div className="mt-2 h-3 w-64 max-w-full animate-pulse rounded bg-foreground/10 dark:bg-white/10" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-foreground/10 dark:bg-white/10" />
                  <div className="h-12 animate-pulse rounded-xl bg-foreground/5 dark:bg-white/5" />
                </div>
              ))}
            </div>
            <div className="mt-5 h-28 animate-pulse rounded-xl bg-foreground/5 dark:bg-white/5" />
          </div>

          <div className="h-64 animate-pulse rounded-[22px] border border-foreground/10 bg-white dark:border-white/8 dark:bg-white/[0.038]" />
        </div>
      </div>
    </div>
  );
}
