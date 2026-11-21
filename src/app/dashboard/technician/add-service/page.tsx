"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  ArrowLeft,
  ImagePlus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BriefcaseBusiness,
  DollarSign,
  Clock,
  MapPin,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Exact categories matching PDF assignment requirement
const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function AddServicePage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [serviceMode, setServiceMode] = useState("Home Visit");
  const [serviceArea, setServiceArea] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or less.");
      return;
    }

    setImage(file);
  };

  const uploadImage = async (): Promise<string> => {
    if (!image) {
      throw new Error("Please select a service image.");
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Image upload failed.");
      }

      return result.imageUrl as string;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !basePrice ||
      !estimatedDuration.trim() ||
      !serviceArea.trim() ||
      !image
    ) {
      toast.error("Please complete all required fields including the service image.");
      return;
    }

    const price = Number(basePrice);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Starting price must be a positive number.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Upload the selected image to ImgBB
      const uploadedImageUrl = await uploadImage();

      // Step 2: Save the service via protected API
      const serviceData = {
        title: title.trim(),
        category,
        description: description.trim(),
        basePrice: price,
        estimatedDuration: estimatedDuration.trim(),
        serviceMode,
        serviceArea: serviceArea.trim(),
        image: uploadedImageUrl,
        imageUrl: uploadedImageUrl,
      };

      const response = await fetch(`${API_URL}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to create service.");
      }

      toast.success("Service submitted! Waiting for admin review and approval.");
      router.push("/dashboard/technician/my-services");
    } catch (error) {
      console.error("Create service error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const technicianName = session?.user?.name || "Loading...";
  const technicianEmail = session?.user?.email || "Loading...";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/technician/my-services"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline dark:text-sky"
        >
          <ArrowLeft size={16} />
          Back to My Services
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy dark:text-on-dark">
          Add New Service
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
          Provide complete repair details and submit them for administrator approval.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Technician Info (Read-only from session) */}
        <section className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface/30">
          <h2 className="font-bold text-sm text-navy dark:text-on-dark mb-3">
            Technician Information (Session Verified)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
            <div>
              <label className="block text-foreground/50 mb-1">Technician Name</label>
              <input
                value={sessionLoading ? "Loading..." : technicianName}
                readOnly
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3.5 py-2 text-foreground/70 dark:border-white/10 dark:bg-white/5 dark:text-on-dark/70 outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-foreground/50 mb-1">Technician Email</label>
              <input
                value={sessionLoading ? "Loading..." : technicianEmail}
                readOnly
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3.5 py-2 text-foreground/70 dark:border-white/10 dark:bg-white/5 dark:text-on-dark/70 outline-none font-medium"
              />
            </div>
          </div>
        </section>

        {/* Basic Information */}
        <section className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface/30 space-y-4">
          <h2 className="font-bold text-sm text-navy dark:text-on-dark">
            Service Details
          </h2>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Split AC Deep Cleaning & Chemical Wash"
              className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-primary cursor-pointer"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Starting Price ($ USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="e.g. 25"
                className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Service Delivery Mode <span className="text-red-500">*</span>
              </label>
              <select
                value={serviceMode}
                onChange={(e) => setServiceMode(e.target.value)}
                className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-primary cursor-pointer"
              >
                <option value="Home Visit">Home Visit</option>
                <option value="Shop Drop-off">Shop Drop-off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Estimated Duration <span className="text-red-500">*</span>
              </label>
              <input
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g. 2-3 hours"
                className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Service Area / Coverage <span className="text-red-500">*</span>
            </label>
            <input
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Dhanmondi, Mohammadpur, Dhaka"
              className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what is included in this repair service..."
              className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-primary resize-none"
            />
          </div>
        </section>

        {/* Image Upload with ImgBB */}
        <section className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface/30">
          <h2 className="font-bold text-sm text-navy dark:text-on-dark mb-1">
            Service Image Upload (ImgBB)
          </h2>
          <p className="text-xs text-foreground/50 mb-3">
            Select a clear banner photo representing the repair service. File upload automatically connects to ImgBB.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-foreground/15 p-2.5 text-xs file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-sky hover:file:text-navy cursor-pointer"
          />

          {imagePreview && (
            <div className="mt-4 overflow-hidden rounded-xl border border-foreground/10 max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Service banner preview"
                className="h-44 w-full object-cover"
              />
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/dashboard/technician/my-services"
            className="rounded-xl border border-foreground/15 px-5 py-2.5 text-xs font-semibold text-foreground/70 hover:bg-foreground/5"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploading || sessionLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white transition hover:bg-sky hover:text-navy disabled:opacity-50"
          >
            {loading || uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploading ? "Uploading to ImgBB..." : "Submitting..."}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Submit for Admin Approval
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
