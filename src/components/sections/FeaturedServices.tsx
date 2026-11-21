"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Wrench, CheckCircle2, Clock, MapPin, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
                className="flex h-96 flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white p-4 shadow-sm animate-pulse dark:border-white/10 dark:bg-surface/30"
              >
                <div className="h-44 w-full rounded-xl bg-foreground/10 dark:bg-white/10" />
                <div className="mt-4 h-4 w-1/3 rounded bg-foreground/10" />
                <div className="mt-2 h-6 w-3/4 rounded bg-foreground/10" />
                <div className="mt-auto h-10 w-full rounded bg-foreground/10" />
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
              const displayImage = service.image || service.imageUrl || "/images/showcase-2.png";
              return (
                <li key={service._id} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/10 dark:bg-surface/40">
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-foreground/5 dark:bg-navy">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayImage}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold text-white shadow backdrop-blur-sm">
                        {service.category}
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[11px] font-medium text-sky shadow backdrop-blur-sm">
                        {service.serviceMode}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold text-base leading-snug text-foreground transition-colors group-hover:text-primary dark:text-on-dark dark:group-hover:text-sky">
                        {service.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground/60 dark:text-on-dark/60">
                        {service.description}
                      </p>

                      <div className="mt-4 space-y-1 border-t border-foreground/8 pt-3 text-xs text-foreground/55 dark:border-white/8 dark:text-on-dark/60">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0 dark:text-sky" />
                          <span className="truncate">{service.serviceArea}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary shrink-0 dark:text-sky" />
                          <span>{service.estimatedDuration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-foreground/80 dark:text-on-dark/80">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">By {service.technicianName}</span>
                        </div>
                      </div>

                      {/* Price and CTA row */}
                      <div className="mt-auto flex items-center justify-between border-t border-foreground/8 pt-4 dark:border-white/8">
                        <div>
                          <span className="text-[11px] font-medium text-foreground/50 dark:text-on-dark/50">
                            Starting at
                          </span>
                          <p className="font-display text-xl font-bold text-navy dark:text-on-dark">
                            ${Number(service.basePrice).toLocaleString()}
                          </p>
                        </div>

                        <Link
                          href={`/services/${service._id}`}
                          className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow transition-all duration-200 hover:bg-sky hover:text-navy hover:-translate-y-0.5"
                        >
                          View Details
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
