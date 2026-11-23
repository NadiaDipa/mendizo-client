"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { JSX } from "react";

const CARD =
  "rounded-2xl border border-foreground/8 bg-white shadow-[0_6px_28px_-14px_rgba(18,35,46,0.12)] dark:border-white/8 dark:bg-white/[0.04] dark:shadow-[0_6px_28px_-14px_rgba(0,0,0,0.5)]";

const API_URL = "";

// ─── Types ───────────────────────────────────────────────────────────────────

type Stat = {
  label: string;
  value: string;
  hint: string;
  tone: string;
  Icon: (props?: { className?: string }) => JSX.Element;
};

type ApiBooking = {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  technicianName: string;
  preferredDate: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

// ─── Badge maps ──────────────────────────────────────────────────────────────

const BOOKING_BADGE: Record<string, string> = {
  Requested:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  Confirmed: "bg-sky/18 text-[#0b6a9e] dark:bg-sky/15 dark:text-sky",
  "In Progress": "bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky",
  Completed:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Cancelled: "bg-red-500/10 text-red-600 dark:bg-red-400/15 dark:text-red-300",
};

const PAYMENT_BADGE: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Unpaid:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapStatus(status: string): string {
  const map: Record<string, string> = {
    requested: "Requested",
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CustomerDashboardPage() {
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    completed: number;
  } | null>(null);
  const [recentBookings, setRecentBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          fetch(`${API_URL}/api/customer/stats`, { credentials: "include" }),
          fetch(`${API_URL}/api/customer/bookings`, { credentials: "include" }),
        ]);

        if (!statsRes.ok || !bookingsRes.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const statsData = await statsRes.json();
        const bookingsData = await bookingsRes.json();

        setStats(statsData);
        setRecentBookings(bookingsData.slice(0, 3));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-foreground/50">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        {error}
      </div>
    );

  const STATS: Stat[] = [
    {
      label: "Total Requests",
      value: String(stats?.total ?? 0),
      hint: "All time",
      tone: "bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky",
      Icon: ClipboardIcon,
    },
    {
      label: "Active Jobs",
      value: String(stats?.pending ?? 0),
      hint: "Currently in progress",
      tone: "bg-sky/15 text-[#0b6a9e] dark:bg-sky/15 dark:text-sky",
      Icon: WrenchIcon,
    },
    {
      label: "Completed Jobs",
      value: String(stats?.completed ?? 0),
      hint: "Successfully completed",
      tone: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
      Icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Intro */}
      <div>
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-primary dark:text-sky">
          Overview
        </p>
        <h2 className="mt-1 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-tight text-navy dark:text-on-dark">
          Welcome back
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/75 dark:text-on-dark/80">
          Your repair activity at a glance.
        </p>
      </div>

      {/* Summary cards */}
      <section
        aria-label="Booking summary"
        className="grid gap-4 sm:grid-cols-3"
      >
        {STATS.map((stat) => (
          <article
            key={stat.label}
            className={`${CARD} group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-18px_rgba(0,124,199,0.3)]`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-foreground/70 dark:text-on-dark/75">
                  {stat.label}
                </p>
                <p className="mt-2.5 font-display text-[34px] leading-none text-navy dark:text-on-dark">
                  {stat.value}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/70 dark:text-on-dark/75">
                  {stat.hint}
                </p>
              </div>

              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${stat.tone}`}
              >
                <stat.Icon />
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* Recent bookings */}
      <section className={`${CARD} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 border-b border-foreground/8 px-5 py-4 dark:border-white/8 sm:px-6">
          <div>
            <h2 className="text-[15px] font-bold text-navy dark:text-on-dark">
              Recent Bookings
            </h2>
            <p className="mt-1 text-[13px] text-foreground/70 dark:text-on-dark/75">
              Your latest service requests.
            </p>
          </div>

          <Link
            href="/dashboard/customer/bookings"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-[13px] font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky dark:border-sky/25 dark:bg-sky/10 dark:text-sky dark:hover:border-sky/40 dark:hover:bg-sky/15"
          >
            View All
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="divide-y divide-foreground/8 dark:divide-white/8">
          {recentBookings.map((booking) => {
            const displayStatus = mapStatus(booking.status);
            const displayPayment = mapPayment(booking.paymentStatus);

            return (
              <li
                key={booking._id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <ServiceThumb
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold text-navy dark:text-on-dark">
                      {booking.serviceTitle}
                    </p>
                    <p className="mt-0.5 text-[13px] text-foreground/75 dark:text-on-dark/80">
                      {booking.technicianName}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[13px] text-foreground/70 dark:text-on-dark/75">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {formatDate(booking.preferredDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pl-[4.4rem] sm:justify-end sm:pl-0">
                  <div className="flex flex-wrap gap-1.5">
                    <StatusBadge
                      label={displayStatus}
                      className={
                        BOOKING_BADGE[displayStatus] ??
                        "bg-foreground/8 text-foreground/70 dark:text-on-dark/75"
                      }
                    />
                    <StatusBadge
                      label={displayPayment}
                      className={
                        PAYMENT_BADGE[displayPayment] ??
                        "bg-foreground/8 text-foreground/70 dark:text-on-dark/75"
                      }
                    />
                  </div>

                  <p className="shrink-0 text-[15px] font-bold text-navy dark:text-on-dark">
                    {`$${booking.amount.toLocaleString()} USD`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-bold uppercase tracking-[0.06em] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function ServiceThumb({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const hasImage = typeof src === "string" && src.trim().length > 0 && !failed;

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 dark:border-white/10 dark:bg-white/5">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-sky/20 text-primary dark:from-sky/15 dark:to-primary/20 dark:text-sky">
          <WrenchIcon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function svgProps(className = "h-5 w-5") {
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

function ClipboardIcon() {
  return (
    <svg {...svgProps()}>
      <rect x="5" y="4" width="14" height="17" rx="2.5" />
      <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h4" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string } = {}) {
  return (
    <svg {...svgProps(className)}>
      <path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-9.3 9.3a2.5 2.5 0 0 1-3.5-3.5l9.3-9.3a4.5 4.5 0 0 0-5.9-5.9l3 3-2.5 2.5-3-3a4.5 4.5 0 0 0 6 1Z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg {...svgProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M8 2v3M16 2v3M3 10h18" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg {...svgProps(className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
