"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const CARD =
  "rounded-2xl border border-foreground/8 bg-white shadow-[0_6px_28px_-14px_rgba(18,35,46,0.12)] dark:border-white/8 dark:bg-white/[0.04] dark:shadow-[0_6px_28px_-14px_rgba(0,0,0,0.5)]";

const API_URL = "";

// ─── Types ───────────────────────────────────────────────────────────────────

type ApiBooking = {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  technicianName: string;
  preferredDate: string;
  amount?: number;
  finalAmount?: number;
  basePrice?: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

// ─── Badge maps ──────────────────────────────────────────────────────────────

const BOOKING_BADGE: Record<string, string> = {
  Requested:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  Accepted: "bg-sky/18 text-[#0b6a9e] dark:bg-sky/15 dark:text-sky",
  "In Progress": "bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky",
  Completed:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Cancelled: "bg-red-500/10 text-red-600 dark:bg-red-400/15 dark:text-red-300",
  Rejected: "bg-red-500/10 text-red-600 dark:bg-red-400/15 dark:text-red-300",
};

const PAYMENT_BADGE: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Unpaid:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
};

const FILTER_TABS = [
  "All",
  "Requested",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapStatus(status: string): string {
  const map: Record<string, string> = {
    requested: "Requested",
    accepted: "Accepted",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    rejected: "Rejected",
  };
  return map[status] ?? status;
}

function mapPayment(paymentStatus?: string): string {
  if (paymentStatus === "paid") return "Paid";
  return "Unpaid";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
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
  const [payingId, setPayingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<{
    type: "success" | "info";
    message: string;
  } | null>(null);

  const searchParams = useSearchParams();

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/bookings/my`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bookings.");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const paymentResult = searchParams.get("payment");
    if (paymentResult === "success") {
      setBanner({
        type: "success",
        message:
          "Payment verified successfully! Your booking is now marked as Paid.",
      });
      fetchBookings();
    } else if (paymentResult === "cancelled") {
      setBanner({
        type: "info",
        message: "Payment was cancelled. You can try again anytime.",
      });
    }
  }, [searchParams]);

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/bookings/${cancelTarget._id}/cancel`,
        { method: "PATCH", credentials: "include" },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to cancel booking.");
      }
      toast.success("Booking cancelled successfully.");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancelTarget._id ? { ...b, status: "cancelled" } : b,
        ),
      );
      setCancelTarget(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel booking.",
      );
    } finally {
      setCancelLoading(false);
    }
  }

  async function handlePay(booking: ApiBooking) {
    try {
      setPayingId(booking._id);
      const res = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking._id }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to initiate payment.");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to initiate payment.",
      );
    } finally {
      setPayingId(null);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-foreground/50">
        Loading your bookings...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        {error}
      </div>
    );

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((b) => mapStatus(b.status) === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Payment result banner */}
      {banner && (
        <div
          className={`rounded-xl px-4 py-3 text-[13px] font-semibold flex items-center justify-between ${
            banner.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
              : "bg-sky/10 text-[#0b6a9e] dark:bg-sky/15 dark:text-sky"
          }`}
        >
          <span>{banner.message}</span>
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
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-navy dark:text-on-dark">
            My Service Bookings
          </h1>
          <p className="mt-1 text-[13px] text-foreground/55">
            Track schedules, job progress, and pay online only after completion.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-[11.5px] font-semibold text-primary dark:border-sky/25 dark:bg-sky/10 dark:text-sky">
          <CalendarIcon className="h-3.5 w-3.5" />
          {bookings.length} bookings total
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
          <div className="rounded-2xl border border-dashed border-foreground/15 p-12 text-center">
            {filter === "All" && bookings.length === 0 ? (
              <>
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-foreground/5 text-foreground/40">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-semibold text-navy dark:text-on-dark">
                  No Bookings Yet
                </h3>
                <p className="mt-1 text-[13px] text-foreground/50">
                  You haven&apos;t booked any services yet.
                </p>
                <a
                  href="/services"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-sky hover:text-navy transition"
                >
                  Browse Services
                </a>
              </>
            ) : (
              <p className="text-[13px] text-foreground/45">
                No bookings found under &quot;{filter}&quot;.
              </p>
            )}
          </div>
        )}
        {filteredBookings.map((booking) => {
          const displayStatus = mapStatus(booking.status);
          const displayPayment = mapPayment(booking.paymentStatus);
          const canCancel = booking.status === "requested";
          const canPay =
            booking.status === "completed" && booking.paymentStatus !== "paid";
          const isPaid = booking.paymentStatus === "paid";
          const displayAmount = Number(
            booking.finalAmount ?? booking.amount ?? booking.basePrice ?? 0,
          );

          return (
            <article key={booking._id} className={`${CARD} p-4 sm:p-5`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                  {/* Service Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/5 dark:border-white/8 sm:h-24 sm:w-24">
                    {booking.serviceImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-sky/20 text-primary">
                        <WrenchIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>

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
                      Technician:{" "}
                      <strong className="text-foreground/80 dark:text-on-dark/80">
                        {booking.technicianName}
                      </strong>
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-foreground/55">
                      <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-foreground/35" />
                      Preferred Date: {formatDate(booking.preferredDate)}
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <StatusBadge
                        label={displayStatus}
                        className={
                          BOOKING_BADGE[displayStatus] ??
                          "bg-foreground/8 text-foreground/60"
                        }
                      />
                      <StatusBadge
                        label={displayPayment}
                        className={
                          PAYMENT_BADGE[displayPayment] ??
                          "bg-foreground/8 text-foreground/60"
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 border-t border-foreground/8 pt-3 dark:border-white/8 lg:min-w-[190px] lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] text-foreground/45 block">
                      {booking.status === "completed"
                        ? "Final Amount"
                        : "Estimated Price"}
                    </span>
                    <p className="mt-0.5 font-display text-[20px] font-bold text-navy dark:text-on-dark">
                      ${displayAmount.toLocaleString()} USD
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Cancel button: only when status === 'requested' with confirmation modal */}
                    {canCancel && (
                      <button
                        type="button"
                        aria-label={`Cancel booking ${booking._id}`}
                        onClick={() => setCancelTarget(booking)}
                        className="rounded-xl border border-foreground/15 px-4 py-2 text-[12px] font-semibold text-foreground/65 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-white/12 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-300"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Pay Now button: appears only when status === 'completed' and paymentStatus === 'unpaid' */}
                    {canPay && (
                      <button
                        type="button"
                        disabled={payingId === booking._id}
                        aria-label={`Pay for booking ${booking._id}`}
                        onClick={() => handlePay(booking)}
                        className="rounded-xl bg-primary px-5 py-2 text-[12px] font-bold text-white shadow-md transition-all hover:bg-sky hover:text-navy disabled:opacity-50"
                      >
                        {payingId === booking._id
                          ? "Redirecting..."
                          : "Pay Now (Stripe)"}
                      </button>
                    )}

                    {/* Paid badge: when paid, show Paid badge instead of button */}
                    {isPaid && (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`${CARD} w-full max-w-sm p-6 shadow-2xl`}>
            <h3 className="font-display text-[16px] font-bold text-navy dark:text-on-dark">
              Cancel Repair Booking?
            </h3>
            <p className="mt-2 text-[13px] text-foreground/60 leading-relaxed">
              Are you sure you want to cancel your repair request for{" "}
              <strong className="text-foreground/90">
                {cancelTarget.serviceTitle}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={cancelLoading}
                className="rounded-xl border border-foreground/15 px-4 py-2 text-[12px] font-semibold text-foreground/65 hover:bg-foreground/5 disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelLoading}
                className="rounded-xl bg-red-600 px-4 py-2 text-[12px] font-bold text-white hover:bg-red-700 disabled:opacity-50 transition"
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
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-foreground/50">
          Loading bookings...
        </div>
      }
    >
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

function CalendarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M8 2v3M16 2v3M3 10h18" />
    </svg>
  );
}

function WrenchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-9.3 9.3a2.5 2.5 0 0 1-3.5-3.5l9.3-9.3a4.5 4.5 0 0 0-5.9-5.9l3 3-2.5 2.5-3-3a4.5 4.5 0 0 0 6 1Z" />
    </svg>
  );
}
