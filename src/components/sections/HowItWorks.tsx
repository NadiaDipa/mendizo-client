// HowItWorks — static UI section. No backend connection.

import type { JSX } from "react";

type Step = {
  number: string;
  title: string;
  description: string;
  Icon: () => JSX.Element;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Choose a Service",
    description:
      "Browse categories and select the repair service that matches your need. Filter by device, location, or price.",
    Icon: SearchIcon,
  },
  {
    number: "02",
    title: "Book a Technician",
    description:
      "Pick a verified technician, choose a convenient time slot, and confirm your booking in just a few taps.",
    Icon: CalendarIcon,
  },
  {
    number: "03",
    title: "Get It Repaired",
    description:
      "Your technician arrives on time, fixes the issue, and you pay only after the job is complete.",
    Icon: WrenchIcon,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative bg-navy py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Subtle background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky">
            Simple Process
          </p>
          <h2
            id="how-heading"
            className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-on-dark"
          >
            How Mendizo Works
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-on-dark/65">
            Three easy steps to get your device or appliance repaired by a
            certified professional.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12 lg:mt-16">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden="true"
            className="absolute top-14 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-sky/30 to-transparent lg:block"
            style={{ marginLeft: "calc(16.67% + 2rem)", marginRight: "calc(16.67% + 2rem)" }}
          />

          <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, index) => (
              <li
                key={step.number}
                className="relative flex flex-col items-center text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Number badge */}
                <div className="relative mb-5">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/50 bg-surface">
                    <step.Icon />
                    {/* Step number chip */}
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-[1.15rem] leading-snug text-on-dark">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-xs text-[14.5px] leading-relaxed text-on-dark/65">
                  {step.description}
                </p>

                {/* Connector arrow — between steps, mobile only */}
                {index < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="mt-4 text-sky/40 md:hidden"
                  >
                    <ChevronDownIcon />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7 text-sky"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CalendarIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7 text-sky"
    >
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M8 2v3M16 2v3M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

function WrenchIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7 text-sky"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </svg>
  );
}

function ChevronDownIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
