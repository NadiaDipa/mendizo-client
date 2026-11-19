// Testimonials — static UI section.
// ⚠️  ALL content below is SAMPLE / PLACEHOLDER data.
// These are NOT real customer reviews. Replace with real data before launch.

import type { JSX } from "react";

/** ⚠️ PLACEHOLDER — not real customer reviews. */
type Testimonial = {
  id: string;
  name: string;
  location: string;
  serviceUsed: string;
  quote: string;
  rating: number;
  initials: string;
  avatarColor: string;
};

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Fatema Akter",
    location: "Gulshan, Dhaka",
    serviceUsed: "AC Repair",
    quote:
      "Booked a technician on a Sunday morning and he arrived within 2 hours. Very professional and the AC is running perfectly now. Highly recommend Mendizo!",
    rating: 5,
    initials: "FA",
    avatarColor: "bg-primary/15 text-primary",
  },
  {
    id: "t2",
    name: "Shahidul Islam",
    location: "Dhanmondi, Dhaka",
    serviceUsed: "Laptop Repair",
    quote:
      "The screen replacement was done on-site, same day. Transparent pricing — no hidden costs. I could track the technician arriving in real time.",
    rating: 5,
    initials: "SI",
    avatarColor: "bg-sky/20 text-sky",
  },
  {
    id: "t3",
    name: "Nusrat Jahan",
    location: "Mirpur, Dhaka",
    serviceUsed: "Refrigerator Repair",
    quote:
      "My fridge stopped cooling. The technician diagnosed it quickly and fixed the compressor issue. Paid only after the job — that trust factor is priceless.",
    rating: 5,
    initials: "NJ",
    avatarColor: "bg-primary/15 text-primary",
  },
];

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-navy py-16 sm:py-20 lg:py-24 overflow-hidden relative"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-sky/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky">
            Customer Stories
          </p>
          <h2
            id="testimonials-heading"
            className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-on-dark"
          >
            What Customers Say
          </h2>
          <p className="mt-3 text-[14px] font-medium text-on-dark/55">
            ⚠️ The reviews below are sample placeholder content and do not
            represent real customer experiences.
          </p>
        </div>

        {/* Testimonial cards */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:mt-14">
          {SAMPLE_TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <TestimonialCard testimonial={t} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border border-on-dark/10 bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky/30 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]">
      {/* Stars */}
      <div
        className="flex gap-0.5"
        aria-label={`${t.rating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`h-4 w-4 ${
              s <= t.rating
                ? "fill-amber-400 text-amber-400"
                : "fill-on-dark/15 text-on-dark/15"
            }`}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="flex-1">
        <QuoteIcon />
        <p className="mt-2 text-[14.5px] leading-relaxed text-on-dark/80">
          {t.quote}
        </p>
      </blockquote>

      {/* Divider */}
      <div className="h-px w-full bg-on-dark/10" aria-hidden="true" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-bold ${t.avatarColor}`}
        >
          {t.initials}
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-on-dark">{t.name}</p>
          <p className="text-[12px] text-on-dark/50">{t.location}</p>
        </div>
        <span className="ml-auto shrink-0 rounded-full border border-sky/25 px-2.5 py-0.5 text-[11px] font-medium text-sky">
          {t.serviceUsed}
        </span>
      </div>
    </article>
  );
}

function QuoteIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-6 w-6 text-sky/40"
    >
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Z" />
    </svg>
  );
}
