
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Eye,
  MapPin,
  Clock,
  DollarSign,
  ListChecks,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "AC Repair",
  "Appliance Repair",
  "Other",
];

export default function AddServicePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pricingType, setPricingType] = useState("fixed");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [included, setIncluded] = useState([""]);
  const [requirements, setRequirements] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleIncludedChange = (index: number, value: string) => {
    setIncluded((previous) =>
      previous.map((item, i) => (i === index ? value : item))
    );
  };

  const addIncludedItem = () => {
    setIncluded((previous) => [...previous, ""]);
  };

  const removeIncludedItem = (index: number) => {
    setIncluded((previous) => previous.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setPrice("");
    setPricingType("fixed");
    setDuration("");
    setLocation("");
    setImageUrl("");
    setIncluded([""]);
    setRequirements("");
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setMessage("");
    setMessageType("");

    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !price ||
      !location.trim()
    ) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    const servicePrice = Number(price);

    if (!Number.isFinite(servicePrice) || servicePrice <= 0) {
      setMessage("Please enter a valid service price.");
      setMessageType("error");
      return;
    }

    const serviceData = {
      title: title.trim(),
      category,
      description: description.trim(),
      price: servicePrice,
      pricingType,
      duration: duration.trim(),
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      whatsIncluded: included
        .map((item) => item.trim())
        .filter(Boolean),
      requirements: requirements.trim(),
      status,
    };

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/technician/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save service.");
      }

      setMessage(
        status === "published"
          ? "Your service has been published successfully!"
          : "Your service has been saved as a draft!"
      );
      setMessageType("success");

      resetForm();
    } catch (error) {
      console.error("Create service error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEFBFB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/technician"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#007CC7] transition hover:text-[#12232E]"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-[#12232E] sm:text-3xl">
              Add New Service
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Create a service listing and let customers discover your work.
            </p>
          </div>
        </div>

        {/* Success / Error Message */}
        {message && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
            )}

            <p className="text-sm font-medium">{message}</p>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="ml-auto"
              aria-label="Dismiss message"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <section className="rounded-2xl border border-[#4DA8DA]/30 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-[#EEFBFB] p-3 text-[#007CC7]">
                  <BriefcaseBusiness size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#12232E]">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Provide the basic details of your service.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#12232E]">
                    Service Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Professional Home Plumbing Service"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#12232E]">
                    Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#12232E]">
                    Short Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe your service, experience and what customers can expect..."
                    className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Write a clear description to help customers understand
                    your service.
                  </p>
                </div>
              </div>
            </section>

            {/* Pricing & Availability */}
            <section className="rounded-2xl border border-[#4DA8DA]/30 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-[#EEFBFB] p-3 text-[#007CC7]">
                  <DollarSign size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#12232E]">
                    Pricing & Availability
                  </h2>
                  <p className="text-sm text-gray-500">
                    Set your service price and estimated duration.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#12232E]">
                    Service Price (BDT){" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#12232E]">
                    Pricing Type
                  </label>

                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#12232E]">
                    Estimated Duration
                  </label>

                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 2-3 hours"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#12232E]">
                    Service Location <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Service Image */}
            <section className="rounded-2xl border border-[#4DA8DA]/30 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-[#EEFBFB] p-3 text-[#007CC7]">
                  <ImagePlus size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#12232E]">
                    Service Image
                  </h2>
                  <p className="text-sm text-gray-500">
                    Add an image to represent your service.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-[#12232E]">
                Image URL
              </label>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/service-image.jpg"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
              />

              {imageUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Service preview"
                    className="h-52 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}

              <p className="mt-2 text-xs text-gray-400">
                Provide a publicly accessible image URL.
              </p>
            </section>

            {/* What's Included */}
            <section className="rounded-2xl border border-[#4DA8DA]/30 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-[#EEFBFB] p-3 text-[#007CC7]">
                  <ListChecks size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#12232E]">
                    What's Included
                  </h2>
                  <p className="text-sm text-gray-500">
                    List the items included in your service.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {included.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleIncludedChange(index, e.target.value)
                      }
                      placeholder={`Included item ${index + 1}`}
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
                    />

                    <button
                      type="button"
                      onClick={() => removeIncludedItem(index)}
                      disabled={included.length === 1}
                      className="rounded-xl p-3 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Remove included item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addIncludedItem}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#007CC7] transition hover:text-[#12232E]"
              >
                <Plus size={18} />
                Add another item
              </button>
            </section>

            {/* Requirements */}
            <section className="rounded-2xl border border-[#4DA8DA]/30 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-[#EEFBFB] p-3 text-[#007CC7]">
                  <FileText size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#12232E]">
                    Customer Requirements
                  </h2>
                  <p className="text-sm text-gray-500">
                    Mention anything customers should prepare.
                  </p>
                </div>
              </div>

              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
                placeholder="e.g. Please ensure the work area is accessible before the appointment."
                className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#007CC7] focus:ring-2 focus:ring-[#007CC7]/10"
              />
            </section>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Link
                href="/dashboard/technician"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleSubmit("draft")}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#007CC7] bg-white px-6 py-3 text-sm font-semibold text-[#007CC7] transition hover:bg-[#EEFBFB] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit("published")}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#007CC7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12232E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                  Publish Service
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview & Tips */}
          <aside className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-[#4DA8DA]/30 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                <Eye size={19} className="text-[#007CC7]" />
                <h2 className="font-bold text-[#12232E]">Live Preview</h2>
              </div>

              <div className="p-5">
                <div className="mb-4 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-[#EEFBFB]">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-[#4DA8DA]">
                      <ImagePlus size={38} className="mx-auto mb-2" />
                      <p className="text-xs">Service image preview</p>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <span className="rounded-full bg-[#EEFBFB] px-3 py-1 text-xs font-semibold text-[#007CC7]">
                    {category || "Service Category"}
                  </span>
                </div>

                <h3 className="break-words text-lg font-bold text-[#12232E]">
                  {title || "Your Service Title"}
                </h3>

                <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-500">
                  {description || "Your service description will appear here."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Starting Price</p>
                    <p className="text-xl font-bold text-[#007CC7]">
                      ৳{price || "0"}
                    </p>
                  </div>

                  <span className="rounded-lg bg-[#EEFBFB] px-3 py-2 text-xs font-medium text-[#12232E]">
                    {pricingType === "fixed" ? "Fixed Price" : "Hourly"}
                  </span>
                </div>

                {location && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={15} />
                    {location}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#4DA8DA]/30 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-[#12232E]">
                Tips for a Great Listing
              </h2>

              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-[#007CC7]"
                  />
                  Use a clear and descriptive service title.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-[#007CC7]"
                  />
                  Explain exactly what your service includes.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-[#007CC7]"
                  />
                  Set a reasonable and transparent price.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-[#007CC7]"
                  />
                  Use a relevant image to build customer trust.
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
