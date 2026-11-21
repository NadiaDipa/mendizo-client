"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Wrench,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles,
  DollarSign,
  User,
  X,
} from "lucide-react";

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
  technicianEmail: string;
  approvalStatus: string;
  isAvailable: boolean;
};

type TechnicianSummary = {
  name: string;
  email: string;
  image?: string;
  area: string;
  bio: string;
};

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const currentUser = session?.user;

  const [service, setService] = useState<Service | null>(null);
  const [technician, setTechnician] = useState<TechnicianSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Request Repair Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/api/services/${serviceId}`);
        if (!res.ok) {
          throw new Error("Service not found or unavailable.");
        }

        const data = await res.json();
        setService(data.service);
        setTechnician(data.technician);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Service not found.");
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [serviceId]);

  // Handle clicking "Request Repair"
  const handleOpenRequestModal = () => {
    if (!currentUser) {
      toast.info("Please sign in to submit a repair request.");
      router.push(`/sign-in?callbackUrl=/services/${serviceId}`);
      return;
    }

    if (currentUser.role === "technician" || currentUser.role === "admin") {
      toast.error("Only registered customers can request repair services.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerPhone.trim()) {
      toast.error("Please provide your contact phone number.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide your service / pickup address.");
      return;
    }

    if (!preferredDate) {
      toast.error("Please select a preferred service date.");
      return;
    }

    if (problemDescription.trim().length < 20) {
      toast.error("Problem description must be at least 20 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        serviceId: service?._id,
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        preferredDate,
        problemDescription: problemDescription.trim(),
      };

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      toast.success("Repair request placed successfully!");
      setIsModalOpen(false);
      router.push("/dashboard/customer/bookings");
    } catch (err) {
      console.error("Submit repair error:", err);
      toast.error(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center pt-24">
          <div className="flex flex-col items-center gap-3 text-foreground/60">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-semibold">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-xl px-5 py-36 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-navy dark:text-on-dark">
            Service Not Available
          </h2>
          <p className="mt-2 text-sm text-foreground/60 dark:text-on-dark/60">
            This service does not exist or has not been approved by an administrator yet.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky hover:text-navy transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Other Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayImage = service.image || service.imageUrl || "/images/showcase-2.png";
  const isTechnicianOrAdmin = currentUser?.role === "technician" || currentUser?.role === "admin";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24">
        {/* Back Link */}
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-navy dark:text-sky dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all services
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column: Image, Details, Description */}
          <div className="space-y-8">
            {/* Banner Image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-3xl border border-foreground/10 bg-navy shadow-md dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={service.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-primary/95 px-4 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-md">
                {service.category}
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-navy/90 px-3.5 py-1.5 text-xs font-semibold text-sky shadow-md backdrop-blur-md">
                {service.serviceMode}
              </span>
            </div>

            {/* Title & Key Attributes */}
            <div>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-navy dark:text-on-dark leading-tight">
                {service.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground/60 dark:text-on-dark/60">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary dark:text-sky" />
                  {service.serviceArea}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary dark:text-sky" />
                  Estimated: {service.estimatedDuration}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Mendizo Verified
                </span>
              </div>
            </div>

            {/* Full Service Description */}
            <div className="rounded-3xl border border-foreground/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-surface/40 sm:p-8">
              <h2 className="font-display text-xl font-bold text-navy dark:text-on-dark">
                About This Service
              </h2>
              <div className="mt-4 whitespace-pre-line text-sm sm:text-base leading-relaxed text-foreground/80 dark:text-on-dark/80">
                {service.description}
              </div>

              {/* What's included checklist */}
              <div className="mt-6 border-t border-foreground/10 pt-6 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-sky">
                  Mendizo Guarantee
                </h3>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 text-xs sm:text-sm text-foreground/75 dark:text-on-dark/75">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    Pay online only after service is completed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    Transparent base pricing & upfront estimates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    Verified technician with background check
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    Live status tracking from request to finish
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Technician Summary Card */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="sticky top-28 rounded-3xl border border-primary/20 bg-white p-6 shadow-xl dark:border-sky/20 dark:bg-surface/50 sm:p-8">
              <div className="flex items-baseline justify-between border-b border-foreground/10 pb-6 dark:border-white/10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Starting Price
                  </span>
                  <p className="mt-1 font-display text-3xl sm:text-4xl font-bold text-navy dark:text-on-dark">
                    ${Number(service.basePrice).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
                  Pay After Service
                </span>
              </div>

              <div className="mt-6 space-y-3 text-xs sm:text-sm text-foreground/70 dark:text-on-dark/70">
                <div className="flex justify-between">
                  <span>Service Delivery:</span>
                  <span className="font-semibold text-foreground dark:text-on-dark">{service.serviceMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage Area:</span>
                  <span className="font-semibold text-foreground dark:text-on-dark">{service.serviceArea}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Time:</span>
                  <span className="font-semibold text-foreground dark:text-on-dark">{service.estimatedDuration}</span>
                </div>
              </div>

              {/* Request Button */}
              <div className="mt-8">
                {isTechnicianOrAdmin ? (
                  <div className="rounded-2xl bg-amber-50 p-4 text-center text-xs font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                    Only customer accounts can request a repair service. Log in with a customer account to place a request.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenRequestModal}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky hover:text-navy hover:shadow-xl"
                  >
                    <Send className="h-4 w-4" />
                    Request Repair Now
                  </button>
                )}
              </div>

              {/* Technician Summary */}
              {technician && (
                <div className="mt-8 border-t border-foreground/10 pt-6 dark:border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50 mb-4">
                    Assigned Technician
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-primary/10">
                      {technician.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={technician.image}
                          alt={technician.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-primary text-xl">
                          {technician.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-navy dark:text-on-dark truncate">
                        {technician.name}
                      </p>
                      <p className="text-xs text-foreground/60 dark:text-on-dark/60 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-sky" />
                        {technician.area || service.serviceArea}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-foreground/70 dark:text-on-dark/70 line-clamp-3">
                        {technician.bio || "Experienced repair technician dedicated to providing transparent and high quality repairs."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Repair Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-foreground/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-navy sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4 dark:border-white/10">
              <div>
                <h3 className="font-display text-xl font-bold text-navy dark:text-on-dark">
                  Request Repair
                </h3>
                <p className="text-xs text-foreground/60 dark:text-on-dark/60 mt-0.5">
                  {service.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-foreground/50 hover:bg-foreground/5 dark:text-on-dark/50 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="mt-5 space-y-4">
              {/* Customer Name & Email (Read-only from session) */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 dark:text-on-dark/70 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={currentUser?.name || "Customer"}
                    className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3.5 py-2 text-xs font-medium text-foreground/70 dark:border-white/10 dark:bg-white/5 dark:text-on-dark/70 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 dark:text-on-dark/70 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={currentUser?.email || ""}
                    className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3.5 py-2 text-xs font-medium text-foreground/70 dark:border-white/10 dark:bg-white/5 dark:text-on-dark/70 outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 dark:text-on-dark/70 mb-1">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +880 1700 000000"
                  className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary dark:border-white/15 dark:text-on-dark"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 dark:text-on-dark/70 mb-1">
                  Service / Pickup Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 42, Road 7, Sector 3, Uttara, Dhaka"
                  className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary dark:border-white/15 dark:text-on-dark"
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 dark:text-on-dark/70 mb-1">
                  Preferred Date (Today or Future) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary dark:border-white/15 dark:text-on-dark"
                />
              </div>

              {/* Problem Description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-foreground/70 dark:text-on-dark/70">
                    Problem Description (Min 20 characters) <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-bold ${
                      problemDescription.length >= 20 ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {problemDescription.length}/20 min
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe what is wrong with the device or appliance in detail..."
                  className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary dark:border-white/15 dark:text-on-dark resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-foreground/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="rounded-xl border border-foreground/15 px-4 py-2 text-xs font-semibold text-foreground/70 hover:bg-foreground/5 dark:border-white/15 dark:text-on-dark/70 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || problemDescription.trim().length < 20}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white transition hover:bg-sky hover:text-navy disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Confirm Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
