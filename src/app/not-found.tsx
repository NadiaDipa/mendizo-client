import Link from "next/link";
import { Wrench, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mb-6">
        <div className="grid h-28 w-28 place-items-center rounded-3xl bg-primary/10 text-primary shadow-xl dark:bg-sky/15 dark:text-sky">
          <Wrench className="h-14 w-14 animate-bounce" />
        </div>
        <span className="absolute -bottom-2 -right-2 rounded-full bg-amber-500 px-3 py-1 font-mono text-xs font-bold text-white shadow-md">
          404
        </span>
      </div>

      <h1 className="font-display text-3xl sm:text-5xl font-bold text-navy dark:text-on-dark tracking-tight">
        404 – Page Not Found
      </h1>

      <p className="mx-auto mt-4 max-w-md text-sm sm:text-base text-foreground/60 dark:text-on-dark/60 leading-relaxed">
        Oops! Looks like this page couldn't be found.

        The page you're looking for may have been moved, removed, or the link might be incorrect. Let's help you find your way back.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky hover:text-navy"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold text-foreground/80 hover:bg-foreground/5 dark:border-white/20 dark:text-on-dark"
        >
          Browse Services
        </Link>
      </div>
    </div>
  );
}
