
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// ─── User Props Type ──────────────────────────────────────────────────────────

type ProfileUser = {
  name: string;
  email: string;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
};

// ─── Shared style tokens ──────────────────────────────────────────────────────

const CARD =
  "rounded-[22px] border border-foreground/10 bg-white shadow-[0_6px_28px_-10px_rgba(18,35,46,0.10)] dark:border-white/8 dark:bg-white/[0.038] dark:shadow-[0_6px_28px_-10px_rgba(0,0,0,0.5)]";

const INPUT_BASE =
  "h-12 w-full rounded-xl border bg-transparent px-4 text-[14.5px] text-foreground transition duration-200 placeholder:text-foreground/35 focus:outline-none";

const INPUT_IDLE =
  "border-foreground/12 focus:border-primary focus:ring-4 focus:ring-primary/12 dark:border-white/10 dark:focus:border-sky dark:focus:ring-sky/18";

const INPUT_DISABLED =
  "cursor-default select-none border-transparent bg-foreground/[0.04] text-foreground/80 dark:bg-white/[0.04]";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileInfoSection({
  user,
}: {
  user: ProfileUser;
}) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState(() => ({
    fullName: user.name,
    email: user.email,
    phone: user.phone ?? "",
    area: user.area ?? "",
    bio: user.bio ?? "",
  }));

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleCancel() {
    setForm({
      fullName: user.name,
      email: user.email,
      phone: user.phone ?? "",
      area: user.area ?? "",
      bio: user.bio ?? "",
    });

    setEditing(false);
  }

  // ─── Save Profile Information ──────────────────────────────────────────────

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const fullName = form.fullName.trim();

    if (!fullName) {
      toast.error("Name cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: fullName,
        phone: form.phone.trim(),
        area: form.area.trim(),
        bio: form.bio.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");

      setEditing(false);

      // Refresh server component data
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Personal Information card ───────────────────────────── */}
      <section className={`${CARD} p-6 sm:p-7`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-bold text-navy dark:text-on-dark">
              Personal Information
            </h2>
            <p className="mt-0.5 text-[12.5px] text-foreground/50">
              {editing
                ? "Edit your details below and save when done."
                : "Your profile information as it appears on Mendizo."}
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={[
                "flex shrink-0 items-center gap-2 rounded-xl border",
                "border-primary/25 bg-primary/8 px-4 py-2.5",
                "text-[13px] font-semibold text-primary",
                "transition-all duration-200",
                "hover:border-primary/50 hover:bg-primary/14 hover:-translate-y-0.5",
                "dark:border-sky/25 dark:bg-sky/8 dark:text-sky dark:hover:border-sky/50 dark:hover:bg-sky/14",
                FOCUS,
              ].join(" ")}
            >
              <PencilIcon />
              Edit Profile
            </button>
          )}
        </div>

        {/* ── Form ───────────────────────────────────────────────── */}
        <form onSubmit={handleSave} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <FieldGroup label="Full Name" icon={<UserIcon />} id="fullName">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                disabled={!editing || isSaving}
                autoComplete="name"
                className={`${INPUT_BASE} pl-11 pr-4 ${
                  editing ? INPUT_IDLE : INPUT_DISABLED
                }`}
              />
            </FieldGroup>

            {/* Email */}
            <FieldGroup
              label="Email Address"
              icon={<MailIcon />}
              id="email"
              hint="Managed by your account settings."
            >
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                readOnly
                disabled
                autoComplete="email"
                className={`${INPUT_BASE} pl-11 pr-4 ${INPUT_DISABLED}`}
              />
            </FieldGroup>

            {/* Phone */}
            <FieldGroup label="Phone Number" icon={<PhoneIcon />} id="phone">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                disabled={!editing || isSaving}
                autoComplete="tel"
                placeholder="+880 1700 000000"
                className={`${INPUT_BASE} pl-11 pr-4 ${
                  editing ? INPUT_IDLE : INPUT_DISABLED
                }`}
              />
            </FieldGroup>

            {/* Area */}
            <FieldGroup label="Area" icon={<MapPinIcon />} id="area">
              <input
                id="area"
                name="area"
                type="text"
                value={form.area}
                onChange={handleChange}
                disabled={!editing || isSaving}
                autoComplete="address-level2"
                placeholder="e.g. Dhanmondi, Dhaka"
                className={`${INPUT_BASE} pl-11 pr-4 ${
                  editing ? INPUT_IDLE : INPUT_DISABLED
                }`}
              />
            </FieldGroup>
          </div>

          {/* Bio */}
          <div className="mt-5">
            <label
              htmlFor="bio"
              className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold tracking-[0.01em] text-foreground/75"
            >
              <FileTextIcon />
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              disabled={!editing || isSaving}
              placeholder="Tell us a little about yourself…"
              className={[
                "w-full resize-none rounded-xl border px-4 py-3",
                "text-[14px] text-foreground leading-relaxed",
                "transition duration-200 placeholder:text-foreground/35 focus:outline-none",
                editing
                  ? `${INPUT_IDLE} bg-transparent`
                  : `${INPUT_DISABLED} bg-foreground/[0.04]`,
              ].join(" ")}
            />
          </div>

          {/* Action buttons */}
          {editing && (
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className={[
                  "rounded-xl border border-foreground/15 px-6 py-2.5",
                  "text-[13.5px] font-semibold text-foreground/70",
                  "transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "dark:border-white/12 dark:hover:border-white/25 dark:hover:bg-white/5",
                  FOCUS,
                ].join(" ")}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className={[
                  "flex items-center justify-center gap-2 rounded-xl",
                  "bg-primary px-6 py-2.5 text-[13.5px] font-semibold text-white",
                  "shadow-[0_12px_30px_-12px_rgba(0,124,199,0.75)]",
                  "transition-all duration-200 hover:-translate-y-0.5",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  FOCUS,
                ].join(" ")}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <CheckIcon />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </section>

      {/* ── Account Security card ───────────────────────────────── */}
      <section className={`${CARD} p-6 sm:p-7`}>
        <h2 className="mb-1 text-[16px] font-bold text-navy dark:text-on-dark">
          Account Security
        </h2>

        <p className="mb-5 text-[12.5px] text-foreground/50">
          Manage your password and account access.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-foreground/[0.06] text-foreground/50 dark:bg-white/[0.06]">
              <LockIcon />
            </span>

            <div>
              <p className="text-[13.5px] font-semibold text-foreground/80">
                Password
              </p>
              <p className="text-[12px] text-foreground/45">
                Last changed 3 months ago
              </p>
            </div>
          </div>

          <button
            type="button"
            className={[
              "flex shrink-0 items-center justify-center gap-2 rounded-xl border",
              "border-foreground/15 px-5 py-2.5 text-[13px] font-semibold text-foreground/70",
              "transition-all duration-200 hover:border-primary/35 hover:bg-primary/6 hover:text-primary",
              "dark:border-white/10 dark:hover:border-sky/35 dark:hover:bg-sky/8 dark:hover:text-sky",
              FOCUS,
            ].join(" ")}
          >
            <KeyIcon />
            Change Password
          </button>
        </div>

        <div aria-hidden="true" className="my-5 h-px bg-foreground/[0.07]" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/8 text-red-500 dark:bg-red-400/10 dark:text-red-400">
              <TrashIcon />
            </span>

            <div>
              <p className="text-[13.5px] font-semibold text-foreground/80">
                Delete Account
              </p>
              <p className="text-[12px] text-foreground/45">
                Permanently removes your account and all data.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={[
              "flex shrink-0 items-center justify-center gap-2 rounded-xl border",
              "border-red-500/20 px-5 py-2.5 text-[13px] font-semibold text-red-500/80",
              "transition-all duration-200 hover:border-red-500/40 hover:bg-red-50 hover:text-red-600",
              "dark:border-red-400/15 dark:text-red-400/70 dark:hover:border-red-400/35 dark:hover:bg-red-400/8 dark:hover:text-red-400",
              FOCUS,
            ].join(" ")}
          >
            <TrashIcon className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── FieldGroup ───────────────────────────────────────────────────────────────

function FieldGroup({
  id,
  label,
  icon,
  hint,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold tracking-[0.01em] text-foreground/75"
      >
        {icon}
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40">
          {icon}
        </span>
        {children}
      </div>

      {hint && (
        <p className="mt-1.5 text-[11.5px] text-foreground/40">{hint}</p>
      )}
    </div>
  );
}

// ─── Inline icons ─────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5 shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
  );
}

function TrashIcon({
  className = "h-4 w-4 shrink-0",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
