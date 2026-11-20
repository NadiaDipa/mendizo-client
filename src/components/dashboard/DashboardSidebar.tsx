
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { JSX } from "react";
import { authClient } from "@/lib/auth-client";

type DashboardSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

type IconProps = { className?: string };

type NavItem = {
  label: string;
  href: string;
  Icon: (props: IconProps) => JSX.Element;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard/customer", Icon: OverviewIcon, exact: true },
  { label: "My Bookings", href: "/dashboard/customer/bookings", Icon: CalendarIcon },
  { label: "Payment History", href: "/dashboard/customer/payments", Icon: CardIcon },
  { label: "My Profile", href: "/dashboard/profile", Icon: UserIcon },
];

const ITEM_BASE =
  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky";

export default function DashboardSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const labelClass = collapsed ? "lg:hidden" : "";
  const itemLayout = collapsed ? "lg:justify-center lg:px-0" : "";

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            onCloseMobile();
            router.replace("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <aside
      aria-label="Dashboard sidebar"
      className={[
        "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col",
        "border-r border-white/10 bg-navy text-on-dark dark:bg-[#0e1d28]",
        "shadow-[0_0_60px_-20px_rgba(0,0,0,0.6)]",
        "transition-[width,transform] duration-300 ease-in-out",
        collapsed ? "lg:w-20" : "lg:w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
    >
      {/* Brand */}
      <div
        className={[
          "relative flex h-[72px] shrink-0 items-center justify-between gap-2 border-b border-white/8 px-4 sm:px-5",
          collapsed ? "lg:justify-center lg:px-3" : "",
        ].join(" ")}
      >
        <Link
          href="/dashboard/customer"
          onClick={onCloseMobile}
          aria-label="Mendizo dashboard"
          className="flex min-w-0 items-center gap-2.5"
        >
          <Image
            src="/mendizo-logo.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0"
          />

          <span
            className={`truncate font-display text-[23px] leading-none tracking-wide text-on-dark ${labelClass}`}
          >
            Mendizo
          </span>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-on-dark/70 transition-colors hover:bg-white/8 hover:text-on-dark lg:hidden"
        >
          <CloseIcon />
        </button>

        {/* Desktop collapse button */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute right-[-18px] top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border-2 border-sky/70 bg-primary text-white shadow-[0_4px_14px_rgba(0,124,199,0.45)] transition-all duration-200 hover:scale-110 hover:bg-sky hover:shadow-lg lg:grid"
        >
          <ChevronIcon
            className={`h-5 w-5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Main navigation */}
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-5">
        <p
          className={`mb-2 px-3 text-[9.5px] font-bold uppercase tracking-[0.2em] text-on-dark/35 ${labelClass}`}
        >
          Menu
        </p>

        <ul className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                  title={collapsed ? item.label : undefined}
                  className={[
                    ITEM_BASE,
                    itemLayout,
                    isActive
                      ? "bg-primary text-white shadow-[0_10px_24px_-12px_rgba(0,124,199,0.9)]"
                      : "text-on-dark/65 hover:bg-white/8 hover:text-on-dark",
                  ].join(" ")}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sky"
                    />
                  )}

                  <span
                    className={[
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors",
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-on-dark/45 group-hover:bg-white/8 group-hover:text-sky",
                    ].join(" ")}
                  >
                    <item.Icon />
                  </span>

                  <span className={`truncate ${labelClass}`}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="border-t border-white/8 p-3">
        <Link
          href="/"
          onClick={onCloseMobile}
          aria-label="Back to Home"
          title={collapsed ? "Back to Home" : undefined}
          className={`${ITEM_BASE} ${itemLayout} text-on-dark/65 hover:bg-white/8 hover:text-on-dark`}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-on-dark/45 group-hover:bg-white/8 group-hover:text-sky">
            <HomeIcon />
          </span>
          <span className={`truncate ${labelClass}`}>Back to Home</span>
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="Logout"
          title={collapsed ? "Logout" : undefined}
          className={`${ITEM_BASE} ${itemLayout} mt-2 w-full bg-[#DA3633] text-white shadow-sm hover:bg-[#B62324] hover:text-white disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 text-white">
            <LogoutIcon />
          </span>

          <span className={`truncate ${labelClass}`}>
            {loggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>

        {logoutError && (
          <p role="alert" className="mt-2 px-3 text-xs text-red-300">
            {logoutError}
          </p>
        )}
      </div>
    </aside>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function svgProps(className = "h-[18px] w-[18px]") {
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

function OverviewIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M8 2v3M16 2v3M3 10h18" />
      <path d="M8 14h2M14 14h2M8 18h2M14 18h2" />
    </svg>
  );
}

function CardIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M6.5 15h4" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20c0-3.8 3.4-6.5 7.5-6.5s7.5 2.7 7.5 6.5" />
    </svg>
  );
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="m3 10.5 9-7.5 9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

function LogoutIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </svg>
  );
}

function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg {...svgProps("h-5 w-5")}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
