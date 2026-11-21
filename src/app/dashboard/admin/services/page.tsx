"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Loader2, MapPin, DollarSign, Filter } from "lucide-react";

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
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt?: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        activeTab === "all"
          ? `${API_URL}/api/admin/services`
          : `${API_URL}/api/admin/services?approvalStatus=${activeTab}`;

      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        throw new Error("Unable to fetch services.");
      }

      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin services error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleApproval = async (service: Service, status: "approved" | "rejected") => {
    try {
      setActionId(service._id);

      const res = await fetch(`${API_URL}/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ approvalStatus: status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Approval action failed.");
      }

      toast.success(`Service "${service.title}" has been ${status}.`);
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, approvalStatus: status } : s))
      );
    } catch (err) {
      console.error("Approval error:", err);
      toast.error(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionId(null);
    }
  };

  const tabs = [
    { label: "Pending Approval", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "All Services", value: "all" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy dark:text-on-dark">
          Service Approval & Moderation
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
          Review repair services submitted by technicians. Approve or reject before public listing.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as typeof activeTab)}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === tab.value
                ? "bg-primary text-white shadow-md"
                : "border border-foreground/15 text-foreground/60 hover:bg-foreground/5 dark:border-white/15 dark:text-on-dark/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center p-14 text-foreground/50">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-white p-12 text-center dark:border-white/15 dark:bg-surface/30">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-foreground/5 text-foreground/40">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-semibold text-navy dark:text-on-dark">
            {activeTab === "pending" ? "No Pending Services" : `No ${activeTab} services found`}
          </h3>
          <p className="mt-1 text-xs text-foreground/55">
            {activeTab === "pending"
              ? "All submitted services have been reviewed."
              : `There are no ${activeTab} services at this time.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => {
            const displayImg = service.image || service.imageUrl || "/images/showcase-2.png";
            return (
              <div
                key={service._id}
                className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm dark:border-white/10 dark:bg-surface/40 flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 dark:border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayImg}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-sky">
                          {service.category}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            service.approvalStatus === "approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                              : service.approvalStatus === "rejected"
                              ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                          }`}
                        >
                          {service.approvalStatus}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-navy dark:text-on-dark mt-1 line-clamp-1">
                        {service.title}
                      </h3>

                      <p className="mt-1 text-xs text-foreground/50 dark:text-on-dark/50">
                        Technician: <span className="font-semibold text-foreground/80 dark:text-on-dark/80">{service.technicianName}</span> ({service.technicianEmail})
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-xs text-foreground/60 dark:text-on-dark/60">
                        <span>Price: <strong className="text-navy dark:text-on-dark">${service.basePrice}</strong></span>
                        <span>•</span>
                        <span>{service.serviceMode}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-foreground/70 dark:text-on-dark/70 line-clamp-2 leading-relaxed bg-foreground/[0.02] dark:bg-white/[0.02] p-2.5 rounded-xl">
                    {service.description}
                  </p>
                </div>

                {/* Approval Action Bar */}
                <div className="border-t border-foreground/10 p-3 bg-foreground/[0.015] dark:border-white/10 dark:bg-white/[0.02] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={actionId === service._id || service.approvalStatus === "approved"}
                    onClick={() => handleApproval(service, "approved")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-40"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Approve
                  </button>

                  <button
                    type="button"
                    disabled={actionId === service._id || service.approvalStatus === "rejected"}
                    onClick={() => handleApproval(service, "rejected")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-950/30 disabled:opacity-40 transition"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
