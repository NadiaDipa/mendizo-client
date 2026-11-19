import Link from "next/link";

/**
 * Mendizo mark + wordmark, tuned for dark surfaces (auth brand panel).
 * The Navbar keeps its own copy of the mark so its behaviour stays untouched.
 */
export default function MendizoLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Mendizo home"
      className={`group inline-flex items-center gap-2.5 text-on-dark ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 text-sky transition-transform duration-300 group-hover:rotate-6 sm:h-10 sm:w-10"
      >
        <defs>
          <mask id="mz-auth-wrench-slot">
            <rect width="48" height="48" fill="white" />
            <rect x="20" y="-1" width="8" height="12" rx="2" fill="black" />
          </mask>
        </defs>

        <g
          transform="rotate(-45 24 24)"
          mask="url(#mz-auth-wrench-slot)"
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

      <span className="font-display text-[26px] leading-none tracking-wide sm:text-[28px]">
        Mendizo
      </span>
    </Link>
  );
}
