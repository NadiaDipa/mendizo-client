import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-5 pt-32 pb-16 text-center">
        <div className="w-full rounded-3xl border border-amber-200 bg-white p-8 shadow-2xl dark:border-amber-900/40 dark:bg-surface/50 sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-navy dark:text-on-dark">
            Payment Cancelled
          </h1>

          <p className="mt-2 text-sm text-foreground/60 dark:text-on-dark/60 leading-relaxed">
            Your checkout session was cancelled. No money was charged, and your booking remains ready for payment whenever you wish.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky hover:text-navy"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again in My Bookings
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-2.5 text-xs font-semibold text-foreground/70 hover:bg-foreground/5 dark:border-white/20 dark:text-on-dark"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
