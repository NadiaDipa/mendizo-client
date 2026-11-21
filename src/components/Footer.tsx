// Footer — professional, responsive footer for Mendizo.
// Routes that don't exist yet are kept as non-navigating placeholders (href="#").

import type { JSX } from "react";
import type React from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const POPULAR_SERVICES = [
  { label: "AC Repair", href: "/services?category=AC" },
  { label: "Refrigerator Repair", href: "/services?category=Refrigerator" },
  { label: "Washing Machine Repair", href: "/services?category=Washing Machine" },
  { label: "Laptop & PC Repair", href: "/services?category=Laptop & PC" },
  { label: "Smartphone Repair", href: "/services?category=Smartphone" },
];

const CONTACT_INFO = {
  location: "Dhaka, Bangladesh",
  phone: { label: "+880 1700 000000", href: "tel:+8801700000000" },
  email: { label: "support@mendizo.com", href: "mailto:support@mendizo.com" },
};

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com/", Icon: FacebookIcon },
  { label: "Twitter / X", href: "https://x.com/", Icon: XIcon },
  { label: "Instagram", href: "https://instagram.com/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com/", Icon: LinkedInIcon },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="bg-navy text-on-dark"
    >
      <div className="mx-auto w-full max-w-7xl px-5 pb-8 pt-14 sm:px-8">
        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">

          {/* ── Brand section ───────────────────────────────────── */}
          <div>
            {/* Logo */}
            <Link
              href="/"
              aria-label="Mendizo home"
              className="group inline-flex items-center gap-2.5 text-on-dark"
            >
              <LogoMark />
              <span className="font-display text-[26px] leading-none tracking-wide">
                Mendizo
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-on-dark/60">
              Mendizo connects you with verified, local repair technicians for
              your devices and home appliances — fast, transparent, and
              stress-free.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Mendizo on ${label}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-on-dark/15 text-on-dark/50 transition-all duration-200 hover:border-sky/50 hover:bg-sky/10 hover:text-sky"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ─────────────────────────────────────── */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-[14px] text-on-dark/60 transition-colors duration-200 hover:text-sky"
                  >
                    <ChevronRightSmIcon />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Popular Services ────────────────────────────────── */}
          <div>
            <FooterHeading>Popular Services</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {POPULAR_SERVICES.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-[14px] text-on-dark/60 transition-colors duration-200 hover:text-sky"
                  >
                    <ChevronRightSmIcon />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Information ─────────────────────────────── */}
          <div>
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-4 space-y-3.5">
              {/* Location */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-sky">
                  <PinIcon />
                </span>
                <span className="text-[14px] text-on-dark/60">
                  {CONTACT_INFO.location}
                </span>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-3">
                <span className="text-sky">
                  <PhoneIcon />
                </span>
                <a
                  href={CONTACT_INFO.phone.href}
                  className="text-[14px] text-on-dark/60 transition-colors hover:text-sky"
                >
                  {CONTACT_INFO.phone.label}
                </a>
              </li>

              {/* Email */}
              <li className="flex items-center gap-3">
                <span className="text-sky">
                  <MailIcon />
                </span>
                <a
                  href={CONTACT_INFO.email.href}
                  className="text-[14px] text-on-dark/60 transition-colors hover:text-sky"
                >
                  {CONTACT_INFO.email.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-on-dark/10 pt-7 sm:flex-row sm:justify-between">
          <p className="text-[13px] text-on-dark/45">
            &copy; {year} Mendizo. All rights reserved.
          </p>

          <ul className="flex items-center gap-5">
            {LEGAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[13px] text-on-dark/45 transition-colors hover:text-sky"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-bold uppercase tracking-widest text-on-dark/40">
      {children}
    </h3>
  );
}

// ─── Inline Icons ─────────────────────────────────────────────────────────────

function svgBase(cls = "h-4 w-4") {
  return {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className: cls,
  };
}

/* Reused from Navbar — same logomark for consistency. */
function LogoMark(): JSX.Element {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-9 w-9 text-sky transition-transform duration-300 group-hover:rotate-6"
    >
      <defs>
        <mask id="mz-footer-wrench-slot">
          <rect width="48" height="48" fill="white" />
          <rect x="20" y="-1" width="8" height="12" rx="2" fill="black" />
        </mask>
      </defs>
      <g transform="rotate(-45 24 24)" mask="url(#mz-footer-wrench-slot)" fill="currentColor">
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

function ChevronRightSmIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3 w-3 shrink-0 text-sky/50"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function PinIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </svg>
  );
}

function PhoneIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MailIcon(): JSX.Element {
  return (
    <svg {...svgBase()}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </svg>
  );
}

function FacebookIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.8c-.3 0-1.3-.2-2.4-.2-2.5 0-4.1 1.5-4.1 4.2v2.7H7.6v3.3h2.8V22h3.1Z" />
    </svg>
  );
}

function XIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
