"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="grid h-24 w-24 place-items-center rounded-3xl border border-red-200 bg-red-50 text-red-600 shadow-xl dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
        <AlertTriangle className="h-12 w-12" />
      </div>

      <h1 className="mt-6 font-display text-2xl sm:text-4xl font-bold text-navy dark:text-on-dark">
        Something Went Wrong
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm text-foreground/60 dark:text-on-dark/60 leading-relaxed">
        {error.message || "An unexpected error occurred while processing your request. Please try again."}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky hover:text-navy"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold text-foreground/80 hover:bg-foreground/5 dark:border-white/20 dark:text-on-dark"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
