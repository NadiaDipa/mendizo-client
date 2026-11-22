"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Edit3,
  Home,
  Loader2,
  MapPin,
  Plus,
  Power,
  Store,
  Timer,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

const API_URL = "";
const FALLBACK_IMAGE = "/images/showcase-2.png";

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

type Filter = "all" | "approved" | "pending" | "rejected";

const STATUS_META = {
  approved: {
    label: "Live",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending review",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-red-50 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
  },
} as const;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "approved", label: "Live" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
];

const FIELD_CLASS =
  "w-full rounded-xl border border-foreground/15 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition placeholder:text-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/15 dark:bg-white/5 dark:text-on-dark dark:placeholder:text-on-dark/40";

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

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
        throw new Error(
          data.message || data.error || "Failed to load services.",
        );
      }

      setServices(Array.isArray(data) ? data : data.services || []);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to load services.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Close modals with the Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (!savingEdit) setEditTarget(null);
      setDeleteTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [savingEdit]);

  const counts = useMemo(
    () => ({
      all: services.length,
      approved: services.filter((s) => s.approvalStatus === "approved").length,
      pending: services.filter((s) => s.approvalStatus === "pending").length,
      rejected: services.filter((s) => s.approvalStatus === "rejected").length,
    }),
    [services],
  );

  const visibleServices = useMemo(
    () =>
      filter === "all"
        ? services
        : services.filter((s) => s.approvalStatus === filter),
    [services, filter],
  );

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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Could not update availability.",
        );
      }

      const nextAvailability =
        typeof data.isAvailable === "boolean"
          ? data.isAvailable
          : !service.isAvailable;

      setServices((current) =>
        current.map((item) =>
          item._id === service._id
            ? { ...item, isAvailable: nextAvailability }
            : item,
        ),
      );

      toast.success(
        nextAvailability
          ? "Service is now available and visible to customers."
          : "Service is now unavailable and hidden from customer requests.",
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Availability update failed.",
      );
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Could not delete service.",
        );
      }

      setServices((current) =>
        current.filter((service) => service._id !== deleteTarget._id),
      );

      toast.success("Service deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Service deletion failed.",
      );
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

      const response = await fetch(
        `${API_URL}/api/services/${editTarget._id}`,
        {
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update service.");
      }

      toast.success("Service updated! It is now pending admin re-approval.");
      setEditTarget(null);
      await fetchServices();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update service.",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-3xl">
            My Services
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-foreground/60 dark:text-on-dark/60">
            Manage your repair listings. Editing a service sends it back for
            admin approval.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(0,124,199,0.9)] transition hover:-translate-y-0.5 hover:bg-sky hover:text-navy"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </Link>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Services"
          value={counts.all}
          icon={Briefcase}
          tone="primary"
        />
        <StatCard
          label="Approved (Live)"
          value={counts.approved}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Pending Review"
          value={counts.pending}
          icon={Clock}
          tone="amber"
        />
      </section>

      {/* Filter tabs */}
      {!loading && services.length > 0 && (
        <div
          role="tablist"
          aria-label="Filter services by status"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {FILTERS.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-foreground/10 bg-white text-foreground/70 hover:border-primary/40 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-on-dark/70 dark:hover:text-sky"
                }`}
              >
                {item.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-foreground/10 text-foreground/60 dark:bg-white/10 dark:text-on-dark/60"
                  }`}
                >
                  {counts[item.key]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2" aria-busy="true">
          {[0, 1].map((n) => (
            <div
              key={n}
              className="animate-pulse overflow-hidden rounded-2xl border border-foreground/10 bg-white dark:border-white/10 dark:bg-surface/40"
            >
              <div className="h-48 bg-foreground/10 dark:bg-white/10" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-20 rounded bg-foreground/10 dark:bg-white/10" />
                <div className="h-5 w-3/4 rounded bg-foreground/10 dark:bg-white/10" />
                <div className="h-3 w-full rounded bg-foreground/10 dark:bg-white/10" />
                <div className="h-3 w-2/3 rounded bg-foreground/10 dark:bg-white/10" />
                <div className="h-16 rounded-xl bg-foreground/10 dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-foreground/20 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-surface/30">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
            <Wrench className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-navy dark:text-on-dark">
            No services listed yet
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-foreground/60 dark:text-on-dark/60">
            Submit your first repair service to start receiving customer
            requests.
          </p>
          <Link
            href="/dashboard/technician/add-service"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky hover:text-navy"
          >
            <Plus className="h-4 w-4" />
            Create a Service
          </Link>
        </div>
      ) : visibleServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/20 bg-white px-6 py-12 text-center text-sm text-foreground/60 dark:border-white/15 dark:bg-surface/30 dark:text-on-dark/60">
          No services in this category.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {visibleServices.map((service) => {
            const displayImg =
              service.image || service.imageUrl || FALLBACK_IMAGE;
            const status =
              STATUS_META[service.approvalStatus] ?? STATUS_META.pending;
            const busy = actionId === service._id;
            const ModeIcon =
              service.serviceMode === "Home Visit" ? Home : Store;

            return (
              <article
                key={service._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-surface/40"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-foreground/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayImg}
                    alt={service.title}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = "1";
                        img.src = FALLBACK_IMAGE;
                      }
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy shadow-sm backdrop-blur">
                    {service.category}
                  </span>

                  <span
                    className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ring-1 ring-inset backdrop-blur ${status.badge}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                    />
                    {status.label}
                  </span>

                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/75">
                      Starting from
                    </p>
                    <p className="text-2xl font-bold leading-none">
                      ${Number(service.basePrice)}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <h3 className="line-clamp-1 text-[17px] font-semibold leading-snug tracking-tight text-navy dark:text-on-dark">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-foreground/60 dark:text-on-dark/60">
                      {service.description}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-foreground/10 py-4 text-xs dark:border-white/10">
                    <MetaItem icon={Timer} label="Duration">
                      {service.estimatedDuration}
                    </MetaItem>
                    <MetaItem icon={ModeIcon} label="Mode">
                      {service.serviceMode}
                    </MetaItem>
                    <div className="col-span-2">
                      <MetaItem icon={MapPin} label="Service area">
                        {service.serviceArea}
                      </MetaItem>
                    </div>
                  </dl>

                  {service.approvalStatus === "rejected" && (
                    <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-300">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      This service was rejected. Edit it and resubmit for
                      review.
                    </p>
                  )}

                  {/* Availability */}
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-foreground/[0.04] px-3.5 py-3 dark:bg-white/[0.05]">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/50 dark:text-on-dark/50">
                        <Power className="h-3 w-3" />
                        Visibility
                      </p>
                      <p
                        className={`mt-0.5 text-xs font-semibold ${
                          service.isAvailable
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {busy ? (
                          <span className="inline-flex items-center gap-1.5 text-foreground/50 dark:text-on-dark/50">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Saving...
                          </span>
                        ) : service.isAvailable ? (
                          "Available to customers"
                        ) : (
                          "Hidden from customers"
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={service.isAvailable}
                      aria-label={`Toggle availability for ${service.title}`}
                      disabled={busy}
                      onClick={() => toggleAvailability(service)}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${
                        service.isAvailable
                          ? "bg-emerald-500"
                          : "bg-foreground/25 dark:bg-white/25"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                          service.isAvailable
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(service)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/30 px-3 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white dark:border-sky/30 dark:text-sky dark:hover:bg-sky dark:hover:text-navy"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(service)}
                      disabled={busy}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !savingEdit)
              setEditTarget(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-service-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-foreground/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-navy sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4 dark:border-white/10">
              <div>
                <h3
                  id="edit-service-title"
                  className="text-xl font-semibold text-navy dark:text-on-dark"
                >
                  Edit Service
                </h3>
                <p className="mt-1 text-xs text-foreground/55 dark:text-on-dark/55">
                  Saving changes sends this service back to pending admin
                  approval.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditTarget(null)}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground/50 transition hover:bg-foreground/5 dark:text-on-dark/60 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <Field label="Title">
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={FIELD_CLASS}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className={`${FIELD_CLASS} cursor-pointer`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Starting Price ($)">
                  <input
                    type="number"
                    min="1"
                    required
                    value={editBasePrice}
                    onChange={(e) => setEditBasePrice(e.target.value)}
                    className={FIELD_CLASS}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Service Mode">
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value)}
                    className={`${FIELD_CLASS} cursor-pointer`}
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Shop Drop-off">Shop Drop-off</option>
                  </select>
                </Field>

                <Field label="Duration">
                  <input
                    type="text"
                    required
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="e.g. 2-3 hours"
                    className={FIELD_CLASS}
                  />
                </Field>
              </div>

              <Field label="Service Area">
                <input
                  type="text"
                  required
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className={FIELD_CLASS}
                />
              </Field>

              <Field label="Description">
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={`${FIELD_CLASS} resize-none`}
                />
              </Field>

              <Field label="Image URL (optional)">
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://..."
                  className={FIELD_CLASS}
                />
              </Field>

              <div className="flex justify-end gap-3 border-t border-foreground/10 pt-4 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  disabled={savingEdit}
                  className="rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-semibold text-foreground/70 transition hover:bg-foreground/5 dark:border-white/15 dark:text-on-dark/70 dark:hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky hover:text-navy disabled:opacity-50"
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

      {/* Delete modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
            className="w-full max-w-sm rounded-3xl border border-foreground/10 bg-white p-6 text-center shadow-2xl dark:border-white/10 dark:bg-navy sm:p-7"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3
              id="delete-service-title"
              className="mt-4 text-xl font-semibold text-navy dark:text-on-dark"
            >
              Delete this service?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-foreground/60 dark:text-on-dark/60">
              <strong className="text-foreground/80 dark:text-on-dark/80">
                {deleteTarget.title}
              </strong>{" "}
              will be permanently removed. This action cannot be undone.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={actionId === deleteTarget._id}
                className="rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-semibold text-foreground/70 transition hover:bg-foreground/5 dark:border-white/15 dark:text-on-dark/70 dark:hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteService}
                disabled={actionId === deleteTarget._id}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {actionId === deleteTarget._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small presentational helpers ---------- */

type IconType = ComponentType<{ className?: string }>;

const STAT_TONES = {
  primary: "bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky",
  emerald:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
  amber:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
} as const;

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: IconType;
  tone: keyof typeof STAT_TONES;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface/30">
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${STAT_TONES[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-medium text-foreground/55 dark:text-on-dark/55">
          {label}
        </p>
        <p className="mt-0.5 text-3xl font-bold leading-none tracking-tight text-navy dark:text-on-dark">
          {value}
        </p>
      </div>
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  children,
}: {
  icon: IconType;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] font-medium uppercase tracking-wider text-foreground/45 dark:text-on-dark/45">
          {label}
        </dt>
        <dd className="truncate text-xs font-semibold text-navy dark:text-on-dark">
          {children}
        </dd>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground/70 dark:text-on-dark/70">
        {label}
      </span>
      {children}
    </label>
  );
}
