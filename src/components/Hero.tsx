"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "./TopBar";
import "./hero-motion.css";

// Transparent PNGs with the empty space around the subject trimmed (place them in public/images/).
//   sx / sy : width / height stretch (1.2 = 20% larger), applied as an inline transform.
//   tx      : shift right (+) / left (-) in px. Increase if it touches the navy curve, decrease if it touches the cards.
// IMG_SCALE resizes all images together: 1 = as is, 0.88 = 12% smaller, 0.8 = 20% smaller.
const IMG_SCALE = 0.9;

const HERO_IMAGES = [
  {
    src: "/images/device-1.png",
    alt: "Technician repairing a device",
    sx: 0.9,
    sy: 1,
    tx: 0,
  },
  {
    src: "/images/showcase-2.png",
    alt: "Technician standing with a refrigerator, washing machine and air conditioner",
    sx: 1.1,
    sy: 1.1,
    tx: -10,
  },
  {
    src: "/images/technician-3.png",
    alt: "Technician working on a home appliance",
    sx: 0.85,
    sy: 1.0,
    tx: 10,
  },
];

// Background photo for the light blue side (public/images/hero-bg.jpg)
const HERO_BG = "/images/hero-bg.jpg";

// All cards share the same right edge (aligned with the Navbar's Sign Up button).
// Only the left margin is staggered, so the cards differ in width but the right edge never moves.
const LIGHT_CARDS = [
  {
    label: "Mobile Phone Repair",
    href: "/services?category=mobile-phone",
    Icon: PhoneIcon,
    offset: "lg:ml-0",
  },
  {
    label: "Laptop Service",
    href: "/services?category=laptop-service",
    Icon: LaptopIcon,
    offset: "lg:ml-10",
  },
  {
    label: "Washing Machine Repair",
    href: "/services?category=washing-machine",
    Icon: WasherIcon,
    offset: "lg:ml-6",
  },
  {
    label: "AC Servicing",
    href: "/services?category=ac-servicing",
    Icon: SnowflakeIcon,
    offset: "lg:ml-0",
  },
];

const DARK_CARDS = [
  {
    label: "Electrical Repair",
    href: "/services?category=electrical-wiring",
    Icon: PlugIcon,
    offset: "lg:ml-0",
  },
  {
    label: "Home Appliance Service",
    href: "/services?category=home-appliance",
    Icon: WasherIcon,
    offset: "lg:ml-8",
  },
  {
    label: "Device Repair",
    href: "/services?category=device-repair",
    Icon: LaptopIcon,
    offset: "lg:ml-4",
  },
  {
    label: "Plumbing Service",
    href: "/services?category=plumbing",
    Icon: TapIcon,
    offset: "lg:ml-0",
  },
];

// Card width. The image area's right edge is derived from this value too, so both stay in sync.
const CARD_W = "clamp(250px,17vw,290px)";

