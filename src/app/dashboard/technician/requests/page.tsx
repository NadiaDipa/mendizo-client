"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Play,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL = "";

type BookingStatus =
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "rejected"
  | "cancelled";

type Booking = {
  _id: string;
  serviceTitle?: string;
  serviceImage?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  preferredDate?: string;
  problemDescription?: string;
  basePrice?: number;
  finalAmount?: number;
  amount?: number;
  status: BookingStatus;
  paymentStatus?: string;
};

const filters = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

function getStatusStyle(status: string) {
  const styles: Record<string, string> = {
    requested:
      "bg-amber-100 text-amber-800 ring-amber-600/25 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
    accepted:
      "bg-blue-100 text-blue-800 ring-blue-600/25 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
    "in-progress":
      "bg-purple-100 text-purple-800 ring-purple-600/25 dark:bg-purple-400/15 dark:text-purple-300 dark:ring-purple-400/30",
    completed:
      "bg-green-100 text-green-800 ring-green-600/25 dark:bg-green-400/15 dark:text-green-300 dark:ring-green-400/30",
    rejected:
      "bg-red-100 text-red-800 ring-red-600/25 dark:bg-red-400/15 dark:text-red-300 dark:ring-red-400/30",
    cancelled:
      "bg-gray-100 text-gray-800 ring-gray-600/25 dark:bg-gray-500/20 dark:text-gray-200 dark:ring-white/15",
  };

  return styles[status] || "bg-gray-100 text-gray-800 ring-gray-600/25";
}

