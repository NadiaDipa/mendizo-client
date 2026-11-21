"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, XCircle, Play, DollarSign, Loader2, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    requested: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    accepted: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    "in-progress": "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
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
        throw new Error(data.message || data.error || "Failed to load requests.");
      }

      setBookings(Array.isArray(data) ? data : data.requests || []);
    } catch (error) {
      console.error("Fetch requests error:", error);
      toast.error(error instanceof Error ? error.message : "Unable to load requests.");
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
    amount?: number
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
        }
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
      toast.error(error instanceof Error ? error.message : "Unable to update request.");
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
        <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
          Move your jobs through the pipeline: Requested → Accepted → In Progress → Completed (set final amount).
        </p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const count =
            filter.value === "all"
              ? bookings.length
              : bookings.filter((b) => b.status === filter.value).length;

          return (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                activeFilter === filter.value
                  ? "bg-primary text-white shadow"
                  : "border border-foreground/15 text-foreground/60 hover:bg-foreground/5 dark:border-white/15 dark:text-on-dark/60"
              }`}
            >
              {filter.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Booking list */}
      {loading ? (
        <div className="rounded-2xl border border-foreground/10 bg-white p-14 text-center text-foreground/50 dark:bg-surface/30">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
          Loading repair requests...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-white p-12 text-center dark:border-white/15 dark:bg-surface/30">
          <h3 className="font-semibold text-base text-navy dark:text-on-dark">
            No requests found
          </h3>
          <p className="mt-1 text-xs text-foreground/55">
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
              className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm dark:border-white/10 dark:bg-surface/40"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                {/* Service image */}
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-foreground/5 sm:w-36">
                  {booking.serviceImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle || "Service"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-foreground/40">
                      No Image
                    </div>
                  )}
                </div>

                {/* Booking information */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-navy dark:text-on-dark">
                        {booking.serviceTitle || "Service Booking"}
                      </h3>
                      <p className="text-[11px] font-mono text-foreground/45">
                        ID: {booking._id}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {formatStatus(booking.status)}
                    </span>
                  </div>

                  <div className="grid gap-2 text-xs text-foreground/70 dark:text-on-dark/70 sm:grid-cols-2">
                    <p>
                      <span className="text-foreground/50">Customer: </span>
                      <strong>{booking.customerName || "N/A"}</strong>
                    </p>

                    <p>
                      <span className="text-foreground/50">Phone: </span>
                      <strong>{booking.customerPhone || "N/A"}</strong>
                    </p>

                    <p>
                      <span className="text-foreground/50">Email: </span>
                      <span>{booking.customerEmail || "N/A"}</span>
                    </p>

                    <p>
                      <span className="text-foreground/50">Preferred Date: </span>
                      <strong>
                        {booking.preferredDate
                          ? new Date(booking.preferredDate).toLocaleDateString()
                          : "N/A"}
                      </strong>
                    </p>

                    <p className="sm:col-span-2">
                      <span className="text-foreground/50">Address: </span>
                      <span>{booking.address || "N/A"}</span>
                    </p>

                    <p className="sm:col-span-2 bg-foreground/[0.03] p-2.5 rounded-xl border border-foreground/5">
                      <span className="text-foreground/50 block font-semibold mb-0.5">Problem Description:</span>
                      {booking.problemDescription || "No description provided."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 border-t border-foreground/10 pt-3 text-xs dark:border-white/10">
                    <p>
                      <span className="text-foreground/50">Base Price: </span>
                      <strong className="text-navy dark:text-on-dark">
                        ${Number(booking.basePrice ?? 0).toLocaleString()} USD
                      </strong>
                    </p>

                    {booking.finalAmount !== undefined && (
                      <p>
                        <span className="text-foreground/50">Final Charged Amount: </span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ${Number(booking.finalAmount).toLocaleString()} USD
                        </strong>
                      </p>
                    )}

                    {booking.status === "completed" && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          booking.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {booking.paymentStatus === "paid" ? "Paid by Customer" : "Payment Pending"}
                      </span>
                    )}
                  </div>

                  {/* Pipeline Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-foreground/10 dark:border-white/10">
                    {/* requested -> Accept / Reject */}
                    {booking.status === "requested" && (
                      <>
                        <button
                          onClick={() => updateStatus(booking, "accepted")}
                          disabled={updatingId === booking._id}
                          className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50 transition"
                        >
                          Accept Request
                        </button>

                        <button
                          onClick={() => setRejectTarget(booking)}
                          disabled={updatingId === booking._id}
                          className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-950/30 disabled:opacity-50 transition"
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
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-sky hover:text-navy disabled:opacity-50 transition"
                      >
                        Start Work (Mark In-Progress)
                      </button>
                    )}

                    {/* in-progress -> Mark Completed (modal for finalAmount) */}
                    {booking.status === "in-progress" && (
                      <button
                        onClick={() => openCompleteModal(booking)}
                        disabled={updatingId === booking._id}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow"
                      >
                        Mark Completed (Set Final Price)
                      </button>
                    )}

                    {updatingId === booking._id && (
                      <span className="self-center text-xs text-foreground/50">
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
            <h2 className="font-display text-xl font-bold text-navy dark:text-on-dark">
              Complete Repair Service
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60 leading-relaxed">
              Enter the final amount ($) for this completed service. This amount will be charged when the customer pays via Stripe.
            </p>

            <label
              htmlFor="finalAmount"
              className="mt-5 block text-xs font-semibold text-foreground/75 mb-1.5"
            >
              Final Amount ($ USD)
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40 font-bold">$</span>
              <input
                id="finalAmount"
                type="number"
                min="1"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="w-full rounded-xl border border-foreground/15 bg-background pl-8 pr-4 py-2.5 text-sm outline-none focus:border-primary"
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
                className="rounded-xl border border-foreground/15 px-4 py-2 text-xs font-semibold text-foreground/70 hover:bg-foreground/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleComplete}
                disabled={updatingId === selectedBooking._id}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {updatingId === selectedBooking._id ? "Saving..." : "Confirm & Send to Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal (Requirement 5) */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-navy sm:p-7">
            <h3 className="font-display text-lg font-bold text-navy dark:text-on-dark">
              Reject Service Request?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60 leading-relaxed">
              Are you sure you want to reject the booking request from <strong>{rejectTarget.customerName}</strong> for <strong>{rejectTarget.serviceTitle}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="rounded-xl border border-foreground/15 px-4 py-2 text-xs font-semibold text-foreground/70 hover:bg-foreground/5"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => updateStatus(rejectTarget, "rejected")}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
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
