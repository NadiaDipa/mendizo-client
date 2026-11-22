"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowRight, Loader2, AlertCircle, Receipt } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<{
    amount?: number;
    transactionId?: string;
    serviceTitle?: string;
  } | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError("Missing payment session ID.");
        setVerifying(false);
        return;
      }

      try {
        let verifyUrl = `${API_URL}/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`;

        const res = await fetch(verifyUrl, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Payment verification failed.");
        }

        setSuccess(true);
        // Stable id prevents duplicate toasts when the effect re-runs.
        toast.success("Payment verified! Your booking is fully paid.", {
          id: "payment-verified",
        });
        setPaymentDetails({
          amount: data.payment?.amount,
          transactionId: data.payment?.transactionId,
          serviceTitle: data.payment?.serviceTitle || data.booking?.serviceTitle,
        });
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err instanceof Error ? err.message : "Unable to verify payment.");
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto flex min-h-[75vh] max-w-xl flex-col items-center justify-center px-5 pt-32 pb-16 text-center">
        {verifying ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="font-display text-2xl font-bold text-navy dark:text-on-dark">
              Verifying Payment...
            </h2>
            <p className="text-sm text-foreground/60 dark:text-on-dark/60">
              Please wait while we confirm your Stripe transaction.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-xl dark:border-red-900/40 dark:bg-surface/50 sm:p-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-navy dark:text-on-dark">
              Payment Verification Failed
            </h2>
            <p className="mt-2 text-sm text-foreground/60 dark:text-on-dark/60">
              {error}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/dashboard/customer/bookings"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky hover:text-navy transition"
              >
                Go to My Bookings
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-3xl border border-emerald-200 bg-white p-8 shadow-2xl dark:border-emerald-900/40 dark:bg-surface/50 sm:p-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-navy dark:text-on-dark">
              Payment Successful!
            </h1>
            <p className="mt-2 text-sm text-foreground/60 dark:text-on-dark/60">
              Thank you! Your payment has been received and verified. The booking is now marked as Paid.
            </p>

            {/* Receipt Summary Card */}
            <div className="mt-6 rounded-2xl border border-foreground/10 bg-background/50 p-5 text-left text-xs sm:text-sm dark:border-white/10 space-y-2.5">
              {paymentDetails?.serviceTitle && (
                <div className="flex justify-between">
                  <span className="text-foreground/55 dark:text-on-dark/55">Service:</span>
                  <span className="font-semibold text-foreground dark:text-on-dark truncate max-w-[200px]">
                    {paymentDetails.serviceTitle}
                  </span>
                </div>
              )}
              {paymentDetails?.amount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-foreground/55 dark:text-on-dark/55">Amount Paid:</span>
                  <span className="font-bold text-navy dark:text-on-dark">
                    ${Number(paymentDetails.amount).toLocaleString()} USD
                  </span>
                </div>
              )}
              {paymentDetails?.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-foreground/55 dark:text-on-dark/55">Transaction ID:</span>
                  <span className="font-mono text-xs font-semibold text-primary dark:text-sky bg-primary/10 px-2 py-0.5 rounded">
                    {paymentDetails.transactionId}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-foreground/55 dark:text-on-dark/55">Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Completed & Recorded
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/dashboard/customer/bookings"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky hover:text-navy"
              >
                Back to My Bookings
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/customer/payments"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold text-foreground/80 hover:bg-foreground/5 dark:border-white/20 dark:text-on-dark"
              >
                <Receipt className="h-4 w-4" />
                View Payment History
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Verifying transaction...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
