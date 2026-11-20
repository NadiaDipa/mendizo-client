"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const CARD =
  "rounded-2xl border border-foreground/8 bg-white shadow-[0_6px_28px_-14px_rgba(18,35,46,0.12)] dark:border-white/8 dark:bg-white/[0.04] dark:shadow-[0_6px_28px_-14px_rgba(0,0,0,0.5)]";

// ─── Types ───────────────────────────────────────────────────────────────────

type ApiBooking = {
  _id: string;
  serviceTitle: string;
  technicianName: string;
  preferredDate: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

// ─── Badge maps ──────────────────────────────────────────────────────────────

const BOOKING_BADGE: Record<string, string> = {
  Pending:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  Confirmed: "bg-sky/18 text-[#0b6a9e] dark:bg-sky/15 dark:text-sky",
  "In Progress": "bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky",
  Completed:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Cancelled:
    "bg-red-500/10 text-red-600 dark:bg-red-400/15 dark:text-red-300",
};

const PAYMENT_BADGE: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Unpaid:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  Refunded:
    "bg-slate-500/10 text-slate-600 dark:bg-white/10 dark:text-on-dark/70",
};

const FILTER_TABS = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapStatus(status: string): string {
  const map: Record<string, string> = {
    requested: "Pending",
    confirmed: "Confirmed",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[status] ?? status;
}

function mapPayment(paymentStatus: string): string {
  if (paymentStatus === "paid") return "Paid";
  return "Unpaid";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Inner page (needs useSearchParams) ──────────────────────────────────────

function BookingsPageInner() {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [cancelTarget, setCancelTarget] = useState<ApiBooking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "info"; message: string } | null>(null);

  const searchParams = useSearchParams();

  async function fetchBookings() {
    try {
      const res = await fetch("http://localhost:5000/api/customer/bookings", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bookings.");
      const data = await res.json();
      setBookings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const paymentResult = searchParams.get("payment");
    if (paymentResult === "success") {
      setBanner({ type: "success", message: "Payment successful! Your booking has been updated." });
      fetchBookings();
    } else if (paymentResult === "cancelled") {
      setBanner({ type: "info", message: "Payment was cancelled. You can try again anytime." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/customer/bookings/${cancelTarget._id}/cancel`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to cancel booking.");
      }
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancelTarget._id ? { ...b, status: "cancelled" } : b
        )
      );
      setCancelTarget(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to cancel booking.");
    } finally {
      setCancelLoading(false);
    }
  }

  async function handlePay(booking: ApiBooking) {
    try {
      const res = await fetch("http://localhost:5000/api/customer/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking._id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to initiate payment.");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to initiate payment.");
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-foreground/50">Loading...</div>;
  if (error) return <div className="flex items-center justify-center py-20 text-red-500">{error}</div>;

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((b) => mapStatus(b.status) === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Payment result banner */}
      {banner && (
        <div
          className={`rounded-xl px-4 py-3 text-[13px] font-semibold ${
            banner.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
              : "bg-sky/10 text-[#0b6a9e] dark:bg-sky/15 dark:text-sky"
          }`}
        >
          {banner.message}
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="ml-3 opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Intro */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-primary dark:text-sky">
            Bookings
          </p>
          <h2 className="mt-1 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-tight text-navy dark:text-on-dark">
            Your service requests
          </h2>
          <p className="mt-1 text-[13px] text-foreground/55">
            Track schedules, payments, and booking progress.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-[11.5px] font-semibold text-primary dark:border-sky/25 dark:bg-sky/10 dark:text-sky">
          <CalendarIcon className="h-3.5 w-3.5" />
          {bookings.length} bookings
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
              filter === tab
                ? "bg-primary text-white dark:bg-sky dark:text-navy"
                : "border border-foreground/15 text-foreground/55 hover:border-primary/30 hover:text-primary dark:border-white/12 dark:hover:border-sky/30 dark:hover:text-sky"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="flex flex-col gap-4">
        {filteredBookings.length === 0 && (
          <p className="py-10 text-center text-[13px] text-foreground/45">No bookings found.</p>
        )}
        {filteredBookings.map((booking) => {
          const displayStatus = mapStatus(booking.status);
          const displayPayment = mapPayment(booking.paymentStatus);
          const canCancel = booking.status === "requested";
          const canPay =
            booking.status === "completed" &&
            (booking.paymentStatus === "unpaid" || !booking.paymentStatus);

          return (
            <article key={booking._id} className={`${CARD} p-4 sm:p-5`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                  {/* Placeholder gradient div instead of Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-foreground/8 bg-gradient-to-br from-primary/20 to-sky/30 dark:border-white/8 dark:from-sky/20 dark:to-primary/30 sm:h-24 sm:w-24" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="text-[14.5px] font-bold leading-snug text-navy dark:text-on-dark">
                        {booking.serviceTitle}
                      </h3>
                      <span className="rounded-md bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-foreground/40 dark:bg-white/[0.06]">
                        {booking._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-foreground/55">
                      <WrenchIcon className="h-3.5 w-3.5 shrink-0 text-foreground/35" />
                      {booking.technicianName}
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-foreground/55">
                      <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-foreground/35" />
                      Preferred: {formatDate(booking.preferredDate)}
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <StatusBadge
                        label={displayStatus}
                        className={BOOKING_BADGE[displayStatus] ?? "bg-foreground/8 text-foreground/60"}
                      />
                      <StatusBadge
                        label={displayPayment}
                        className={PAYMENT_BADGE[displayPayment] ?? "bg-foreground/8 text-foreground/60"}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 border-t border-foreground/8 pt-3 dark:border-white/8 lg:min-w-[190px] lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <p className="mt-0.5 text-[17px] font-bold text-navy dark:text-on-dark">
                      Final ৳{booking.amount.toLocaleString()}
                    </p>
                  </div>

                  {(canCancel || canPay) && (
                    <div className="flex items-center gap-2">
                      {canCancel && (
                        <button
                          type="button"
                          aria-label={`Cancel booking ${booking._id}`}
                          onClick={() => setCancelTarget(booking)}
                          className="rounded-xl border border-foreground/15 px-4 py-2 text-[12px] font-semibold text-foreground/65 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky dark:border-white/12 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-300"
                        >
                          Cancel
                        </button>
                      )}

                      {canPay && (
                        <button
                          type="button"
                          aria-label={`Pay for booking ${booking._id}`}
                          onClick={() => handlePay(booking)}
                          className="rounded-xl bg-primary px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(0,124,199,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--color-primary),black_10%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`${CARD} w-full max-w-sm p-6`}>
            <h3 className="text-[15px] font-bold text-navy dark:text-on-dark">
              Cancel Booking?
            </h3>
            <p className="mt-2 text-[13px] text-foreground/60">
              Are you sure you want to cancel this booking for{" "}
              <span className="font-semibold text-foreground/80">
                {cancelTarget.serviceTitle}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={cancelLoading}
                className="rounded-xl border border-foreground/15 px-4 py-2 text-[12px] font-semibold text-foreground/65 transition-colors hover:bg-foreground/5 disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelLoading}
                className="rounded-xl bg-red-500 px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {cancelLoading ? "Cancelling…" : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page (wraps inner in Suspense for useSearchParams) ──────────────────────

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-foreground/50">Loading...</div>}>
      <BookingsPageInner />
    </Suspense>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function svgProps(className = "h-4 w-4") {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M8 2v3M16 2v3M3 10h18" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-9.3 9.3a2.5 2.5 0 0 1-3.5-3.5l9.3-9.3a4.5 4.5 0 0 0-5.9-5.9l3 3-2.5 2.5-3-3a4.5 4.5 0 0 0 6 1Z" />
    </svg>
  );
}
