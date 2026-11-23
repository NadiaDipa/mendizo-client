"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// ─── User Props Type ──────────────────────────────────────────────────────────

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// ─── Shared style tokens ──────────────────────────────────────────────────────

const CARD =
  "rounded-3xl border border-foreground/10 bg-white shadow-[0_6px_28px_-10px_rgba(18,35,46,0.10)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_6px_28px_-10px_rgba(0,0,0,0.5)]";

const INPUT_BASE =
  "h-12 w-full rounded-xl border bg-transparent pl-11 pr-4 text-[14.5px] text-foreground transition duration-200 placeholder:text-foreground/35 focus:outline-none";

const INPUT_IDLE =
  "border-foreground/15 bg-white focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/12 dark:bg-white/[0.03] dark:focus:border-sky dark:focus:ring-sky/20";

const INPUT_DISABLED =
  "cursor-default select-none border-transparent bg-foreground/[0.04] text-foreground/80 dark:bg-white/[0.05]";

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

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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

    setAvatarPreview(null);
    setPendingAvatarFile(null);

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }

    setEditing(false);
  }

  // ─── Change Profile Photo ──────────────────────────────────────────────────

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!editing) {
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setPendingAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  // ─── Upload Pending Profile Photo ─────────────────────────────────────────

  async function uploadPendingAvatar(): Promise<string | null> {
    if (!pendingAvatarFile) return null;

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("image", pendingAvatarFile);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || "Unable to upload your photo.");
      }

      return data.imageUrl as string;
    } catch (error) {
      console.error("Profile photo update error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      return null;
    } finally {
      setIsUploadingAvatar(false);
    }
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
      let uploadedImageUrl: string | null = null;

      if (pendingAvatarFile) {
        uploadedImageUrl = await uploadPendingAvatar();
        if (!uploadedImageUrl) return;
      }

      const { error } = await authClient.updateUser({
        name: fullName,
        phone: form.phone.trim(),
        area: form.area.trim(),
        bio: form.bio.trim(),
        ...(uploadedImageUrl ? { image: uploadedImageUrl } : {}),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");

      if (uploadedImageUrl) {
        setAvatarPreview(uploadedImageUrl);
      }

      setPendingAvatarFile(null);
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

  const avatarSrc = avatarPreview || user.image || null;
  const initials = getInitials(user.name);

  // ─── Profile completion (based on saved data) ──────────────────────────────

  function focusField(id: string) {
    setEditing(true);
    window.setTimeout(() => document.getElementById(id)?.focus(), 60);
  }

  const checklist = [
    {
      label: "Add a profile photo",
      done: Boolean(avatarSrc),
      onClick: () => {
        setEditing(true);
        window.setTimeout(() => avatarInputRef.current?.click(), 60);
      },
    },
    {
      label: "Add your phone number",
      done: Boolean(user.phone?.trim()),
      onClick: () => focusField("phone"),
    },
    {
      label: "Add your area",
      done: Boolean(user.area?.trim()),
      onClick: () => focusField("area"),
    },
    {
      label: "Write a short bio",
      done: Boolean(user.bio?.trim()),
      onClick: () => focusField("bio"),
    },
  ];

  const doneCount = checklist.filter((item) => item.done).length;
  const percent = Math.round((doneCount / checklist.length) * 100);
  const isComplete = doneCount === checklist.length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Personal Information card ───────────────────────────── */}
      <section className={`${CARD} p-6 sm:p-8`}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
              <UserIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold leading-tight text-navy dark:text-on-dark">
                Personal Information
              </h2>
              <p className="mt-1 text-[13px] text-foreground/55">
                {editing
                  ? "Edit your details below and save when done."
                  : "Your profile information as it appears on Mendizo."}
              </p>
            </div>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={[
                "inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5",
                "text-[13px] font-semibold text-white",
                "shadow-[0_10px_24px_-12px_rgba(0,124,199,0.9)]",
                "transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky hover:text-navy",
                FOCUS,
              ].join(" ")}
            >
              <PencilIcon />
              Edit Profile
            </button>
          )}
        </div>

        {/* ── Profile photo ───────────────────────────────────────── */}
        <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-4 dark:border-white/8 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-sky ring-2 ring-primary/20 dark:ring-sky/30">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={`${user.name}'s profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-base font-bold text-white">
                  {initials}
                </span>
              )}
            </span>

            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-navy dark:text-on-dark">
                Profile photo
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-foreground/50">
                JPG, PNG or WebP. Maximum 5 MB.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={!editing || isSaving || isUploadingAvatar}
            className={[
              "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border bg-white",
              "border-foreground/15 px-4 py-2.5 text-[13px] font-semibold",
              "text-foreground/75 transition-all duration-200",
              "hover:border-primary/40 hover:text-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:border-white/12 dark:bg-white/[0.04] dark:text-on-dark/80 dark:hover:border-sky/40 dark:hover:text-sky",
              FOCUS,
            ].join(" ")}
          >
            {isUploadingAvatar ? <SpinnerIcon /> : <CameraIcon />}
            {isUploadingAvatar ? "Uploading..." : "Change Photo"}
          </button>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="sr-only"
            aria-label="Choose a new profile photo"
          />
        </div>

        {/* ── Form ───────────────────────────────────────────────── */}
        <form onSubmit={handleSave} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldGroup label="Full Name" icon={<UserIcon />} id="fullName">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                disabled={!editing || isSaving}
                autoComplete="name"
                className={`${INPUT_BASE} ${editing ? INPUT_IDLE : INPUT_DISABLED}`}
              />
            </FieldGroup>

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
                className={`${INPUT_BASE} ${INPUT_DISABLED}`}
              />
            </FieldGroup>

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
                className={`${INPUT_BASE} ${editing ? INPUT_IDLE : INPUT_DISABLED}`}
              />
            </FieldGroup>

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
                className={`${INPUT_BASE} ${editing ? INPUT_IDLE : INPUT_DISABLED}`}
              />
            </FieldGroup>
          </div>

          {/* Bio */}
          <div className="mt-5">
            <label
              htmlFor="bio"
              className="mb-2 block text-[13px] font-semibold text-foreground/75"
            >
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
                "text-[14.5px] leading-relaxed text-foreground",
                "transition duration-200 placeholder:text-foreground/35 focus:outline-none",
                editing ? INPUT_IDLE : INPUT_DISABLED,
              ].join(" ")}
            />
          </div>

          {/* Action buttons */}
          {editing && (
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-foreground/10 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className={[
                  "rounded-xl border border-foreground/15 px-6 py-2.5",
                  "text-[13.5px] font-semibold text-foreground/70",
                  "transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "dark:border-white/12 dark:text-on-dark/75 dark:hover:border-white/25 dark:hover:bg-white/5",
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
                  "transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky hover:text-navy",
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

      {/* ── Profile completion card ─────────────────────────────── */}
      <section className={`${CARD} relative overflow-hidden p-6 sm:p-8`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-sky/15 blur-3xl dark:bg-sky/10"
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
                <SparkleIcon />
              </span>
              <div>
                <h2 className="text-[17px] font-semibold leading-tight text-navy dark:text-on-dark">
                  Profile completion
                </h2>
                <p className="mt-1 text-[13px] text-foreground/55">
                  {isComplete
                    ? "Your profile is complete. Nice work!"
                    : "Finish these steps to complete your profile."}
                </p>
              </div>
            </div>

            <span className="text-2xl font-bold tracking-tight text-primary dark:text-sky">
              {percent}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
            className="mt-5 h-2 w-full overflow-hidden rounded-full bg-foreground/10 dark:bg-white/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-sky transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {checklist.map((item) => (
              <li key={item.label}>
                {item.done ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3 text-[13px] font-medium text-emerald-700 dark:text-emerald-300">
                    <CheckCircleIcon />
                    <span className="first-letter:uppercase">
                      {item.label.replace(/^Add (a |your )?|^Write a /, "")}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={[
                      "flex w-full items-center gap-3 rounded-2xl border border-dashed border-foreground/20 px-4 py-3",
                      "text-left text-[13px] font-medium text-foreground/70",
                      "transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
                      "dark:border-white/15 dark:text-on-dark/70 dark:hover:border-sky/50 dark:hover:bg-sky/10 dark:hover:text-sky",
                      FOCUS,
                    ].join(" ")}
                  >
                    <PlusCircleIcon />
                    <span>{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
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
        className="mb-2 block text-[13px] font-semibold text-foreground/75"
      >
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
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

function Svg({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function UserIcon({ className = "h-4 w-4 shrink-0" }: { className?: string }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </Svg>
  );
}

function MailIcon() {
  return (
    <Svg className="h-4 w-4 shrink-0">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg className="h-4 w-4 shrink-0">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </Svg>
  );
}

function MapPinIcon() {
  return (
    <Svg className="h-4 w-4 shrink-0">
      <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </Svg>
  );
}

function SparkleIcon() {
  return (
    <Svg className="h-5 w-5 shrink-0">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5 13.4 11l2.6 1-2.6 1L12 15.5 10.6 13 8 12l2.6-1L12 8.5Z" />
    </Svg>
  );
}

function PencilIcon() {
  return (
    <Svg className="h-4 w-4 shrink-0">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Svg>
  );
}

function CameraIcon() {
  return (
    <Svg className="h-4 w-4 shrink-0">
      <path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </Svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <Svg className="h-4 w-4 shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

function CheckCircleIcon() {
  return (
    <Svg className="h-[18px] w-[18px] shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.2 2.2 4.8-4.8" />
    </Svg>
  );
}

function PlusCircleIcon() {
  return (
    <Svg className="h-[18px] w-[18px] shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </Svg>
  );
}