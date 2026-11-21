"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { DollarSign, Loader2, ArrowUpRight, CheckCircle2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: string;
  paidAt: string;
};

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/transactions`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Unable to fetch transactions.");
      }

      const data = await res.json();
      setPayments(data.payments || []);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (err) {
      console.error("Admin transactions error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy dark:text-on-dark">
          Stripe Transactions & Platform Revenue
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
          Complete ledger of paid repair orders processed securely through Stripe Checkout.
        </p>
      </div>

      {/* Total Revenue Highlight Banner (Requirement: Show total revenue above the table) */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6 dark:border-emerald-800/40 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Total Platform Revenue
            </p>
            <p className="mt-1 font-display text-4xl sm:text-5xl font-extrabold text-navy dark:text-on-dark">
              ${totalRevenue.toLocaleString()} USD
            </p>
            <p className="mt-1 text-xs text-foreground/55 dark:text-on-dark/55">
              Accumulated from {payments.length} verified successful payments.
            </p>
          </div>

          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg">
            <DollarSign className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm dark:border-white/10 dark:bg-surface/40">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-foreground/50">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading transaction ledger...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-sm text-foreground/50">
            No payments recorded yet.
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
                    Paid By (Customer)
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Earned By (Technician)
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                    Date
                  </th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/8 dark:divide-white/8">
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-foreground/[0.015] dark:hover:bg-white/[0.02] transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-navy dark:text-on-dark max-w-[180px] truncate">
                        {p.serviceTitle}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        Verified Paid
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground dark:text-on-dark">{p.customerName}</p>
                      <p className="text-[11px] text-foreground/50 dark:text-on-dark/50">{p.customerEmail}</p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground dark:text-on-dark">{p.technicianName}</p>
                      <p className="text-[11px] text-foreground/50 dark:text-on-dark/50">{p.technicianEmail}</p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-md bg-foreground/[0.05] px-2 py-1 font-mono text-xs font-semibold text-foreground/70 dark:bg-white/[0.06] dark:text-on-dark/70">
                        {p.transactionId}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-xs text-foreground/60 dark:text-on-dark/60">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>

                    <td className="px-5 py-4 text-right font-display text-base font-bold text-navy dark:text-on-dark">
                      ${Number(p.amount).toLocaleString()} USD
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
