"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Wrench,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CARD =
  "rounded-2xl border border-foreground/8 bg-white p-5 shadow-sm transition-all duration-300 dark:border-white/8 dark:bg-white/[0.04]";

type AdminStats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalBookings: number;
  totalRevenue: number;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTechnicians: 0,
    pendingServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/api/admin/stats`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unable to fetch admin statistics.");
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Admin stats error:", err);
        setError(err instanceof Error ? err.message : "Failed to load stats.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      label: "Total Registered Users",
      value: stats.totalUsers,
      hint: "Customers, technicians & admins",
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400",
      href: "/dashboard/admin/users",
    },
    {
      label: "Verified Technicians",
      value: stats.totalTechnicians,
      hint: "Active service providers",
      icon: Wrench,
      color: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300",
      href: "/dashboard/admin/users",
    },
    {
      label: "Pending Services",
      value: stats.pendingServices,
      hint: "Awaiting admin approval",
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
      href: "/dashboard/admin/services?approvalStatus=pending",
    },
    {
      label: "Total Platform Revenue",
      value: `$${Number(stats.totalRevenue).toLocaleString()}`,
      hint: "Completed Stripe transactions",
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
      href: "/dashboard/admin/transactions",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-sky">
          Admin Portal
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-navy dark:text-on-dark">
          System Overview
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
          Monitor platform metrics, user roles, service approvals, and Stripe financial records.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`${CARD} group hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    {card.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-navy dark:text-on-dark">
                    {loading ? "..." : card.value}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50 dark:text-on-dark/50">
                    {card.hint}
                  </p>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-base font-bold text-navy dark:text-on-dark mb-4">
          Management Controls
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/admin/users"
            className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition dark:border-white/10 dark:bg-surface/30"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-navy dark:text-on-dark">Manage Users</p>
                <p className="text-xs text-foreground/50 dark:text-on-dark/50">Assign roles & access</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-foreground/40" />
          </Link>

          <Link
            href="/dashboard/admin/services"
            className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition dark:border-white/10 dark:bg-surface/30"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-navy dark:text-on-dark">Service Approvals</p>
                <p className="text-xs text-foreground/50 dark:text-on-dark/50">Approve or reject</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-foreground/40" />
          </Link>

          <Link
            href="/dashboard/admin/bookings"
            className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition dark:border-white/10 dark:bg-surface/30"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-navy dark:text-on-dark">All Bookings</p>
                <p className="text-xs text-foreground/50 dark:text-on-dark/50">Monitor platform jobs</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-foreground/40" />
          </Link>

          <Link
            href="/dashboard/admin/transactions"
            className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition dark:border-white/10 dark:bg-surface/30"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-navy dark:text-on-dark">Transactions</p>
                <p className="text-xs text-foreground/50 dark:text-on-dark/50">Stripe revenues</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-foreground/40" />
          </Link>
        </div>
      </div>
    </div>
  );
}
