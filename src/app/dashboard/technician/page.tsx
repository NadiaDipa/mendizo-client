
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Service = {
  _id: string;
  approvalStatus: "pending" | "approved" | "rejected";
  title: string;
};

export default function TechnicianDashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [servicesResponse, requestsResponse] = await Promise.all([
          fetch(`${API_URL}/api/technician/services`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/technician/requests`, {
            credentials: "include",
          }),
        ]);

        if (!servicesResponse.ok) {
          throw new Error("Unable to load technician services.");
        }

        const servicesData = await servicesResponse.json();
        setServices(servicesData);

        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          setPendingRequests(Array.isArray(requestsData) ? requestsData.filter(
            (request: { status: string }) => request.status === "requested"
          ).length : 0);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: BriefcaseBusiness,
    },
    {
      title: "Approved Services",
      value: approvedServices,
      icon: CheckCircle2,
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-sky">
            Technician Portal
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-3xl">
            Technician Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
            Manage your services and customer requests.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky hover:text-navy"
        >
          <Plus size={18} />
          Add New Service
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-foreground/50">
          Loading dashboard...
        </p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                      {stat.title}
                    </p>
                    <div className="rounded-xl bg-primary/10 p-3 dark:bg-sky/15">
                      <Icon className="h-5 w-5 text-primary dark:text-sky" />
                    </div>
                  </div>

                  <p className="mt-4 font-display text-3xl font-bold text-navy dark:text-on-dark">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy dark:text-on-dark">
                Recent Services
              </h2>

              <Link
                href="/dashboard/technician/my-services"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline dark:text-sky"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {services.length === 0 ? (
              <div className="py-8 text-center">
                <BriefcaseBusiness className="mx-auto mb-3 h-10 w-10 text-primary/40 dark:text-sky/40" />
                <p className="font-medium text-foreground/70 dark:text-on-dark/70">
                  You haven&apos;t added any services yet.
                </p>
                <p className="mt-1 text-sm text-foreground/50 dark:text-on-dark/50">
                  Add your first service to get started.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-foreground/8 dark:divide-white/8">
                {services.slice(0, 5).map((service) => (
                  <div
                    key={service._id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <p className="font-medium text-foreground dark:text-on-dark">
                      {service.title}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        service.approvalStatus === "approved"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : service.approvalStatus === "rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      }`}
                    >
                      {service.approvalStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
