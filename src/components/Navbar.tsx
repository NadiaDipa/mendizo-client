
"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useSession, authClient } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky";

const CTRL =
  "text-on-dark border-on-dark/40 hover:bg-on-dark/10 lg:[html:not(.dark)_&]:text-navy lg:[html:not(.dark)_&]:border-navy/40 lg:[html:not(.dark)_&]:hover:bg-navy/5";

const LINK_IDLE =
  "text-on-dark hover:text-sky lg:[html:not(.dark)_&]:text-navy lg:[html:not(.dark)_&]:hover:text-primary";

const LINK_ACTIVE = "text-sky lg:[html:not(.dark)_&]:text-primary";

type UserRole = "customer" | "technician" | "admin";

type UserMenuProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: UserRole;
  };
  router: ReturnType<typeof useRouter>;
  scrolled: boolean;
  isOpen: boolean;
  onOpenChange: (next: boolean) => void;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;

  const controlClass = !isHome
    ? "text-foreground border-foreground/30 hover:bg-foreground/5 dark:text-on-dark dark:border-on-dark/40 dark:hover:bg-on-dark/10"
    : scrolled
    ? "text-on-dark border-on-dark/40 hover:bg-on-dark/10"
    : CTRL;

  const idleLinkClass = !isHome
    ? "text-foreground/80 hover:text-primary dark:text-on-dark/80 dark:hover:text-sky"
    : scrolled
    ? "text-on-dark/85 hover:text-sky"
    : LINK_IDLE;

  const activeLinkClass = !isHome
    ? "text-primary font-bold dark:text-sky"
    : scrolled
    ? "text-sky font-bold"
    : LINK_ACTIVE;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");

    root.classList.toggle("dark", nextIsDark);
    root.style.colorScheme = nextIsDark ? "dark" : "light";
    root.dataset.theme = nextIsDark ? "dark" : "light";

    try {
      localStorage.setItem("mendizo-theme", nextIsDark ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <header
      className={`inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        !isHome
          ? "sticky bg-white/95 border-b border-foreground/10 text-foreground shadow-xs backdrop-blur-md dark:bg-navy/95 dark:border-white/10 dark:text-on-dark dark:shadow-md"
          : scrolled
          ? "fixed bg-navy shadow-[0_2px_20px_-4px_rgba(0,0,0,0.5)] text-on-dark"
          : "absolute md:top-10 text-on-dark"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl xl:max-w-[90rem] 2xl:max-w-[100rem] items-center justify-between gap-6 px-5 sm:px-8 min-[1360px]:grid min-[1360px]:grid-cols-[1fr_auto_1fr]">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Mendizo home"
          className={`group flex items-center gap-2.5 justify-self-start ${
            !isHome ? "text-foreground dark:text-on-dark" : "text-on-dark"
          }`}
        >
          <LogoMark />

          <span className="font-display text-[28px] leading-none tracking-wide">
            Mendizo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-9 min-[1360px]:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`block border-b-2 py-2 text-[15px] font-semibold transition-colors duration-200 ${FOCUS} ${
                    isActive
                      ? `${activeLinkClass} border-[#007CC7] dark:border-sky`
                      : `${idleLinkClass} border-transparent`
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 justify-self-end">
          <ThemeToggle onToggle={toggleTheme} scrolled={scrolled} />

          {!isPending && !user && (
            <>
              <Link
                href="/sign-in"
                className={`hidden rounded-full border bg-transparent px-5 py-2.5 text-sm font-semibold transition-colors duration-300 lg:inline-block ${controlClass} ${FOCUS}`}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className={`hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-12px_rgba(0,124,199,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--color-primary),black_12%)] lg:inline-block ${FOCUS}`}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* User name + avatar + dropdown */}
          {!isPending && user && (
            <UserMenu
              user={
                user as typeof user & {
                  role?: UserRole;
                }
              }
              router={router}
              scrolled={scrolled}
              isOpen={isUserMenuOpen}
              onOpenChange={(next) => {
                setIsUserMenuOpen(next);

                if (next) {
                  setIsMenuOpen(false);
                }
              }}
            />
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((open) => !open);
              setIsUserMenuOpen(false);
            }}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={`grid h-10 w-10 place-items-center rounded-full border bg-transparent transition-colors min-[1360px]:hidden ${controlClass} ${FOCUS}`}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-4 top-20 z-40 min-[1360px]:hidden"
        >
          <div className="overflow-hidden rounded-3xl border border-on-dark/10 bg-navy p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${isActive
                        ? "bg-on-dark/10 text-sky"
                        : "text-on-dark hover:bg-on-dark/5 hover:text-sky"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile auth buttons */}
            {!isPending && !user && (
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-on-dark/10 pt-3 lg:hidden">
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full border border-on-dark/35 px-4 py-2.5 text-center text-sm font-semibold text-on-dark transition-colors hover:bg-on-dark/10"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--color-primary),black_12%)]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ─── UserMenu ─────────────────────────────────────────────

function UserMenu({
  user,
  router,
  scrolled,
  isOpen,
  onOpenChange,
}: UserMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  async function handleSignOut() {
    onOpenChange(false);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Sign out failed. Please try again.");
        return;
      }

      toast.success("You've been signed out. See you soon!");

      router.push("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      toast.error(message);
    }
  }

  // Determine dashboard route based on the logged-in user's role.
  const dashboardPath =
    user.role === "technician"
      ? "/dashboard/technician"
      : user.role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/customer";

  const initials = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const avatarCircle = (
    <span className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
      {initials}
    </span>
  );

  return (
    <div ref={containerRef} className="relative">
      {/* User name + avatar trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        aria-label="Open user menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex h-11 max-w-[190px] items-center gap-2 rounded-full border py-1 pl-3 pr-1.5 transition-all duration-200 hover:border-sky hover:bg-on-dark/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky ${scrolled
          ? "border-on-dark/40 text-on-dark"
          : "border-on-dark/40 text-on-dark lg:[html:not(.dark)_&]:border-navy/30 lg:[html:not(.dark)_&]:text-navy lg:[html:not(.dark)_&]:hover:border-primary"
          }`}
      >
        <span className="max-w-[105px] truncate text-sm font-semibold">
          {user.name}
        </span>

        <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-sky/30">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "User avatar"}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            avatarCircle
          )}
        </span>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="menu"
          aria-label="User menu"
          className={[
            "absolute right-0 top-[calc(100%+0.625rem)] z-50",
            "w-64 max-w-[calc(100vw-2rem)]",
            "overflow-hidden rounded-2xl",
            "border border-sky/20 bg-navy",
            "shadow-[0_24px_64px_-16px_rgba(0,0,0,0.65),0_0_0_1px_rgba(77,168,218,0.08)]",
            "lg:[html:not(.dark)_&]:border-navy/10 lg:[html:not(.dark)_&]:bg-white",
            "lg:[html:not(.dark)_&]:shadow-[0_16px_48px_-12px_rgba(0,124,199,0.18),0_2px_8px_-2px_rgba(0,0,0,0.06)]",
          ].join(" ")}
        >
          {/* User information */}
          <div className="flex items-center gap-3 px-4 py-4 lg:[html:not(.dark)_&]:border-b lg:[html:not(.dark)_&]:border-navy/8">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-sky/30 lg:[html:not(.dark)_&]:border-primary/20">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "User avatar"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarCircle
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-bold leading-snug text-on-dark lg:[html:not(.dark)_&]:text-navy">
                {user.name}
              </p>

              <p className="truncate text-[11.5px] font-medium leading-snug text-on-dark/50 lg:[html:not(.dark)_&]:text-navy/50">
                {user.email}
              </p>

              {/* User role badge */}
              {user.role && (
                <span className="mt-1 inline-flex rounded-full bg-sky/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky lg:[html:not(.dark)_&]:bg-primary/10 lg:[html:not(.dark)_&]:text-primary">
                  {user.role}
                </span>
              )}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="mx-3 h-px bg-on-dark/[0.08] lg:[html:not(.dark)_&]:bg-navy/[0.07]"
          />

          {/* Menu items */}
          <ul className="px-2 py-2">
            {/* Profile */}
            <li>
              <Link
                href="/dashboard/profile"
                role="menuitem"
                onClick={() => onOpenChange(false)}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-on-dark/85 transition-colors duration-150 hover:bg-sky/10 hover:text-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky lg:[html:not(.dark)_&]:text-navy/80 lg:[html:not(.dark)_&]:hover:bg-primary/8 lg:[html:not(.dark)_&]:hover:text-primary"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-on-dark/[0.08] text-on-dark/60 transition-colors group-hover:bg-sky/15 group-hover:text-sky lg:[html:not(.dark)_&]:bg-navy/[0.06] lg:[html:not(.dark)_&]:text-navy/50 lg:[html:not(.dark)_&]:group-hover:bg-primary/10 lg:[html:not(.dark)_&]:group-hover:text-primary">
                  <UserIcon />
                </span>
                Profile
              </Link>
            </li>

            {/* Dashboard */}
            <li>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  console.log("User role:", user.role);
                  console.log("Dashboard path:", dashboardPath);

                  onOpenChange(false);
                  router.push(dashboardPath);
                }}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-on-dark/85 transition-colors duration-150 hover:bg-sky/10 hover:text-sky focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky lg:[html:not(.dark)_&]:text-navy/80 lg:[html:not(.dark)_&]:hover:bg-primary/8 lg:[html:not(.dark)_&]:hover:text-primary"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-on-dark/[0.08] text-on-dark/60 transition-colors group-hover:bg-sky/15 group-hover:text-sky lg:[html:not(.dark)_&]:bg-navy/[0.06] lg:[html:not(.dark)_&]:text-navy/50 lg:[html:not(.dark)_&]:group-hover:bg-primary/10 lg:[html:not(.dark)_&]:group-hover:text-primary">
                  <DashboardIcon />
                </span>
                Dashboard
              </button>
            </li>

            <li
              aria-hidden="true"
              className="my-1.5 mx-1 h-px bg-on-dark/[0.08] lg:[html:not(.dark)_&]:bg-navy/[0.07]"
            />

            {/* Sign Out */}
            <li>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-red-400/90 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 lg:[html:not(.dark)_&]:text-red-500 lg:[html:not(.dark)_&]:hover:bg-red-50 lg:[html:not(.dark)_&]:hover:text-red-600"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-red-500/[0.12] text-red-400 transition-colors group-hover:bg-red-500/20 lg:[html:not(.dark)_&]:bg-red-50 lg:[html:not(.dark)_&]:text-red-500 lg:[html:not(.dark)_&]:group-hover:bg-red-100">
                  <SignOutIcon />
                </span>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Theme Toggle ──────────────────────────────────────────

function ThemeToggle({
  onToggle,
  scrolled,
}: {
  onToggle: () => void;
  scrolled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className={`grid h-10 w-10 place-items-center rounded-full bg-transparent transition-colors duration-300 ${scrolled ? "text-on-dark border-on-dark/40 hover:bg-on-dark/10" : CTRL
        } ${FOCUS}`}
    >
      <span className="dark:hidden">
        <SunIcon />
      </span>

      <span className="hidden dark:block">
        <MoonIcon />
      </span>
    </button>
  );
}

/* Crossed wrench + screwdriver logo */
function LogoMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-10 w-10 text-sky transition-transform duration-300 group-hover:rotate-6"
    >
      <defs>
        <mask id="mz-wrench-slot">
          <rect width="48" height="48" fill="white" />
          <rect x="20" y="-1" width="8" height="12" rx="2" fill="black" />
        </mask>
      </defs>

      <g
        transform="rotate(-45 24 24)"
        mask="url(#mz-wrench-slot)"
        fill="currentColor"
      >
        <circle cx="24" cy="11" r="9.5" />
        <rect x="20.5" y="16" width="7" height="29" rx="3.5" />
      </g>

      <g
        transform="rotate(45 24 24)"
        fill="currentColor"
        stroke="var(--color-navy)"
        strokeWidth="3"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        <rect x="22.7" y="2" width="2.6" height="24" rx="0.8" />
        <rect x="20.8" y="24" width="6.4" height="4.5" rx="1.2" />
        <rect x="18.8" y="27" width="10.4" height="17.5" rx="5" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