function formatStatus(status: string) {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Mark Completed Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState("");

  // Reject Confirmation Modal (Requirement 5: Ask confirmation before rejecting a request)
  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/bookings/technician`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to load requests.",
        );
      }

      setBookings(Array.isArray(data) ? data : data.requests || []);
    } catch (error) {
      console.error("Fetch requests error:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to load requests.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (
    booking: Booking,
    status: BookingStatus,
    amount?: number,
  ) => {
    try {
      setUpdatingId(booking._id);

      const payload: {
        status: BookingStatus;
        finalAmount?: number;
      } = { status };

      if (amount !== undefined) {
        payload.finalAmount = amount;
      }

      const response = await fetch(
        `${API_URL}/api/bookings/${booking._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Status update failed.");
      }

      toast.success(`Request marked as ${formatStatus(status).toLowerCase()}.`);
      setSelectedBooking(null);
      setRejectTarget(null);
      setFinalAmount("");
      await fetchRequests();
    } catch (error) {
      console.error("Update request error:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to update request.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openCompleteModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setFinalAmount(String(booking.basePrice ?? booking.amount ?? ""));
  };

  const handleComplete = () => {
    if (!selectedBooking) return;

    const amount = Number(finalAmount);

    if (!finalAmount || !Number.isFinite(amount) || amount <= 0) {
      toast.error("Please enter a valid final amount ($).");
      return;
    }

    updateStatus(selectedBooking, "completed", amount);
  };

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-3xl">
          Service Requests & Job Pipeline
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/75 dark:text-on-dark/80 sm:text-base">
          Move your jobs through the pipeline: Requested → Accepted → In
          Progress → Completed (set final amount).
        </p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {filters.map((filter) => {
          const count =
            filter.value === "all"
              ? bookings.length
              : bookings.filter((b) => b.status === filter.value).length;

          return (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition sm:text-[15px] ${
                activeFilter === filter.value
                  ? "bg-primary text-white shadow-md"
                  : "border border-foreground/20 text-foreground/80 hover:bg-foreground/5 hover:text-primary dark:border-white/20 dark:text-on-dark/80 dark:hover:text-sky"
              }`}
            >
              {filter.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Booking list */}
      {loading ? (
        <div className="rounded-2xl border border-foreground/15 bg-white p-14 text-center text-[15px] font-medium text-foreground/70 dark:border-white/15 dark:bg-surface/30 dark:text-on-dark/75">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          Loading repair requests...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-white p-12 text-center dark:border-white/15 dark:bg-surface/30">
          <h3 className="font-display text-lg font-bold text-navy dark:text-on-dark">
            No requests found
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground/75 dark:text-on-dark/80">
            {activeFilter === "all"
              ? "You haven't received any booking requests yet."
              : `There are currently no ${formatStatus(activeFilter).toLowerCase()} requests.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-foreground/15 bg-white shadow-sm transition hover:shadow-md dark:border-white/15 dark:bg-surface/40"
            >
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-7">
                {/* Service image */}
                <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-foreground/5 sm:h-36 sm:w-40">
                  {booking.serviceImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle || "Service"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-foreground/60 dark:text-on-dark/65">
                      No Image
                    </div>
                  )}
                </div>

                {/* Booking information */}
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-navy dark:text-on-dark sm:text-[22px]">
                        {booking.serviceTitle || "Service Booking"}
                      </h3>
                      <p className="mt-1 text-[13px] font-mono text-foreground/60 dark:text-on-dark/65">
                        ID: {booking._id}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-wide ring-1 ring-inset ${getStatusStyle(
                        booking.status,
                      )}`}
                    >
                      {formatStatus(booking.status)}
                    </span>
                  </div>

                  <section className="rounded-2xl border border-foreground/15 bg-foreground/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.04] sm:p-5">
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-foreground/75 dark:text-on-dark/80">
                      Customer details
                    </h4>

                    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                      <InfoItem label="Customer" value={booking.customerName || "N/A"} />
                      <InfoItem label="Phone" value={booking.customerPhone || "N/A"} />
                      <InfoItem label="Email" value={booking.customerEmail || "N/A"} />
                      <InfoItem
                        label="Preferred Date"
                        value={
                          booking.preferredDate
                            ? new Date(booking.preferredDate).toLocaleDateString()
                            : "N/A"
                        }
                      />
                      <InfoItem
                        label="Address"
                        value={booking.address || "N/A"}
                        className="sm:col-span-2"
                      />

                      <div className="rounded-xl border border-foreground/10 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5 sm:col-span-2">
                        <dt className="mb-1.5 text-[13px] font-bold uppercase tracking-wide text-foreground/70 dark:text-on-dark/75">
                          Problem Description
                        </dt>
                        <dd className="text-[15px] leading-relaxed text-foreground/85 dark:text-on-dark/90">
                          {booking.problemDescription || "No description provided."}
                        </dd>
                      </div>
                    </dl>
                  </section>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-foreground/15 pt-5 text-sm dark:border-white/15">
                    <p>
                      <span className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70 dark:text-on-dark/75">
                        Base Price:{" "}
                      </span>
                      <strong className="text-lg font-bold text-navy dark:text-on-dark">
                        ${Number(booking.basePrice ?? 0).toLocaleString()} USD
                      </strong>
                    </p>

                    {booking.finalAmount !== undefined && (
                      <p>
                        <span className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70 dark:text-on-dark/75">
                          Final Charged Amount:{" "}
                        </span>
                        <strong className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                          ${Number(booking.finalAmount).toLocaleString()} USD
                        </strong>
                      </p>
                    )}

                    {booking.status === "completed" && (
                      <span
                        className={`rounded-full px-3 py-1 text-[13px] font-bold uppercase tracking-wide ring-1 ring-inset ${
                          booking.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800 ring-emerald-600/25 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30"
                            : "bg-amber-100 text-amber-800 ring-amber-600/25 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30"
                        }`}
                      >
                        {booking.paymentStatus === "paid"
                          ? "Paid by Customer"
                          : "Payment Pending"}
                      </span>
                    )}
                  </div>

                  {/* Pipeline Action Buttons */}
                  <div className="flex flex-wrap gap-3 border-t border-foreground/15 pt-5 dark:border-white/15">
                    {/* requested -> Accept / Reject */}
                    {booking.status === "requested" && (
                      <>
                        <button
                          onClick={() => updateStatus(booking, "accepted")}
                          disabled={updatingId === booking._id}
                          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50 sm:text-[15px]"
                        >
                          Accept Request
                        </button>

                        <button
                          onClick={() => setRejectTarget(booking)}
                          disabled={updatingId === booking._id}
                          className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-950/30 sm:text-[15px]"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* accepted -> Start Work (becomes in-progress) */}
                    {booking.status === "accepted" && (
                      <button
                        onClick={() => updateStatus(booking, "in-progress")}
                        disabled={updatingId === booking._id}
                        className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky hover:text-navy disabled:opacity-50 sm:text-[15px]"
                      >
                        Start Work (Mark In-Progress)
                      </button>
                    )}

                    {/* in-progress -> Mark Completed (modal for finalAmount) */}
                    {booking.status === "in-progress" && (
                      <button
                        onClick={() => openCompleteModal(booking)}
                        disabled={updatingId === booking._id}
                        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50 sm:text-[15px]"
                      >
                        Mark Completed (Set Final Price)
                      </button>
                    )}

                    {updatingId === booking._id && (
                      <span className="self-center text-sm font-medium text-foreground/70 dark:text-on-dark/75">
                        Updating pipeline...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Work Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-navy sm:p-7">
            <h2 className="font-display text-2xl font-bold text-navy dark:text-on-dark">
              Complete Repair Service
            </h2>

            <p className="mt-2 text-[15px] leading-relaxed text-foreground/75 dark:text-on-dark/80 sm:text-base">
              Enter the final amount ($) for this completed service. This amount
              will be charged when the customer pays via Stripe.
            </p>

            <label
              htmlFor="finalAmount"
              className="mt-5 mb-2 block text-sm font-bold text-foreground/80 dark:text-on-dark/85"
            >
              Final Amount ($ USD)
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-foreground/60 dark:text-on-dark/70">
                $
              </span>
              <input
                id="finalAmount"
                type="number"
                min="1"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="w-full rounded-xl border border-foreground/20 bg-background py-3 pl-8 pr-4 text-[15px] outline-none focus:border-primary dark:border-white/20"
                placeholder="Enter final amount in USD"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedBooking(null);
                  setFinalAmount("");
                }}
                disabled={updatingId === selectedBooking._id}
                className="rounded-xl border border-foreground/20 px-4 py-2.5 text-sm font-bold text-foreground/80 hover:bg-foreground/5 dark:border-white/20 dark:text-on-dark/85"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleComplete}
                disabled={updatingId === selectedBooking._id}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {updatingId === selectedBooking._id
                  ? "Saving..."
                  : "Confirm & Send to Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal (Requirement 5) */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-navy sm:p-7">
            <h3 className="font-display text-xl font-bold text-navy dark:text-on-dark">
              Reject Service Request?
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/75 dark:text-on-dark/80 sm:text-base">
              Are you sure you want to reject the booking request from{" "}
              <strong className="font-bold text-navy dark:text-on-dark">
                {rejectTarget.customerName}
              </strong>{" "}
              for{" "}
              <strong className="font-bold text-navy dark:text-on-dark">
                {rejectTarget.serviceTitle}
              </strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="rounded-xl border border-foreground/20 px-4 py-2.5 text-sm font-bold text-foreground/80 hover:bg-foreground/5 dark:border-white/20 dark:text-on-dark/85"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => updateStatus(rejectTarget, "rejected")}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small presentational helper ---------- */

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70 dark:text-on-dark/75">
        {label}
      </dt>
      <dd className="mt-1 break-words text-[15px] font-bold text-navy dark:text-on-dark">
        {value}
      </dd>
    </div>
  );
}
