// WhyChooseMendizo — static UI section. No backend connection.

import type { JSX } from "react";
import type React from "react";

type Feature = {
  title: string;
  description: string;
  Icon: () => JSX.Element;
};

const FEATURES: Feature[] = [
  {
    title: "Verified Technicians",
    description:
      "Every technician is background-checked, trained, and certified before joining the platform.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden fees. You see the full cost upfront before confirming any booking.",
    Icon: TagIcon,
  },
  {
    title: "Easy Booking",
    description:
      "Book a repair in under two minutes — pick a service, choose a slot, and you're done.",
    Icon: CalendarCheckIcon,
  },
  {
    title: "Secure Payments",
    description:
      "Pay only after the job is complete. All transactions are processed securely.",
    Icon: LockIcon,
  },
  {
    title: "Real-Time Job Tracking",
    description:
      "Track your technician's location and job status live from the moment they set off.",
    Icon: MapPinIcon,
  },
];

export default function WhyChooseMendizo() {
  return (
    <section
      aria-labelledby="why-heading"
      className="relative bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:items-center">
          {/* Left: text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Our Promise
            </p>
            <h2
              id="why-heading"
              className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-foreground"
            >
              Why Choose Mendizo?
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-foreground/60 max-w-md">
              We built Mendizo to make repair services trustworthy, predictable,
              and stress-free — from first click to job completion.
            </p>

            {/* Trust numbers */}
            <dl className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {[
                { label: "Technicians", value: "500+" },
                { label: "Repairs Done", value: "12k+" },
                { label: "Avg. Rating", value: "4.8★" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-foreground/8 bg-white p-4 text-center shadow-sm dark:border-on-dark/10 dark:bg-surface/40"
                >
                  <dt className="text-[13px] text-foreground/55">{stat.label}</dt>
                  <dd className="mt-1 font-display text-2xl text-primary dark:text-sky">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: feature cards */}
          <ul className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feat, index) => (
              <li
                key={feat.title}
                className={`group flex gap-4 rounded-2xl border border-foreground/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_10px_28px_-8px_rgba(0,124,199,0.18)] dark:border-on-dark/10 dark:bg-surface/40 dark:hover:border-sky/25 ${
                  index === FEATURES.length - 1
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground dark:bg-sky/15 dark:text-sky dark:group-hover:bg-sky dark:group-hover:text-navy">
                  <feat.Icon />
                </span>

                <div className="min-w-0">
                  <h3 className="font-semibold text-[15px] text-foreground">
                    {feat.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/55">
                    {feat.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function svgBase(cls = "h-5 w-5"): React.SVGProps<SVGSVGElement> {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: cls,
  };
}

function ShieldCheckIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TagIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <path d="M12 2H7a2 2 0 0 0-2 2v5a2 2 0 0 0 .59 1.42l7 7a2 2 0 0 0 2.82 0l5-5a2 2 0 0 0 0-2.82l-7-7A2 2 0 0 0 12 2Z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CalendarCheckIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M8 2v3M16 2v3M3 10h18" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

function LockIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="5" y="11" width="14" height="10" rx="2.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MapPinIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </svg>
  );
}
