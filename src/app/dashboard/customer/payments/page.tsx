"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  DollarSign,
  Loader2,
  ArrowRight,
  Receipt,
  CheckCircle2,
} from "lucide-react";

const API_URL = "";

const CARD =
  "rounded-2xl border border-foreground/8 bg-white shadow-sm dark:border-white/8 dark:bg-white/[0.04]";

type PaymentItem = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  technicianName: string;
  amount: number;
  currency: string;
  transactionId: string;
  paymentStatus: string;
  paidAt: string;
};

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/customer/payments`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Unable to fetch payment history.");
      }

      const data = await res.json();
      setPayments(data.payments || []);
      setTotalPaid(data.totalPaid || 0);
    } catch (err) {
      console.error("Customer payments error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to load payment history.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-primary dark:text-sky">
            Payments
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-navy dark:text-on-dark">
            Payment History
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground/75 dark:text-on-dark/80 sm:text-sm">
            Official ledger of your completed Stripe payments for completed
            repair jobs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-foreground/15 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-foreground/75 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-on-dark/80">
            {payments.length} transactions
          </span>
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-[13px] font-bold text-primary dark:border-sky/25 dark:bg-sky/15 dark:text-sky">
            Total Paid: ${totalPaid.toLocaleString()} USD
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`${CARD} overflow-hidden`}>
        {loading ? (
          <div className="flex items-center justify-center p-14 text-[13px] text-foreground/70 dark:text-on-dark/75">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-14 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-foreground/5 text-foreground/40 mb-3">
              <Receipt className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-base text-navy dark:text-on-dark">
              No payments yet
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/75 dark:text-on-dark/80">
              When a technician completes your repair request, you can pay via
              Stripe and view the receipt here.
            </p>
            <Link
              href="/dashboard/customer/bookings"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[13px] font-bold text-white transition hover:bg-sky hover:text-navy"
            >
              Check My Bookings
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px] sm:text-sm">
              <thead className="bg-foreground/[0.02] dark:bg-white/[0.02]">
                <tr className="border-b border-foreground/8 dark:border-white/8">
                  <th className="px-5 py-3.5 text-[13px] font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/75">
                    Service
                  </th>
                  <th className="px-4 py-3.5 text-[13px] font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/75">
                    Technician
                  </th>
                  <th className="px-4 py-3.5 text-[13px] font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/75">
                    Amount
                  </th>
                  <th className="px-4 py-3.5 text-[13px] font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/75">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3.5 text-[13px] font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/75">
                    Payment Date
                  </th>
                  <th className="px-5 py-3.5 text-[13px] font-bold uppercase tracking-wider text-foreground/70 dark:text-on-dark/75 text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/8 dark:divide-white/8">
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-foreground/[0.015] dark:hover:bg-white/[0.02] transition"
                  >
                    <td className="min-w-[180px] max-w-[280px] whitespace-normal px-5 py-4 font-semibold text-navy dark:text-on-dark [overflow-wrap:anywhere]">
                      {p.serviceTitle}
                    </td>

                    <td className="px-4 py-4 text-foreground/70 dark:text-on-dark/70">
                      {p.technicianName}
                    </td>

                    <td className="px-4 py-4 font-display font-bold text-navy dark:text-on-dark">
                      ${Number(p.amount).toLocaleString()} USD
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-md bg-foreground/[0.05] px-2 py-1 font-mono text-[13px] text-foreground/75 dark:bg-white/[0.06] dark:text-on-dark/80">
                        {p.transactionId}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-foreground/75 dark:text-on-dark/80">
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

                    <td className="px-5 py-4 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[13px] font-bold uppercase text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Paid
                      </span>
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
