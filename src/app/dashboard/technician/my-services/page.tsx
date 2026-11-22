"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Wrench,
  Plus,
  Loader2,
  Trash2,
  Edit3,
  Power,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off" | string;
  serviceArea: string;
  image?: string;
  imageUrl?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
};

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  // Edit Modal State
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editMode, setEditMode] = useState("Home Visit");
  const [editArea, setEditArea] = useState("");
  const [editImage, setEditImage] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/services/technician/my`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to load services.");
      }

      setServices(Array.isArray(data) ? data : data.services || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to load services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const toggleAvailability = async (service: Service) => {
    try {
      setActionId(service._id);

      const response = await fetch(
        `${API_URL}/api/services/${service._id}/availability`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isAvailable: !service.isAvailable }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Could not update availability.");
      }

      // Trust the value returned by the server so the UI and MongoDB always agree.
      const nextAvailability =
        typeof data.isAvailable === "boolean" ? data.isAvailable : !service.isAvailable;

      setServices((current) =>
        current.map((item) =>
          item._id === service._id
            ? { ...item, isAvailable: nextAvailability }
            : item
        )
      );

      toast.success(
        nextAvailability
          ? "Service is now available and visible to customers."
          : "Service is now unavailable and hidden from customer requests."
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Availability update failed.");
    } finally {
      setActionId("");
    }
  };

  const deleteService = async () => {
    if (!deleteTarget) return;

    try {
      setActionId(deleteTarget._id);

      const response = await fetch(
        `${API_URL}/api/services/${deleteTarget._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Could not delete service.");
      }

      setServices((current) =>
        current.filter((service) => service._id !== deleteTarget._id)
      );

      toast.success("Service deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Service deletion failed.");
    } finally {
      setActionId("");
    }
  };

  const openEditModal = (service: Service) => {
    setEditTarget(service);
    setEditTitle(service.title);
    setEditCategory(service.category);
    setEditDescription(service.description);
    setEditBasePrice(String(service.basePrice));
    setEditDuration(service.estimatedDuration);
    setEditMode(service.serviceMode || "Home Visit");
    setEditArea(service.serviceArea);
    setEditImage(service.image || service.imageUrl || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    const price = Number(editBasePrice);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid base price.");
      return;
    }

    try {
      setSavingEdit(true);

      const response = await fetch(`${API_URL}/api/services/${editTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle.trim(),
          category: editCategory.trim(),
          description: editDescription.trim(),
          basePrice: price,
          estimatedDuration: editDuration.trim(),
          serviceMode: editMode,
          serviceArea: editArea.trim(),
          image: editImage.trim(),
          imageUrl: editImage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update service.");
      }

      toast.success("Service updated! It is now pending admin re-approval.");
      setEditTarget(null);
      await fetchServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update service.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-3xl">
            My Services
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
            Full CRUD management of your repair listings. Editing a service automatically resets its approval status to pending.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky hover:text-navy"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface/30">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground/50">Total Services</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy dark:text-on-dark">{services.length}</p>
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface/30">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Approved (Live)</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy dark:text-on-dark">
            {services.filter((s) => s.approvalStatus === "approved").length}
          </p>
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface/30">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending Review</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy dark:text-on-dark">
            {services.filter((s) => s.approvalStatus === "pending").length}
          </p>
        </div>
      </div>

      {/* Service list */}
      {loading ? (
        <div className="rounded-2xl border border-foreground/10 bg-white p-14 text-center dark:bg-surface/30 text-foreground/50">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
          Loading your services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-white px-6 py-14 text-center dark:bg-surface/30">
          <Wrench className="mx-auto h-12 w-12 text-foreground/30 mb-3" />
          <h3 className="font-display text-lg font-semibold text-navy dark:text-on-dark">
            No services listed yet
          </h3>
          <p className="mt-1 text-xs text-foreground/55">
            Submit your first repair service to start receiving customer requests.
          </p>
          <Link
            href="/dashboard/technician/add-service"
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-sky hover:text-navy transition"
          >
            Create a Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => {
            const displayImg = service.image || service.imageUrl || "/images/showcase-2.png";
            return (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm dark:border-white/10 dark:bg-surface/40 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-foreground/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImg}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        service.approvalStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : service.approvalStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {service.approvalStatus}
                    </span>
                  </div>

                  <div className="space-y-3 p-5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-sky">
                        {service.category}
                      </span>
                      <h3 className="font-display text-base font-bold text-navy dark:text-on-dark line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-foreground/60 dark:text-on-dark/60 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-foreground/5 p-2.5 dark:bg-white/5">
                        <p className="text-[10px] text-foreground/50">Base Price</p>
                        <p className="font-bold text-navy dark:text-on-dark">${Number(service.basePrice)}</p>
                      </div>

                      <div className="rounded-xl bg-foreground/5 p-2.5 dark:bg-white/5">
                        <p className="text-[10px] text-foreground/50">Duration</p>
                        <p className="font-semibold text-navy dark:text-on-dark">{service.estimatedDuration}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-foreground/55 space-y-0.5">
                      <p>Mode: <strong className="text-foreground/80 dark:text-on-dark/80">{service.serviceMode}</strong></p>
                      <p>Area: <strong className="text-foreground/80 dark:text-on-dark/80">{service.serviceArea}</strong></p>
                    </div>

                    {/* Availability toggle */}
                    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                            <Power className="h-3 w-3" />
                            Service Availability
                          </span>
                          <span
                            className={`mt-1 block text-xs font-semibold leading-snug ${
                              service.isAvailable
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {service.isAvailable
                              ? "Available — customers can request this service"
                              : "Unavailable — hidden from customer requests"}
                          </span>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={service.isAvailable}
                          aria-label={`Toggle availability for ${service.title}`}
                          disabled={actionId === service._id}
                          onClick={() => toggleAvailability(service)}
                          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${
                            service.isAvailable
                              ? "bg-emerald-500"
                              : "bg-foreground/25 dark:bg-white/25"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                              service.isAvailable ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {actionId === service._id && (
                        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-foreground/50 dark:text-on-dark/50">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Saving availability...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex gap-2 p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary/5 dark:border-sky/30 dark:text-sky"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(service)}
                    disabled={actionId === service._id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Edit Service Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-foreground/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-navy sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4 dark:border-white/10">
              <div>
                <h3 className="font-display text-xl font-bold text-navy dark:text-on-dark">
                  Edit Service
                </h3>
                <p className="text-xs text-foreground/55 mt-0.5">
                  Saving changes will send this service back to pending admin approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-foreground/50 hover:bg-foreground/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 outline-none focus:border-primary cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Starting Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editBasePrice}
                    onChange={(e) => setEditBasePrice(e.target.value)}
                    className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Service Mode</label>
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value)}
                    className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Shop Drop-off">Shop Drop-off</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="e.g. 2-3 hours"
                    className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Service Area</label>
                <input
                  type="text"
                  required
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  disabled={savingEdit}
                  className="rounded-xl border border-foreground/15 px-4 py-2 font-semibold hover:bg-foreground/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 font-bold text-white hover:bg-sky hover:text-navy transition disabled:opacity-50"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save & Submit for Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-navy sm:p-7"
          >
            <h3 className="font-display text-xl font-bold text-navy dark:text-on-dark">
              Delete Service?
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deleteTarget.title}</strong>? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={actionId === deleteTarget._id}
                className="rounded-xl border border-foreground/15 px-4 py-2 text-xs font-semibold text-foreground/70 hover:bg-foreground/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteService}
                disabled={actionId === deleteTarget._id}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionId === deleteTarget._id ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
