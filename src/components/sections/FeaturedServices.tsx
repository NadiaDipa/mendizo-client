"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Store,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_IMAGE = "/images/showcase-2.png";

// Used only when a service has no image of its own (or the image fails to load).
const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  "Laptop & PC": "/images/technician-3.png",
  Smartphone: "/images/technician-3.png",
};

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  image?: string;
  imageUrl?: string;
  technicianName: string;
  approvalStatus: string;
  isAvailable: boolean;
};

// "home-visit" -> "Home Visit"
function formatMode(mode: string) {
  if (!mode) return "";
  return mode.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        // Fetch the 6 latest approved and available services
        const res = await fetch(`${API_URL}/api/services?limit=6&sort=newest`);
        if (res.ok) {
          const data = await res.json();
          setServices(data.services || []);
        }
      } catch (err) {
        console.error("Failed to fetch featured services:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

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
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-sky">
              Top Picks
            </p>
            <h2
              id="featured-heading"
              className="mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-foreground"
            >
              Featured Repair Services
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
              Verified technicians, upfront pricing, and payment only after the job is completed.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified & Live Listings
          </span>
        </div>

        {/* Service card grid */}
        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-white p-2.5 shadow-sm animate-pulse dark:border-white/10 dark:bg-surface/30"
              >
                <div className="h-44 w-full rounded-2xl bg-foreground/10 dark:bg-white/10" />
                <div className="space-y-3 px-3 pb-3 pt-4">
                  <div className="h-3 w-1/4 rounded bg-foreground/10 dark:bg-white/10" />
                  <div className="h-5 w-3/4 rounded bg-foreground/10 dark:bg-white/10" />
                  <div className="h-3 w-full rounded bg-foreground/10 dark:bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-foreground/10 dark:bg-white/10" />
                  <div className="flex items-center justify-between pt-4">
                    <div className="h-9 w-28 rounded-full bg-foreground/10 dark:bg-white/10" />
                    <div className="h-9 w-24 rounded-full bg-foreground/10 dark:bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-foreground/20 p-12 text-center text-foreground/50">
            No approved featured services found right now.
          </div>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const fallbackImage =
                CATEGORY_FALLBACK_IMAGE[service.category] || DEFAULT_IMAGE;
              const displayImage = service.image || service.imageUrl || fallbackImage;
              const isHomeVisit = /home/i.test(service.serviceMode || "");
              const ModeIcon = isHomeVisit ? Home : Store;
              const technicianName = service.technicianName || "Technician";

              return (
                <li key={service._id} className="h-full">
                  <article className="group flex h-full min-w-0 flex-col rounded-3xl border border-foreground/10 bg-white p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_22px_44px_-16px_rgba(0,124,199,0.35)] dark:border-white/10 dark:bg-surface/40">
                    {/* Inset image with rounded corners */}
                    <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-foreground/5 dark:bg-navy">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayImage}
                        alt={service.title}
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.dataset.fallback) {
                            img.dataset.fallback = "1";
                            img.src = fallbackImage;
                          }
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"
                      />

                      <AvailabilityBadge
                        isAvailable={service.isAvailable}
                        className="absolute left-3 top-3"
                      />

                      {/* Price lives on the image (single line) */}
                      <div className="absolute bottom-3 right-3 flex items-baseline gap-1.5 whitespace-nowrap rounded-full bg-white/95 px-3.5 py-1.5 shadow-lg backdrop-blur">
                        <span className="text-[11px] font-medium text-foreground/55">
                          From
                        </span>
                        <span className="text-base font-bold leading-none text-navy">
                          ${Number(service.basePrice).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary dark:text-sky">
                        {service.category}
                      </span>

                      <h3 className="mt-1 line-clamp-1 break-words text-[17px] font-semibold leading-snug tracking-tight text-navy transition-colors group-hover:text-primary dark:text-on-dark dark:group-hover:text-sky">
                        {service.title}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 min-h-[2.6rem] break-words text-[13px] leading-relaxed text-foreground/60 dark:text-on-dark/60">
                        {service.description}
                      </p>

                      {/* Info chips */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-foreground/[0.05] px-3 py-1.5 text-xs font-medium text-foreground/75 dark:bg-white/[0.07] dark:text-on-dark/75">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary dark:text-sky" />
                          <span className="truncate">{service.serviceArea}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-3 py-1.5 text-xs font-medium text-foreground/75 dark:bg-white/[0.07] dark:text-on-dark/75">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-primary dark:text-sky" />
                          {service.estimatedDuration || "Standard"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-3 py-1.5 text-xs font-medium text-foreground/75 dark:bg-white/[0.07] dark:text-on-dark/75">
                          <ModeIcon className="h-3.5 w-3.5 shrink-0 text-primary dark:text-sky" />
                          {formatMode(service.serviceMode)}
                        </span>
                      </div>

                      {/* Footer: technician + action */}
                      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary dark:bg-sky/20 dark:text-sky"
                          >
                            {technicianName.charAt(0)}
                          </span>
                          <div className="min-w-0 leading-tight">
                            <span className="block text-[10px] text-foreground/45 dark:text-on-dark/45">
                              Technician
                            </span>
                            <span className="block truncate text-[13px] font-semibold text-navy dark:text-on-dark">
                              {technicianName}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/services/${service._id}`}
                          aria-label={`View details for ${service.title}`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-navy px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary dark:bg-primary dark:hover:bg-sky dark:hover:text-navy"
                        >
                          Details
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white dark:border-sky dark:text-sky dark:hover:bg-sky dark:hover:text-navy shadow-sm"
          >
            Browse All Approved Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}