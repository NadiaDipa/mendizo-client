
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

const LINK_ACTIVE =
  "text-sky lg:[html:not(.dark)_&]:text-primary";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  function toggleTheme() {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");

    root.classList.toggle("dark", nextIsDark);
    root.style.colorScheme = nextIsDark ? "dark" : "light";
    root.dataset.theme = nextIsDark ? "dark" : "light";

    try {
      localStorage.setItem(
        "mendizo-theme",
        nextIsDark ? "dark" : "light"
      );
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <header className="absolute inset-x-0 top-0 z-40 md:top-10">
      <nav className="mx-auto flex h-20 max-w-7xl xl:max-w-[90rem] 2xl:max-w-[100rem] items-center justify-between gap-6 px-5 sm:px-8 min-[1360px]:grid min-[1360px]:grid-cols-[1fr_auto_1fr]">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Mendizo home"
          className="group flex items-center gap-2.5 justify-self-start text-on-dark"
        >
          <LogoMark />

          <span className="font-display text-[28px] leading-none tracking-wide">
            Mendizo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-9 min-[1360px]:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`block border-b-2 py-2 text-[15px] font-semibold transition-colors duration-200 ${FOCUS} ${
                    isActive
                      ? `${LINK_ACTIVE} border-[#007CC7]`
                      : `${LINK_IDLE} border-transparent`
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
          <ThemeToggle onToggle={toggleTheme} />

          <Link
            href="/sign-in"
            className={`hidden rounded-full border bg-transparent px-5 py-2.5 text-sm font-semibold transition-colors duration-300 lg:inline-block ${CTRL} ${FOCUS}`}
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className={`hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-12px_rgba(0,124,199,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--color-primary),black_12%)] lg:inline-block ${FOCUS}`}
          >
            Sign Up
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={`grid h-10 w-10 place-items-center rounded-full border bg-transparent transition-colors min-[1360px]:hidden ${CTRL} ${FOCUS}`}
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
                const isActive = pathname === link.href;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                        isActive
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

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-on-dark/10 pt-3 lg:hidden">
              <Link
                href="#sign-in"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full border border-on-dark/35 px-4 py-2.5 text-center text-sm font-semibold text-on-dark transition-colors hover:bg-on-dark/10"
              >
                Sign In
              </Link>

              <Link
                href="#sign-up"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--color-primary),black_12%)]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ThemeToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className={`grid h-10 w-10 place-items-center rounded-full bg-transparent transition-colors duration-300 ${CTRL} ${FOCUS}`}
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

      {/* Wrench */}
      <g
        transform="rotate(-45 24 24)"
        mask="url(#mz-wrench-slot)"
        fill="currentColor"
      >
        <circle cx="24" cy="11" r="9.5" />
        <rect x="20.5" y="16" width="7" height="29" rx="3.5" />
      </g>

      {/* Screwdriver */}
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
