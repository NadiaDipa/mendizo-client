"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Calendar, Filter, Loader2, DollarSign } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type BookingItem = {
  _id: string;
  serviceTitle: string;
  category?: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  preferredDate?: string;
  basePrice?: number;
  finalAmount?: number;
  amount?: number;
  status: string;
  paymentStatus?: string;
  createdAt?: string;
};

const STATUS_FILTERS = [
  "all",
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        filter === "all"
          ? `${API_URL}/api/admin/bookings`
          : `${API_URL}/api/admin/bookings?status=${filter}`;

      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        throw new Error("Unable to fetch bookings.");
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin bookings error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy dark:text-on-dark">
            All Repair Bookings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
            Read-only audit record of every service request placed across Mendizo.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                filter === s
                  ? "bg-primary text-white shadow"
                  : "border border-foreground/15 text-foreground/60 hover:bg-foreground/5 dark:border-white/15 dark:text-on-dark/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm dark:border-white/10 dark:bg-surface/40">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-foreground/50">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-sm text-foreground/50">
            No bookings found under status &quot;{filter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-foreground/10 bg-foreground/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
                <tr>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Service
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Customer
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Technician
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Status
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Payment
                  </th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/8 dark:divide-white/8">
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-foreground/[0.015] dark:hover:bg-white/[0.02] transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-navy dark:text-on-dark max-w-[200px] truncate">
                        {b.serviceTitle}
                      </p>
                      <p className="text-[11px] font-mono text-foreground/40">
                        {b._id.slice(-8).toUpperCase()}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground dark:text-on-dark">{b.customerName}</p>
                      <p className="text-[11px] text-foreground/50 dark:text-on-dark/50">{b.customerEmail}</p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground dark:text-on-dark">{b.technicianName}</p>
                      <p className="text-[11px] text-foreground/50 dark:text-on-dark/50">{b.technicianEmail}</p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          b.status === "completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : b.status === "in-progress"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                            : b.status === "accepted"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                            : b.status === "cancelled" || b.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          b.paymentStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400"
                        }`}
                      >
                        {b.paymentStatus || "unpaid"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-navy dark:text-on-dark">
                      ${Number(b.finalAmount || b.amount || b.basePrice || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
