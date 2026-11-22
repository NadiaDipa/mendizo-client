"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  ArrowUpDown,
  RotateCcw,
  Wrench,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "All",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES = [
  { label: "All Modes", value: "all" },
  { label: "Home Visit", value: "Home Visit" },
  { label: "Shop Drop-off", value: "Shop Drop-off" },
];

const SORT_OPTIONS = [
  { label: "Newest Added", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

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

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state persistence (Challenge 1)
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialMode = searchParams.get("serviceMode") || "all";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [services, setServices] = useState<Service[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Category strip navigation (arrows + edge fades + mobile swipe)
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateCategoryScroll = useCallback(() => {
    const el = categoryScrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scrollCategories = useCallback((direction: -1 | 1) => {
    const el = categoryScrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction * Math.max(el.clientWidth * 0.7, 180),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    updateCategoryScroll();
    window.addEventListener("resize", updateCategoryScroll);
    return () => window.removeEventListener("resize", updateCategoryScroll);
  }, [updateCategoryScroll]);

  // Keep the selected category visible inside the horizontal strip.
  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;

    const active = el.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    updateCategoryScroll();
  }, [selectedCategory, updateCategoryScroll]);

  // Sync state when URL params change (e.g. from Home category click or back/forward)
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      const map: Record<string, string> = {
        "ac-servicing": "AC",
        ac: "AC",
        refrigerator: "Refrigerator",
        "washing-machine": "Washing Machine",
        "laptop-service": "Laptop & PC",
        "laptop-pc": "Laptop & PC",
        "mobile-phone": "Smartphone",
        smartphone: "Smartphone",
        "tv-repair": "TV",
        tv: "TV",
        "electrical-wiring": "Electrical",
        electrical: "Electrical",
      };
      const resolved = map[urlCategory.toLowerCase()] || urlCategory;
      setSelectedCategory(resolved);
    }
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) setSearch(urlSearch);
    const urlMode = searchParams.get("serviceMode");
    if (urlMode) setSelectedMode(urlMode);
    const urlSort = searchParams.get("sort");
    if (urlSort) setSelectedSort(urlSort);
    const urlPage = searchParams.get("page");
    if (urlPage) setCurrentPage(Math.max(1, parseInt(urlPage, 10) || 1));
  }, [searchParams]);

  // Fetch from server using MongoDB queries with pagination (25 items per page)
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (selectedCategory && selectedCategory !== "All") {
        params.set("category", selectedCategory);
      }
      if (selectedMode && selectedMode !== "all") {
        params.set("serviceMode", selectedMode);
      }
      if (selectedSort) params.set("sort", selectedSort);
      params.set("page", String(currentPage));
      params.set("limit", "25");

      // Update browser URL query string without reloading page
      router.replace(`/services?${params.toString()}`, { scroll: false });

      // All Services shows approved listings even when the technician has turned
      // them off, so customers can see the availability badge. The homepage keeps
      // the default available-only behaviour.
      params.set("includeUnavailable", "true");

      const res = await fetch(`${API_URL}/api/services?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Unable to fetch services from server.");
      }

      const data = await res.json();
      setServices(data.services || []);
      setTotalCount(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Browse services error:", err);
      setError(err instanceof Error ? err.message : "Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedMode, selectedSort, currentPage, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchServices]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedMode("all");
    setSelectedSort("newest");
    setCurrentPage(1);
    router.replace("/services", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-navy pt-32 pb-16 text-on-dark sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky">
              <Wrench className="h-3.5 w-3.5" />
              Verified Technicians • Guaranteed Quality
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-on-dark sm:text-5xl">
              Find & Book Expert Repair Services
            </h1>
            <p className="mt-4 text-base text-on-dark/75 sm:text-lg">
              Search by appliance, device type, or problem. Transparent pricing, step-by-step
              tracking, and payment only after the work is completed.
            </p>

            {/* Main Search Bar */}
            <div className="mt-8 flex items-center rounded-2xl border border-sky/30 bg-white/10 p-2 backdrop-blur-md shadow-2xl focus-within:border-sky sm:p-2.5">
              <Search className="ml-3 h-5 w-5 text-sky shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by service name, category, or device (e.g. AC, Screen, Motor)..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-white/50 outline-none sm:text-base"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="mr-2 text-xs font-semibold text-sky hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <section className="sticky top-20 z-20 border-b border-foreground/10 bg-white/95 px-5 py-4 backdrop-blur-md dark:border-white/10 dark:bg-navy/95 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Category Tabs */}
          <div className="relative min-w-0 flex-1 xl:max-w-3xl">
            {/* Left fade + arrow (mobile / narrow screens) */}
            {canScrollLeft && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-navy dark:via-navy/85 sm:hidden"
                />
                <button
                  type="button"
                  onClick={() => scrollCategories(-1)}
                  aria-label="Scroll categories left"
                  className="absolute left-0 top-1/2 z-20 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-foreground/15 bg-white text-foreground shadow-md transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-navy dark:text-on-dark dark:hover:border-sky dark:hover:text-sky sm:hidden"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </>
            )}

            <div
              ref={categoryScrollRef}
              onScroll={updateCategoryScroll}
              role="group"
              aria-label="Filter services by category"
              className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 no-scrollbar snap-x sm:flex-wrap sm:overflow-visible sm:pb-0"
            >
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    data-active={active}
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`shrink-0 snap-start whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                      active
                        ? "bg-primary text-white shadow-md ring-2 ring-primary/25 ring-offset-2 ring-offset-white dark:ring-primary/40 dark:ring-offset-navy"
                        : "border border-foreground/15 text-foreground/70 hover:border-primary hover:text-primary dark:border-white/15 dark:text-on-dark/70 dark:hover:text-sky"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Right fade + arrow (mobile / narrow screens) */}
            {canScrollRight && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white via-white/85 to-transparent dark:from-navy dark:via-navy/85 sm:hidden"
                />
                <button
                  type="button"
                  onClick={() => scrollCategories(1)}
                  aria-label="Scroll categories right"
                  className="absolute right-0 top-1/2 z-20 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-foreground/15 bg-white text-foreground shadow-md transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-navy dark:text-on-dark dark:hover:border-sky dark:hover:text-sky sm:hidden"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Mode & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
            {/* Service Mode Filter */}
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-foreground/15 bg-background px-3 py-2 text-xs sm:text-sm dark:border-white/15">
              <SlidersHorizontal className="h-4 w-4 text-primary dark:text-sky" />
              <select
                value={selectedMode}
                onChange={(e) => {
                  setSelectedMode(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium text-foreground outline-none dark:text-on-dark cursor-pointer"
              >
                {SERVICE_MODES.map((mode) => (
                  <option key={mode.value} value={mode.value} className="bg-white dark:bg-navy text-foreground dark:text-on-dark">
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-foreground/15 bg-background px-3 py-2 text-xs sm:text-sm dark:border-white/15">
              <ArrowUpDown className="h-4 w-4 text-primary dark:text-sky" />
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium text-foreground outline-none dark:text-on-dark cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-navy text-foreground dark:text-on-dark">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button */}
            {(search || selectedCategory !== "All" || selectedMode !== "all" || selectedSort !== "newest") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Results summary */}
        <div className="mb-8 flex items-center justify-between">
          <p className="min-w-0 text-sm font-medium text-foreground/60 dark:text-on-dark/60">
            Showing <span className="font-bold text-foreground dark:text-on-dark">{services.length}</span>{" "}
            approved service{services.length === 1 ? "" : "s"}
            <span className="hidden sm:inline"> — availability is shown on every listing</span>
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchServices}
              className="mt-3 inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-sky"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white p-4 shadow-sm animate-pulse dark:border-white/10 dark:bg-surface/30"
              >
                <div className="h-48 w-full rounded-xl bg-foreground/10 dark:bg-white/10" />
                <div className="mt-4 h-4 w-1/3 rounded bg-foreground/10 dark:bg-white/10" />
                <div className="mt-2 h-6 w-3/4 rounded bg-foreground/10 dark:bg-white/10" />
                <div className="mt-4 h-12 w-full rounded bg-foreground/10 dark:bg-white/10" />
                <div className="mt-auto pt-4 flex justify-between">
                  <div className="h-6 w-20 rounded bg-foreground/10 dark:bg-white/10" />
                  <div className="h-8 w-24 rounded-full bg-foreground/10 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-foreground/20 bg-white p-10 text-center shadow-sm dark:border-white/15 dark:bg-surface/30">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
              <Wrench className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-foreground dark:text-on-dark">
              No services match your search
            </h3>
            <p className="mt-2 text-sm text-foreground/60 dark:text-on-dark/60">
              We couldn&apos;t find any approved repair services matching your current filters. Try searching with different keywords or reset your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => {
              const displayImage = service.image || service.imageUrl || "/images/showcase-2.png";
              return (
                <article
                  key={service._id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-foreground/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_16px_36px_-12px_rgba(0,124,199,0.22)] dark:border-white/10 dark:bg-surface/40"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-foreground/5 dark:bg-navy">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImage}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
                      {service.category}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-[11px] font-medium text-sky shadow-sm backdrop-blur-sm">
                      {service.serviceMode}
                    </span>
                    <AvailabilityBadge
                      isAvailable={service.isAvailable}
                      className="absolute bottom-3 left-3"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="break-words font-semibold text-base leading-snug text-foreground transition-colors group-hover:text-primary dark:text-on-dark dark:group-hover:text-sky">
                      {service.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 break-words text-xs leading-relaxed text-foreground/60 dark:text-on-dark/60">
                      {service.description}
                    </p>

                    <div className="mt-4 space-y-1.5 border-t border-foreground/8 pt-3 text-xs text-foreground/55 dark:border-white/8 dark:text-on-dark/60">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0 dark:text-sky" />
                        <span className="truncate">{service.serviceArea}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0 dark:text-sky" />
                        <span>{service.estimatedDuration || "Standard service"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-foreground/80 dark:text-on-dark/80 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">By {service.technicianName}</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="mt-auto flex items-center justify-between border-t border-foreground/8 pt-4 dark:border-white/8">
                      <div>
                        <span className="text-[11px] font-medium text-foreground/50 dark:text-on-dark/50">
                          Starting at
                        </span>
                        <p className="text-lg font-bold text-navy dark:text-on-dark">
                          ${Number(service.basePrice).toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/services/${service._id}`}
                        className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-sky hover:text-navy"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Server-Side Pagination Bar */}
        {totalCount > 0 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-6 sm:flex-row dark:border-white/10">
            <p className="text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
              Showing{" "}
              <span className="font-bold text-navy dark:text-on-dark">
                {Math.min((currentPage - 1) * 25 + 1, totalCount)}
              </span>{" "}
              to{" "}
              <span className="font-bold text-navy dark:text-on-dark">
                {Math.min(currentPage * 25, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-navy dark:text-on-dark">
                {totalCount}
              </span>{" "}
              services
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
                className="rounded-xl border border-foreground/15 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/80 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-on-dark/80 dark:hover:border-sky dark:hover:text-sky"
              >
                Previous
              </button>

              <span className="px-3 text-xs sm:text-sm font-semibold text-foreground/75 dark:text-on-dark/75">
                Page {currentPage} of {Math.max(1, totalPages)}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || loading}
                className="rounded-xl border border-foreground/15 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/80 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-on-dark/80 dark:hover:border-sky dark:hover:text-sky"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
