import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "My Bookings — Mendizo",
  description: "Track your Mendizo service requests, schedules, and payments.",
};

const CARD =
  "rounded-2xl border border-foreground/8 bg-white shadow-[0_6px_28px_-14px_rgba(18,35,46,0.12)] dark:border-white/8 dark:bg-white/[0.04] dark:shadow-[0_6px_28px_-14px_rgba(0,0,0,0.5)]";

// ─── Sample data (UI preview only) ───────────────────────────────────────────

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled";

type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

type Booking = {
  id: string;
  service: string;
  technician: string;
  preferredDate: string;
  baseAmount: number;
  finalAmount: number;
  status: BookingStatus;
  payment: PaymentStatus;
  image: string;
};

const BOOKINGS: Booking[] = [
  {
    id: "BK-1042",
    service: "AC Deep Cleaning & Servicing",
    technician: "Rafiqul Islam",
    preferredDate: "Nov 18, 2026",
    baseAmount: 1200,
    finalAmount: 1200,
    status: "In Progress",
    payment: "Unpaid",
    image: "/images/showcase-2.png",
  },
  {
    id: "BK-1041",
    service: "Laptop Screen Replacement",
    technician: "Tanvir Ahmed",
    preferredDate: "Nov 22, 2026",
    baseAmount: 4800,
    finalAmount: 4500,
    status: "Confirmed",
    payment: "Unpaid",
    image: "/images/device-1.png",
  },
  {
    id: "BK-1038",
    service: "Washing Machine Motor Repair",
    technician: "Sumon Hossain",
    preferredDate: "Nov 09, 2026",
    baseAmount: 2500,
    finalAmount: 2300,
    status: "Completed",
    payment: "Paid",
    image: "/images/technician-3.png",
  },
  {
    id: "BK-1035",
    service: "Refrigerator Gas Recharge",
    technician: "Mizanur Rahman",
    preferredDate: "Nov 02, 2026",
    baseAmount: 1800,
    finalAmount: 1800,
    status: "Completed",
    payment: "Paid",
    image: "/images/device-1.png",
  },
  {
    id: "BK-1029",
    service: "Mobile Screen Replacement",
    technician: "Arif Billah",
    preferredDate: "Oct 28, 2026",
    baseAmount: 3200,
    finalAmount: 3200,
    status: "Cancelled",
    payment: "Refunded",
    image: "/images/showcase-2.png",
  },
];

const BOOKING_BADGE: Record<BookingStatus, string> = {
  Pending:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  Confirmed:
    "bg-sky/18 text-[#0b6a9e] dark:bg-sky/15 dark:text-sky",
  "In Progress":
    "bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky",
  Completed:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Cancelled:
    "bg-red-500/10 text-red-600 dark:bg-red-400/15 dark:text-red-300",
};

const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Unpaid:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  Refunded:
    "bg-slate-500/10 text-slate-600 dark:bg-white/10 dark:text-on-dark/70",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-6">
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
          {BOOKINGS.length} bookings
        </span>
      </div>

      {/* Booking cards */}
      <div className="flex flex-col gap-4">
        {BOOKINGS.map((booking) => {
          const canCancel =
            booking.status !== "Completed" && booking.status !== "Cancelled";
          const canPay =
            booking.payment === "Unpaid" && booking.status !== "Cancelled";

          return (
            <article key={booking.id} className={`${CARD} p-4 sm:p-5`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-foreground/8 bg-mist dark:border-white/8 dark:bg-navy sm:h-24 sm:w-24">
                    <Image
                      src={booking.image}
                      alt={booking.service}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3 className="text-[14.5px] font-bold leading-snug text-navy dark:text-on-dark">
                        {booking.service}
                      </h3>
                      <span className="rounded-md bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-foreground/40 dark:bg-white/[0.06]">
                        {booking.id}
                      </span>
                    </div>

                    <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-foreground/55">
                      <WrenchIcon className="h-3.5 w-3.5 shrink-0 text-foreground/35" />
                      {booking.technician}
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-foreground/55">
                      <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-foreground/35" />
                      Preferred: {booking.preferredDate}
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <StatusBadge
                        label={booking.status}
                        className={BOOKING_BADGE[booking.status]}
                      />
                      <StatusBadge
                        label={booking.payment}
                        className={PAYMENT_BADGE[booking.payment]}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 border-t border-foreground/8 pt-3 dark:border-white/8 lg:min-w-[190px] lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[11px] text-foreground/45">
                      Base{" "}
                      <span className="font-semibold text-foreground/60">
                        ৳{booking.baseAmount.toLocaleString()}
                      </span>
                    </p>
                    <p className="mt-0.5 text-[17px] font-bold text-navy dark:text-on-dark">
                      Final ৳{booking.finalAmount.toLocaleString()}
                    </p>
                  </div>

                  {(canCancel || canPay) && (
                    <div className="flex items-center gap-2">
                      {canCancel && (
                        <button
                          type="button"
                          aria-label={`Cancel booking ${booking.id}`}
                          className="rounded-xl border border-foreground/15 px-4 py-2 text-[12px] font-semibold text-foreground/65 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky dark:border-white/12 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-300"
                        >
                          Cancel
                        </button>
                      )}

                      {canPay && (
                        <button
                          type="button"
                          aria-label={`Pay for booking ${booking.id}`}
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
    </div>
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
