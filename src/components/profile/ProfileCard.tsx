import type { ReactNode } from "react";

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
  { label: string; className: string; icon: ReactNode }
> = {
  customer: {
    label: "Customer",
    className:
      "border border-primary/20 bg-primary/8 text-primary dark:border-sky/25 dark:bg-sky/12 dark:text-sky",
    icon: <UserCheckIcon />,
  },
  technician: {
    label: "Technician",
    className:
      "border border-transparent bg-navy text-mist shadow-[0_6px_16px_-8px_rgba(18,35,46,0.55)] dark:border-sky/25 dark:bg-sky/15 dark:text-sky dark:shadow-none",
    icon: <WrenchIcon />,
  },
  admin: {
    label: "Admin",
    className:
      "border border-surface/20 bg-surface/8 text-surface dark:border-white/15 dark:bg-white/10 dark:text-on-dark",
    icon: <ShieldIcon />,
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
  const role = user.role?.toLowerCase() ?? "";
  const badge = ROLE_BADGE[role];

  const initials = getInitials(user.name);
  const memberSince = formatMemberSince(user.createdAt);

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[24px] border",
        "border-foreground/10 bg-white shadow-[0_10px_34px_-14px_rgba(18,35,46,0.16)]",
        "transition-shadow duration-300 hover:shadow-[0_16px_44px_-18px_rgba(0,124,199,0.28)]",
        "dark:border-white/8 dark:bg-white/[0.04] dark:shadow-[0_10px_34px_-14px_rgba(0,0,0,0.55)]",
        "dark:hover:shadow-[0_16px_44px_-18px_rgba(77,168,218,0.22)]",
      ].join(" ")}
    >
      {/* ── Decorative banner ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="relative h-24 overflow-hidden bg-gradient-to-br from-primary/12 via-sky/10 to-transparent dark:from-primary/22 dark:via-sky/12 dark:to-transparent"
      >
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-sky/20 blur-2xl dark:bg-sky/15" />
        <div className="absolute -left-10 top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl dark:bg-primary/20" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-foreground/5 dark:bg-white/8" />
      </div>

      <div className="px-6 pb-6">
        {/* ── Avatar ─────────────────────────────────────────────── */}
        <div className="-mt-12 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-primary via-sky to-primary/50 p-[3px] shadow-[0_14px_30px_-14px_rgba(0,124,199,0.65)]">
            <div className="h-24 w-24 overflow-hidden rounded-full border-[3px] border-white bg-white dark:border-[#1b2c36] dark:bg-[#1b2c36]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${user.name}'s profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-sky text-2xl font-bold tracking-wide text-white select-none">
                  {initials}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Name, email & role ─────────────────────────────────── */}
        <div className="mt-4 flex flex-col items-center text-center">
          <h2 className="max-w-full break-words font-display text-[22px] leading-tight tracking-tight text-navy dark:text-on-dark">
            {user.name}
          </h2>

          <p className="mt-1.5 max-w-full break-words text-[12.5px] leading-relaxed text-foreground/55">
            {user.email}
          </p>

          {badge && (
            <span
              className={[
                "mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "text-[10px] font-bold uppercase tracking-[0.14em]",
                badge.className,
              ].join(" ")}
            >
              {badge.icon}
              {badge.label}
            </span>
          )}
        </div>

        {/* ── Stats ──────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 divide-x divide-foreground/8 overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.02] dark:divide-white/8 dark:border-white/8 dark:bg-white/[0.02]">
          <Stat value="—" label="Bookings" />
          <Stat value="—" label="Rating" />
        </div>

        {/* ── Member since ───────────────────────────────────────── */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-foreground/8 bg-foreground/[0.02] px-4 py-3 dark:border-white/8 dark:bg-white/[0.02]">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/45">
            <CalendarIcon />
            Member Since
          </span>

          <span className="text-[13px] font-semibold text-navy dark:text-on-dark">
            {memberSince}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 px-3 py-4">
      <span className="text-[18px] font-bold leading-none text-navy dark:text-on-dark">
        {value}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/45">
        {label}
      </span>
    </div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function svgProps(className: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
}

function UserCheckIcon() {
  return (
    <svg {...svgProps("h-3 w-3")}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.4 2.7-6 6-6 1.2 0 2.3.3 3.2 1" />
      <path d="m16 17 2 2 3.5-3.5" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg {...svgProps("h-3 w-3")}>
      <path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-9.3 9.3a2.5 2.5 0 0 1-3.5-3.5l9.3-9.3a4.5 4.5 0 0 0-5.9-5.9l3 3-2.5 2.5-3-3a4.5 4.5 0 0 0 6 1Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...svgProps("h-3 w-3")}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg {...svgProps("h-3.5 w-3.5")}>
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M8 2v3M16 2v3M3 10h18" />
    </svg>
  );
}
