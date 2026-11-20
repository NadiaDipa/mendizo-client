
"use client";

import { useState } from "react";

// ─── User Props Type ──────────────────────────────────────────────────────────

type ProfileUser = {
  name: string;
  email: string;
  role?: string | null;
  image?: string | null;
  createdAt?: Date | string;
};

// ─── Role badge config ────────────────────────────────────────────────────────

const ROLE_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  customer: {
    label: "Customer",
    className:
      "bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky",
  },
  technician: {
    label: "Technician",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-400",
  },
  admin: {
    label: "Admin",
    className:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400",
  },
};

// ─── Helper Functions ────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatMemberSince(createdAt?: Date | string) {
  if (!createdAt) return "—";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileCard({ user }: { user: ProfileUser }) {
  const [hovering, setHovering] = useState(false);

  const role = user.role?.toLowerCase() ?? "";
  const badge = ROLE_BADGE[role];

  const initials = getInitials(user.name);
  const memberSince = formatMemberSince(user.createdAt);

  return (
    <div
      className={[
        "flex flex-col items-center rounded-[22px] border p-6 text-center",
        "border-foreground/10 bg-white shadow-[0_6px_28px_-10px_rgba(18,35,46,0.10)]",
        "dark:border-white/8 dark:bg-white/[0.038] dark:shadow-[0_6px_28px_-10px_rgba(0,0,0,0.5)]",
        "transition-all duration-200",
      ].join(" ")}
    >
      {/* ── Avatar ───────────────────────────────────────────────── */}
      <div
        className="relative mb-4 mt-2"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Avatar circle */}
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20 dark:border-sky/25 shadow-[0_8px_24px_-8px_rgba(0,124,199,0.4)]">
          {user.image ? (
            <img
              src={user.image}
              alt={`${user.name}'s profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-sky text-2xl font-bold text-white select-none">
              {initials}
            </span>
          )}

          {/* Hover overlay — "Change Photo" */}
          <button
            type="button"
            aria-label="Change profile photo"
            className={[
              "absolute inset-0 flex flex-col items-center justify-center gap-0.5",
              "bg-navy/60 backdrop-blur-[2px] transition-opacity duration-200",
              hovering ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            <CameraIcon />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">
              Change
            </span>
          </button>
        </div>

        {/* Online indicator dot */}
        <span
          aria-hidden="true"
          className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-[#1a3448] bg-emerald-500 shadow-sm"
        />
      </div>

      {/* ── Name & Role ───────────────────────────────────────────── */}
      <h2 className="text-[17px] font-bold leading-snug text-navy dark:text-on-dark">
        {user.name}
      </h2>

      <p className="mt-0.5 text-[13px] text-foreground/55">
        {user.email}
      </p>

      {/* Role badge */}
      {badge && (
        <span
          className={[
            "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
            badge.className,
          ].join(" ")}
        >
          <ShieldIcon />
          {badge.label}
        </span>
      )}

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="my-5 h-px w-full bg-foreground/[0.07]"
      />

      {/* ── Stats row ─────────────────────────────────────────────── */}
      <div className="flex w-full justify-around gap-2 text-center">
        <StatPill value="—" label="Bookings" />
        <StatPill value="—" label="Rating" />
        <StatPill value={memberSince} label="Member since" compact />
      </div>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="my-5 h-px w-full bg-foreground/[0.07]"
      />

      {/* ── Change photo button (UI only) ─────────────────────────── */}
      <button
        type="button"
        className={[
          "flex w-full items-center justify-center gap-2 rounded-xl border",
          "border-foreground/12 px-4 py-2.5 text-[13px] font-semibold",
          "text-foreground/70 transition-all duration-200",
          "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
          "dark:border-white/10 dark:hover:border-sky/40 dark:hover:bg-sky/8 dark:hover:text-sky",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky",
        ].join(" ")}
      >
        <CameraIcon className="h-4 w-4" />
        Change Photo
      </button>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({
  value,
  label,
  compact = false,
}: {
  value: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 min-w-0">
      <span
        className={[
          "font-bold text-navy dark:text-on-dark leading-snug",
          compact ? "text-[11px]" : "text-[15px]",
        ].join(" ")}
      >
        {value}
      </span>
      <span className="text-[10.5px] text-foreground/50 leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function CameraIcon({
  className = "h-[18px] w-[18px]",
}: {
  className?: string;
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
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3 w-3"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
