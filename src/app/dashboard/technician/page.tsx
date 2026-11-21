
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
    <main className="min-h-screen bg-[#EEFBFB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#12232E] sm:text-3xl">
              Technician Overview
            </h1>
            <p className="mt-2 text-sm text-[#203647]">
              Manage your services and customer requests.
            </p>
          </div>

          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center gap-2 rounded-lg bg-[#007CC7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0066A6]"
          >
            <Plus size={18} />
            Add New Service
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-[#203647]">
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
                    className="rounded-xl border border-[#D5E8F0] bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#526777]">
                        {stat.title}
                      </p>
                      <div className="rounded-lg bg-[#EEFBFB] p-3">
                        <Icon className="h-5 w-5 text-[#007CC7]" />
                      </div>
                    </div>

                    <p className="mt-4 text-3xl font-bold text-[#12232E]">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-xl border border-[#D5E8F0] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#12232E]">
                  Recent Services
                </h2>

                <Link
                  href="/dashboard/technician/my-services"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#007CC7] hover:underline"
                >
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              {services.length === 0 ? (
                <div className="py-8 text-center">
                  <BriefcaseBusiness className="mx-auto mb-3 h-10 w-10 text-[#4DA8DA]" />
                  <p className="font-medium text-[#203647]">
                    You haven&apos;t added any services yet.
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your first service to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {services.slice(0, 5).map((service) => (
                    <div
                      key={service._id}
                      className="flex flex-wrap items-center justify-between gap-3 py-4"
                    >
                      <p className="font-medium text-[#203647]">
                        {service.title}
                      </p>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
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
    </main>
  );
}
