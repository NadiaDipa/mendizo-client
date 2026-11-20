"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

type SessionUser = {
  name?: string | null;
  image?: string | null;
  role?: string | null;
};

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard/customer/bookings")) return "My Bookings";
  if (pathname.startsWith("/dashboard/customer/payments")) return "Payment History";
  if (pathname.startsWith("/dashboard/profile")) return "My Profile";
  if (pathname === "/dashboard/customer") return "Overview";
  return "Dashboard";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function DashboardTopbar({
  onOpenMobile,
}: {
  onOpenMobile: () => void;
}) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const user = session?.user as SessionUser | undefined;
  const name = user?.name?.trim() || "Ayesha Rahman";
  const role = (user?.role || "customer").toLowerCase();
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between gap-3 border-b border-foreground/8 bg-white/85 px-4 backdrop-blur-md dark:border-white/8 dark:bg-navy/85 sm:px-6 lg:px-8">
      {/* Page title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open sidebar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-foreground/10 bg-white text-foreground/65 shadow-sm transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky dark:border-white/10 dark:bg-white/5 dark:text-on-dark/70 dark:hover:border-sky/30 dark:hover:text-sky lg:hidden"
        >
          <MenuIcon />
        </button>

        <div className="min-w-0">
          <p className="hidden text-[9.5px] font-bold uppercase tracking-[0.18em] text-foreground/40 sm:block">
            Customer Dashboard
          </p>
          <h1 className="truncate font-display text-[19px] leading-tight tracking-tight text-navy dark:text-on-dark sm:text-[21px]">
            {title}
          </h1>
        </div>
      </div>

      {/* Customer */}
      {isPending ? (
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden space-y-1.5 sm:block">
            <div className="h-3 w-24 animate-pulse rounded-full bg-foreground/10 dark:bg-white/10" />
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-foreground/10 dark:bg-white/10" />
          </div>
          <div className="h-10 w-10 animate-pulse rounded-full bg-foreground/10 dark:bg-white/10" />
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-3">
          <div className="min-w-0 text-right">
            <p className="max-w-[92px] truncate text-[12.5px] font-semibold leading-snug text-navy dark:text-on-dark sm:max-w-[170px] sm:text-[13px]">
              {name}
            </p>
            <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-primary dark:bg-sky/15 dark:text-sky">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {roleLabel}
            </span>
          </div>

          <span
            title={name}
            className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-gradient-to-br from-primary to-sky text-[13px] font-bold text-white shadow-[0_8px_20px_-10px_rgba(0,124,199,0.8)] dark:border-sky/25"
          >
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                {getInitials(name)}
              </span>
            )}
          </span>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
