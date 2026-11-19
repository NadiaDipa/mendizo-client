// CallToAction — static UI section. No backend connection.

import type { JSX } from "react";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-primary py-16 sm:py-20 lg:py-24"
    >
      {/* Background decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Large circle blur top-right */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        {/* Large circle blur bottom-left */}
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-navy/20 blur-3xl" />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 40px,white 40px,white 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,white 40px,white 41px)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Icon badge */}
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <WrenchSpannerIcon />
          </div>

          <h2
            id="cta-heading"
            className="font-display text-[clamp(1.9rem,5vw,3rem)] leading-tight text-white"
          >
            Need a Repair? We&apos;re Here to Help.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">
            Connect with verified technicians in your area. Fast, reliable, and
            transparent — right at your doorstep.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Primary CTA */}
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(0,0,0,0.4)]"
            >
              Find a Technician
              <ArrowRightIcon />
            </Link>

            {/* Secondary CTA — placeholder, no real page yet */}
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/70 hover:bg-white/10"
            >
              Learn How It Works
            </Link>
          </div>

          {/* Trust indicators */}
          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] font-medium text-white/70">
            {[
              "No booking fees",
              "Pay after job is done",
              "Available 7 days a week",
            ].map((point) => (
              <li key={point} className="flex items-center gap-2">
                <CheckCircleIcon />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function WrenchSpannerIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-8 w-8 text-white"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </svg>
  );
}

function ArrowRightIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckCircleIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 text-white/60"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
