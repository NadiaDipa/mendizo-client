// FeaturedServices — static UI section. All data is SAMPLE / PLACEHOLDER only.
// Do NOT present this as real service listings. Connect to the backend when ready.

import type { JSX } from "react";
import Link from "next/link";

/** ⚠️ SAMPLE DATA — replace with real API data when the backend is ready. */
type ServiceCard = {
  id: string;
  name: string;
  category: string;
  technicianName: string;
  price: number;
  rating: number;
  reviewCount: number;
  /** Uses public/images/ assets already in the project. */
  image: string;
};

const SAMPLE_SERVICES: ServiceCard[] = [
  {
    id: "s1",
    name: "AC Deep Cleaning & Servicing",
    category: "AC Repair",
    technicianName: "Rafiqul Islam",
    price: 850,
    rating: 4.9,
    reviewCount: 128,
    image: "/images/showcase-2.png",
  },
  {
    id: "s2",
    name: "Laptop Screen Replacement",
    category: "Laptop Repair",
    technicianName: "Tanvir Ahmed",
    price: 1200,
    rating: 4.7,
    reviewCount: 94,
    image: "/images/device-1.png",
  },
  {
    id: "s3",
    name: "Washing Machine Motor Repair",
    category: "Washing Machine",
    technicianName: "Sumon Hossain",
    price: 650,
    rating: 4.8,
    reviewCount: 71,
    image: "/images/technician-3.png",
  },
  {
    id: "s4",
    name: "Mobile Screen Replacement",
    category: "Mobile Repair",
    technicianName: "Arif Billah",
    price: 500,
    rating: 4.6,
    reviewCount: 215,
    image: "/images/showcase-2.png",
  },
  {
    id: "s5",
    name: "Refrigerator Gas Recharge",
    category: "Refrigerator Repair",
    technicianName: "Mizanur Rahman",
    price: 950,
    rating: 4.9,
    reviewCount: 60,
    image: "/images/device-1.png",
  },
  {
    id: "s6",
    name: "LED TV Panel Repair",
    category: "TV Repair",
    technicianName: "Kabir Uddin",
    price: 1500,
    rating: 4.5,
    reviewCount: 43,
    image: "/images/technician-3.png",
  },
];

export default function FeaturedServices() {
  return (
    <section
      id="featured-services"
      aria-labelledby="featured-heading"
      className="bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Top Picks
            </p>
            <h2
              id="featured-heading"
              className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-foreground"
            >
              Featured Repair Services
            </h2>
          </div>

          {/* Sample data notice */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-400">
            <InfoIcon />
            Sample data — not real listings
          </span>
        </div>

        {/* Service card grid */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_SERVICES.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-7 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground dark:border-sky dark:text-sky dark:hover:bg-sky dark:hover:text-navy"
          >
            View All Services
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: ServiceCard }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(0,124,199,0.22)] dark:border-on-dark/10 dark:bg-surface/40">
      {/* Service image */}
      <div className="relative h-44 overflow-hidden bg-mist dark:bg-navy">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category chip */}
        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {service.category}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-semibold text-[15px] leading-snug text-foreground">
          {service.name}
        </h3>

        {/* Technician row */}
        <div className="flex items-center gap-2">
          {/* Avatar placeholder */}
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
            {service.technicianName.charAt(0)}
          </span>
          <span className="text-[13px] text-foreground/60">
            {service.technicianName}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={service.rating} />
          <span className="text-[13px] font-semibold text-foreground">
            {service.rating}
          </span>
          <span className="text-[12px] text-foreground/50">
            ({service.reviewCount} reviews)
          </span>
        </div>

        {/* Price + CTA row */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div>
            <span className="text-[13px] text-foreground/50">Starting at</span>
            <p className="text-[18px] font-bold text-foreground">
              ৳{service.price.toLocaleString()}
            </p>
          </div>

          {/* Non-navigating placeholder — service detail page not built yet */}
          <Link
            href="#featured-services"
            aria-label={`View details for ${service.name}`}
            className="rounded-full bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-[color-mix(in_oklab,var(--color-primary),black_12%)] hover:-translate-y-0.5"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-foreground/15 text-foreground/15"
          }`}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

function InfoIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function ArrowRightIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