export default function Hero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveImage((current) => (current + 1) % HERO_IMAGES.length);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [activeImage]);

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-navy text-on-dark lg:min-h-[880px] xl:min-h-[920px]"
    >
      <HeroBackground />
      <TopBar />
     

      <div className="relative z-10 mx-auto w-full max-w-7xl xl:max-w-[90rem] 2xl:max-w-[100rem] px-5 pb-14 pt-24 sm:px-8 sm:pb-16 md:pt-[9.5rem] lg:px-12 lg:pb-16 lg:pt-[9.5rem]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6">
          {/* Left: hero content */}
          <div className="mx-auto w-full max-w-[34rem] text-center lg:mx-0 lg:text-left">
            <p
              className="mz-up flex items-center justify-center gap-3 text-[13px] font-medium tracking-wide text-on-dark/80 sm:text-sm lg:justify-start"
              style={{ animationDelay: "0ms" }}
            >
              <span>Smart Repair. Better Life.</span>
              <span className="hidden h-px w-14 bg-on-dark/40 lg:block" aria-hidden="true" />
            </p>

            <h1
              className="mz-up mt-4 font-display text-[clamp(2rem,9.5vw,2.6rem)] leading-[1.05] tracking-tight text-on-dark sm:mt-5 sm:text-[clamp(2.6rem,4.8vw,4.4rem)] sm:leading-[1.04]"
              style={{ animationDelay: "100ms" }}
            >
              <span className="block dark:hidden">
                <span className="block">Repair Made</span>
                <span className="block">Simple.</span>
              </span>

              <span className="hidden dark:block">
                <span className="block">Your Trusted</span>
                <span className="block">Repair Partner.</span>
              </span>
            </h1>

            <p
              className="mz-up mx-auto mt-4 max-w-[28rem] text-[15px] leading-7 text-on-dark/75 sm:mt-6 sm:text-[17px] sm:leading-8 lg:mx-0 lg:mt-6"
              style={{ animationDelay: "200ms" }}
            >
              <span className="dark:hidden">
                Find trusted technicians for your devices and home appliances — fast, easy and
                reliable.
              </span>

              <span className="hidden dark:inline">
                Book expert technicians for all kinds of repair services with complete
                transparency and trust.
              </span>
            </p>

            <div
              className="mz-up mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:mt-9 sm:gap-x-5 sm:gap-y-4 lg:justify-start"
              style={{ animationDelay: "300ms" }}
            >
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_-16px_rgba(0,124,199,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--color-primary),black_12%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky sm:py-3.5 xl:px-7"
              >
                Explore Services
                <ArrowRightIcon className="h-4 w-4" />
              </a>

              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-3 rounded-full border-2 border-primary py-1 pl-1 pr-5 text-sm font-semibold text-on-dark transition-colors duration-300 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky xl:pr-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-on-dark transition-colors duration-300 group-hover:bg-primary">
                  <PlayIcon />
                </span>
                Watch How It Works
              </a>
            </div>

            <ul
              className="mz-up mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[clamp(0.75rem,3.4vw,0.8125rem)] font-medium text-on-dark/75 sm:mt-8 sm:gap-x-6 sm:text-[13px] lg:justify-start"
              style={{ animationDelay: "400ms" }}
            >
              {[
                "Verified technicians",
                "Track every step",
                "Pay after the job is done",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>

            {/* Image stays visible below lg: a single centered column (text first, then hero visual) */}
            <div
              className="mz-up mx-auto mt-6 w-full max-w-[21rem] sm:mt-10 sm:max-w-[26rem] md:mt-12 md:max-w-[30rem] lg:hidden"
              style={{ animationDelay: "500ms" }}
            >
              <HeroStage
                activeImage={activeImage}
                frameClassName="aspect-[16/11] sm:aspect-[4/3]"
                sizes="(min-width: 768px) 30rem, (min-width: 640px) 26rem, 21rem"
              />
            </div>
          </div>

          {/* Spacer column for desktop visuals */}
          <div className="hidden lg:block lg:min-h-[560px]" aria-hidden="true" />
        </div>
      </div>

      {/* Dark mode glow behind image and cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[38%] right-0 z-[4] hidden lg:block"
      >
        <div className="hidden h-full w-full bg-[radial-gradient(ellipse_60%_55%_at_55%_55%,rgba(40,130,230,0.35),transparent_70%)] dark:block" />
      </div>

      {/*
        Right: image slideshow (transparent PNGs)
        - left: just right of the navy curve (lg: 52%, xl: 50%, 2xl: 43%). If CURVE_TIERS change, update this too.
        - right: stops 12px before the cards' left edge. --maxw and --gap match the Navbar container.
      */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[52%] z-[5] hidden items-center justify-center [--gap:1.25rem] [--maxw:80rem] sm:[--gap:2rem] lg:flex xl:left-[50%] xl:[--maxw:90rem] 2xl:left-[43%] 2xl:[--maxw:100rem]"
        style={
          {
            "--card-w": CARD_W,
            right:
              "calc((100% - min(100%, var(--maxw))) / 2 + var(--gap) + var(--card-w) + 0.75rem)",
          } as CSSProperties
        }
      >
        <HeroStage
          activeImage={activeImage}
          className="mz-img-in mx-auto max-w-[1100px]"
          sizes="(min-width: 1024px) 55vw, 0px"
        />
      </div>

      {/*
        Floating service cards
        Uses the exact same max-width and padding as the Navbar container, so
        right-5 / sm:right-8 lines the cards up with the Sign Up button's right edge.
      */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div className="relative mx-auto h-full w-full max-w-7xl xl:max-w-[90rem] 2xl:max-w-[100rem] px-5 sm:px-8">
          <div
            className="absolute right-5 top-1/2 -translate-y-1/2 sm:right-8"
            style={{ width: CARD_W }}
          >
            {/* Light mode cards */}
            <div className="flex flex-col gap-4 dark:hidden">
              {LIGHT_CARDS.map((card, index) => (
                <div
                  key={card.label}
                  className={`mz-card-in ${card.offset}`}
                  style={{ animationDelay: `${600 + index * 120}ms` }}
                >
                  <ServiceCard
                    variant="light"
                    label={card.label}
                    href={card.href}
                    Icon={card.Icon}
                  />
                </div>
              ))}
            </div>

            {/* Dark mode cards */}
            <div className="hidden flex-col gap-4 dark:flex">
              {DARK_CARDS.map((card, index) => (
                <div
                  key={card.label}
                  className={`mz-card-in ${card.offset}`}
                  style={{ animationDelay: `${600 + index * 120}ms` }}
                >
                  <ServiceCard
                    variant="dark"
                    label={card.label}
                    href={card.href}
                    Icon={card.Icon}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type HeroStageProps = {
  /** Index of the slide currently shown. Owned by Hero so every stage stays in sync. */
  activeImage: number;
  /** Responsive sizes hint for next/image. */
  sizes: string;
  className?: string;
  /** Frame aspect ratio. Slightly wider on small phones so the visual sits higher. */
  frameClassName?: string;
};

/**
 * Stage + slideshow shared by the desktop (absolute positioned) layout and the
 * mobile/tablet (in-flow, centered) layout. Only the wrapper sizing differs.
 */
function HeroStage({
  activeImage,
  sizes,
  className = "",
  frameClassName = "aspect-[4/3]",
}: HeroStageProps) {
  return (
    <div className={`relative w-full ${frameClassName} ${className}`}>
      {/*
        Stage: large circle behind the images, so they look like they stand on it
        and the images' bottom edge no longer needs to line up with anything.
        Change h-[120%] to resize it; adjust the -translate-y value to align it vertically with the images.
      */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 aspect-square h-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.95),rgba(255,255,255,0.45)_55%,rgba(0,124,199,0.10)_100%)] shadow-[0_40px_80px_-30px_rgba(0,124,199,0.35),inset_0_2px_0_rgba(255,255,255,0.9)] dark:border-sky/25 dark:bg-[radial-gradient(circle_at_50%_35%,rgba(77,168,218,0.35),rgba(18,70,127,0.25)_60%,rgba(11,42,70,0.15)_100%)] dark:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
      />
      {/* Small shadow under the stage so it looks grounded */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[calc(50%+57%)] h-[6%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-navy/15 blur-2xl dark:bg-black/50"
      />

      {HERO_IMAGES.map((image, index) => (
        <div
          key={image.src}
          aria-hidden={activeImage !== index}
          className={`mz-slide-layer absolute inset-0 ${
            activeImage === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: `translateX(${image.tx}px) scale(${image.sx * IMG_SCALE}, ${image.sy * IMG_SCALE})`,
            // Fade-out first, then fade-in, so two images are never visible at once (no ghosting).
            transitionProperty: "opacity",
            transitionDuration: "450ms",
            transitionTimingFunction: "ease-in-out",
            transitionDelay: activeImage === index ? "450ms" : "0ms",
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes={sizes}
            className="object-contain object-center drop-shadow-[0_14px_18px_rgba(11,34,64,0.18)] dark:drop-shadow-[0_14px_18px_rgba(0,0,0,0.4)]"
          />
        </div>
      ))}
    </div>
  );
}

// Curve between the navy and light blue areas. shift = how far the curve moves left (viewBox units).
const CURVE_TIERS = [
  { id: "lg", shift: 0, show: "hidden lg:block xl:hidden" },
  { id: "xl", shift: 50, show: "hidden xl:block 2xl:hidden" },
  { id: "2xl", shift: 110, show: "hidden 2xl:block" },
] as const;

function curvePath(shift: number) {
  const x = (n: number) => n - shift;
  return `M${x(430)} 0 C${x(465)} 70 ${x(700)} 150 ${x(730)} 300 C${x(755)} 420 ${x(690)} 520 ${x(700)} 650 C${x(710)} 780 ${x(790)} 860 ${x(850)} 900 L1440 900 L1440 0 Z`;
}

function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Desktop curved background (only one tier is visible per screen size) */}
      {CURVE_TIERS.map((tier) => (
        <svg
          key={`curve-${tier.id}`}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className={`mz-reveal absolute inset-0 h-full w-full ${tier.show}`}
        >
          <defs>
            <linearGradient
              id={`hero-right-gradient-${tier.id}`}
              x1="15%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--hero-right-from)" />
              <stop offset="100%" stopColor="var(--hero-right-to)" />
            </linearGradient>
          </defs>

          <path
            d={curvePath(tier.shift)}
            fill={`url(#hero-right-gradient-${tier.id})`}
          />
        </svg>
      ))}

      {/* Photo background for the light blue side, clipped with the same curve */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          {CURVE_TIERS.map((tier) => (
            <clipPath
              key={tier.id}
              id={`hero-right-clip-${tier.id}`}
              clipPathUnits="objectBoundingBox"
            >
              <path
                transform="scale(0.000694444 0.001111111)"
                d={curvePath(tier.shift)}
              />
            </clipPath>
          ))}
        </defs>
      </svg>
      {CURVE_TIERS.map((tier) => (
        <div
          key={`photo-${tier.id}`}
          className={`absolute inset-0 ${tier.show}`}
          style={{ clipPath: `url(#hero-right-clip-${tier.id})` }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px] dark:opacity-20"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--hero-right-from),transparent_55%)] opacity-70" />
        </div>
      ))}

      {/* Mobile background */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full lg:hidden"
      >
        <defs>
          <linearGradient
            id="hero-right-gradient-sm"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        <path
          d="M0 520 C240 470 420 520 720 560 C1020 600 1200 560 1440 520 L1440 900 L0 900 Z"
          fill="url(#hero-right-gradient-sm)"
        />
      </svg>
    </div>
  );
}

type ServiceCardProps = {
  variant: "light" | "dark";
  label: string;
  href: string;
  Icon: () => JSX.Element;
};

const CARD_STYLES = {
  light: {
    link: "border border-white/90 bg-white/95 text-navy shadow-[0_14px_32px_-10px_rgba(0,124,199,0.38),0_4px_10px_-3px_rgba(11,34,64,0.13),inset_0_1px_0_rgba(255,255,255,0.98)] ring-1 ring-sky-100/80 hover:border-sky-100 hover:shadow-[0_20px_38px_-10px_rgba(0,124,199,0.46),0_5px_12px_-3px_rgba(11,34,64,0.15),inset_0_1px_0_rgba(255,255,255,1)]",
    icon: "bg-primary/10 text-primary",
    arrow: "bg-primary/10 text-primary",
  },
  dark: {
    link: "border-sky/35 bg-[#12467F]/80 text-white shadow-[0_16px_36px_-10px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.14)] hover:border-sky/60 hover:bg-[#165697]/90 hover:shadow-[0_22px_44px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)]",
    icon: "bg-sky/20 text-sky",
    arrow: "bg-white/10 text-white",
  },
} as const;

function ServiceCard({ variant, label, href, Icon }: ServiceCardProps) {
  const styles = CARD_STYLES[variant];

  return (
    <Link
      href={href}
      className={`pointer-events-auto flex min-h-[72px] w-full items-center gap-3 rounded-[20px] border p-3.5 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 ${styles.link}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${styles.icon}`}
      >
        <Icon />
      </span>

      <span className="min-w-0 flex-1 text-[13px] font-semibold leading-snug">
        {label}
      </span>

      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${styles.arrow}`}
      >
        <ArrowUpRightIcon />
      </span>
    </Link>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 text-sky"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <rect x="4" y="4" width="16" height="11" rx="2" />
      <path d="M2.5 18.5h19" />
    </svg>
  );
}

function WasherIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <rect x="3.5" y="2.5" width="17" height="19" rx="2.5" />
      <circle cx="12" cy="14" r="4.5" />
      <path d="M7 6.5h.01M10.5 6.5h.01" />
    </svg>
  );
}

function SnowflakeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9M12 3 9.5 5.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5 2.5M4.5 7.5l3.4.4M4.5 16.5l3.4-.4M19.5 7.5l-3.4.4M19.5 16.5l-3.4-.4" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M9 2.5v5M15 2.5v5M6 7.5h12v3a6 6 0 0 1-12 0v-3ZM12 16.5v5" />
    </svg>
  );
}

function TapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M3 9h10a4 4 0 0 1 4 4v1.5M9 9V5.5M6.5 5.5h5" />
      <path d="M17 17.5c1.1 1.3 1.8 2.3 1.8 3a1.8 1.8 0 0 1-3.6 0c0-.7.7-1.7 1.8-3Z" />
    </svg>
  );
}