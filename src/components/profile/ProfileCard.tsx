import type { ReactNode } from "react";
import type { ProfileMeta, ProfileMetaTone, ProfileStat } from "@/lib/profile-stats";

// ─── User Props Type ──────────────────────────────────────────────────────────

type ProfileUser = {
  name: string;
  email: string;
  role?: string | null;
  image?: string | null;
  createdAt?: Date | string | null;
};

type ProfileCardProps = {
  user: ProfileUser;
  stats?: ProfileStat[];
  meta?: ProfileMeta[];
  verifiedTechnician?: boolean;
};

// ─── Role badge config (glass style, sits on the dark banner) ─────────────────

const GLASS_BADGE =
  "bg-white/15 text-white ring-1 ring-inset ring-white/30 backdrop-blur-md";

const ROLE_BADGE: Record<
  string,
  { label: string; className: string; icon: ReactNode }
> = {
  customer: {
    label: "Customer",
    className: GLASS_BADGE,
    icon: <UserCheckIcon />,
  },
  technician: {
    label: "Technician",
    className: GLASS_BADGE,
    icon: <WrenchIcon />,
  },
  admin: {
    label: "Admin",
    className: GLASS_BADGE,
    icon: <ShieldIcon />,
  },
};

const VERIFIED_TECHNICIAN_BADGE = {
  label: "Verified Technician",
  className:
    "bg-emerald-400/20 text-emerald-50 ring-1 ring-inset ring-emerald-300/50 backdrop-blur-md",
  icon: <BadgeCheckIcon />,
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

function statGridClass(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-3";
}

const META_TONE: Record<ProfileMetaTone, string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
  neutral: "text-navy dark:text-on-dark",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileCard({
  user,
  stats = [],
  meta = [],
  verifiedTechnician = false,
}: ProfileCardProps) {
  const role = user.role?.toLowerCase() ?? "";
  const badge =
    role === "technician" && verifiedTechnician
      ? VERIFIED_TECHNICIAN_BADGE
      : ROLE_BADGE[role];

  const initials = getInitials(user.name);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-white shadow-[0_10px_34px_-14px_rgba(18,35,46,0.16)] transition-shadow duration-300 hover:shadow-[0_18px_44px_-18px_rgba(0,124,199,0.32)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_10px_34px_-14px_rgba(0,0,0,0.55)]">
      {/* ── Banner ───────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="relative h-32 overflow-hidden bg-gradient-to-br from-navy via-[#0f4a78] to-primary"
      >
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-sky/35 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-primary/50 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      {badge && (
        <span
          className={[
            "absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
            "text-[10px] font-bold uppercase tracking-[0.14em]",
            badge.className,
          ].join(" ")}
        >
          {badge.icon}
          {badge.label}
        </span>
      )}

      <div className="px-6 pb-6">
        {/* ── Avatar ─────────────────────────────────────────────── */}
        <div className="relative z-10 -mt-14 flex justify-center">
          <div className="h-28 w-28 overflow-hidden rounded-full bg-white shadow-[0_14px_30px_-12px_rgba(0,124,199,0.6)] ring-4 ring-white dark:bg-[#1b2c36] dark:ring-[#1b2c36]">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={`${user.name}'s profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full select-none items-center justify-center bg-gradient-to-br from-primary to-sky text-3xl font-bold tracking-wide text-white">
                {initials}
              </span>
            )}
          </div>
        </div>

        {/* ── Name & email ───────────────────────────────────────── */}
        <div className="mt-4 flex flex-col items-center text-center">
          <h2 className="max-w-full break-words text-[22px] font-semibold leading-tight tracking-tight text-navy dark:text-on-dark">
            {user.name}
          </h2>

          <p className="mt-1 max-w-full break-all text-[13px] leading-relaxed text-foreground/55">
            {user.email}
          </p>
        </div>

        {/* ── Role-specific stats (separate tiles) ───────────────── */}
        {stats.length > 0 && (
          <div className={`mt-6 grid gap-2.5 ${statGridClass(stats.length)}`}>
            {stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        )}

        {/* ── Account details ─────────────────────────────────────── */}
        {meta.length > 0 && (
          <dl className="mt-4 divide-y divide-foreground/8 overflow-hidden rounded-2xl border border-foreground/8 dark:divide-white/8 dark:border-white/8">
            {meta.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/45">
                  <span className="text-primary dark:text-sky">
                    {row.label === "Account Status" ? <StatusIcon /> : <CalendarIcon />}
                  </span>
                  {row.label}
                </dt>

                <dd
                  className={[
                    "text-right text-[13px] font-semibold",
                    META_TONE[row.tone ?? "neutral"],
                  ].join(" ")}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border border-foreground/8 bg-foreground/[0.03] px-2 py-4 text-center dark:border-white/8 dark:bg-white/[0.04]">
      <span className="text-xl font-bold leading-none tracking-tight text-navy dark:text-on-dark">
        {value}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground/45">
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

function BadgeCheckIcon() {
  return (
    <svg {...svgProps("h-3 w-3")}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m8.5 12 2.2 2.2 4.8-4.8" />
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

function StatusIcon() {
  return (
    <svg {...svgProps("h-3.5 w-3.5")}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.2 2.2 4.8-4.8" />
    </svg>
  );
}