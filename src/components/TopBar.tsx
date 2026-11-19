import type { JSX } from "react";

// Edit these with the real Mendizo details.
const TAGLINE = "Serving Dhaka & nearby areas";
const HOURS = "Open daily, 9:00 AM – 9:00 PM";

const CONTACT = {
  phone: { label: "+880 1700 000000", href: "tel:+8801700000000" },
  email: { label: "support@mendizo.com", href: "mailto:support@mendizo.com" },
  facebook: "https://facebook.com/",
};

/*
 * This bar has NO background of its own. It sits on top of the Hero background, so it always
 * matches it (navy on the left, pale blue on the right in light mode, blue gradient in dark mode).
 * Text colors follow the same rule as the Navbar:
 *  - default (below lg, and in dark mode): light text
 *  - lg and up in LIGHT mode: navy text, because the center/right sit on the pale panel
 * The left tagline always sits on the navy side, so it stays light.
 */
const TXT = "text-on-dark/85 lg:[html:not(.dark)_&]:text-navy/85";
const TXT_HOVER = "hover:text-sky lg:[html:not(.dark)_&]:hover:text-primary";
const ICON = "text-sky lg:[html:not(.dark)_&]:text-primary";

export default function TopBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-[45] hidden h-10 border-b border-on-dark/10 md:block lg:[html:not(.dark)_&]:border-navy/10">
      {/* Same max-width and padding as the Navbar container, so the edges line up */}
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-x-8 px-5 text-[13px] font-medium sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] xl:max-w-[90rem] 2xl:max-w-[100rem]">
        {/* Left: tagline (always on the navy side) */}
        <p className="inline-flex items-center gap-2 justify-self-start text-on-dark/85">
          <PinIcon className="text-sky" />
          {TAGLINE}
        </p>

        {/* Center: working hours (lg and up) */}
        <p className={`hidden items-center gap-2 lg:inline-flex ${TXT}`}>
          <ClockIcon className={ICON} />
          {HOURS}
        </p>

        {/* Right: contact links */}
        <div className="flex items-center gap-x-8 justify-self-end">
          <a
            href={CONTACT.phone.href}
            className={`inline-flex items-center gap-2 transition-colors ${TXT} ${TXT_HOVER}`}
          >
            <PhoneIcon className={ICON} />
            {CONTACT.phone.label}
          </a>

          <a
            href={CONTACT.email.href}
            className={`inline-flex items-center gap-2 transition-colors ${TXT} ${TXT_HOVER}`}
          >
            <MailIcon className={ICON} />
            {CONTACT.email.label}
          </a>

          <a
            href={CONTACT.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mendizo on Facebook"
            className={`transition-colors ${ICON} hover:text-on-dark lg:[html:not(.dark)_&]:hover:text-navy`}
          >
            <FacebookIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

type IconProps = { className?: string };

function svgProps(className = "") {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: `h-4 w-4 ${className}`,
  } as const;
}

function PinIcon({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)}>
      <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MailIcon({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)}>
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