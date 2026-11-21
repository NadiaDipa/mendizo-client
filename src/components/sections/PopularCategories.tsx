// PopularCategories — static UI section. No backend connection.

import type { JSX } from "react";
import Link from "next/link";

type Category = {
  label: string;
  href: string;
  Icon: () => JSX.Element;
  description: string;
  accent: string; // Tailwind bg utility for the icon badge
};

const CATEGORIES: Category[] = [
  {
    label: "AC Repair",
    href: "/services?category=AC",
    Icon: ACIcon,
    description: "Expert AC servicing, gas refill & cooling solutions.",
    accent: "bg-sky/15 text-sky",
  },
  {
    label: "Refrigerator Repair",
    href: "/services?category=Refrigerator",
    Icon: FridgeIcon,
    description: "Cooling issues, compressor faults & general fridge fixes.",
    accent: "bg-primary/10 text-primary",
  },
  {
    label: "Washing Machine",
    href: "/services?category=Washing Machine",
    Icon: WasherIcon,
    description: "Drum, motor, and electronic control board repairs.",
    accent: "bg-sky/15 text-sky",
  },
  {
    label: "Laptop & PC Repair",
    href: "/services?category=Laptop & PC",
    Icon: LaptopIcon,
    description: "Screen, keyboard, battery & motherboard diagnostics.",
    accent: "bg-primary/10 text-primary",
  },
  {
    label: "Smartphone Repair",
    href: "/services?category=Smartphone",
    Icon: MobileIcon,
    description: "Screen replacement, charging port & software fixes.",
    accent: "bg-sky/15 text-sky",
  },
  {
    label: "TV Repair",
    href: "/services?category=TV",
    Icon: TVIcon,
    description: "LED/LCD panel, HDMI, power board & smart TV repairs.",
    accent: "bg-primary/10 text-primary",
  },
  {
    label: "Electrical Wiring",
    href: "/services?category=Electrical",
    Icon: ACIcon,
    description: "Short circuits, DB board rewiring & installation.",
    accent: "bg-sky/15 text-sky",
  },
];

export default function PopularCategories() {
  return (
    <section
      id="services"
      aria-labelledby="categories-heading"
      className="bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            What We Fix
          </p>
          <h2
            id="categories-heading"
            className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-foreground"
          >
            Popular Repair Categories
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">
            Browse the most requested repair services. Certified technicians at
            your doorstep.
          </p>
        </div>

        {/* Category grid */}
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 sm:gap-5 lg:mt-14">
          {CATEGORIES.map((cat) => (
            <li key={cat.label}>
              <Link
                href={cat.href}
                className="group flex h-full flex-col items-center gap-4 rounded-2xl border border-foreground/8 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_30px_-10px_rgba(0,124,199,0.22)] dark:border-on-dark/10 dark:bg-surface/40 dark:hover:border-sky/30"
              >
                {/* Icon badge */}
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${cat.accent}`}
                >
                  <cat.Icon />
                </span>

                <span className="font-semibold text-[14px] leading-snug text-foreground">
                  {cat.label}
                </span>

                <span className="text-[12.5px] leading-relaxed text-foreground/55 hidden sm:block">
                  {cat.description}
                </span>

                <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold text-primary group-hover:gap-2 transition-all duration-200 dark:text-sky">
                  Explore
                  <ArrowRightSmIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function svgBase(className = "h-7 w-7") {
  return {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className,
  };
}

function ACIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="2" y="6" width="20" height="8" rx="3" />
      <path d="M6 14v4M12 14v4M18 14v4M6 10h.01M9 10h.01" />
    </svg>
  );
}

function FridgeIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="5" y="2" width="14" height="20" rx="2.5" />
      <path d="M5 10h14" />
      <path d="M9 6.5v2M9 14v2" />
    </svg>
  );
}

function WasherIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="3.5" y="2.5" width="17" height="19" rx="2.5" />
      <circle cx="12" cy="14" r="4.5" />
      <path d="M7 6.5h.01M10.5 6.5h.01" />
    </svg>
  );
}

function LaptopIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="4" y="4" width="16" height="11" rx="2" />
      <path d="M2.5 18.5h19" />
    </svg>
  );
}

function MobileIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}

function TVIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="2" y="4" width="20" height="14" rx="2.5" />
      <path d="M8 20h8M12 18v2" />
    </svg>
  );
}

function ArrowRightSmIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
