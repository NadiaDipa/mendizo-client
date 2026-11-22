import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import MendizoLogo from "./MendizoLogo";
import ThemeToggle from "./ThemeToggle";
import { ArrowLeftIcon, CheckIcon } from "./AuthIcons";

type AuthVariant = "sign-in" | "sign-up";

const COPY: Record<
  AuthVariant,
  { eyebrow: string; headline: string; description: string }
> = {
  "sign-in": {
    eyebrow: "Smart Repair. Better Life.",
    headline: "Trusted repairs, one doorstep away.",
    description:
      "Sign in to track your bookings, chat with your technician and pay only when the job is done.",
  },
  "sign-up": {
    eyebrow: "Join Mendizo",
    headline: "Expert care for every appliance.",
    description:
      "Create an account to book verified technicians, follow every repair in real time and pay after the job is done.",
  },
};

const BULLETS = [
  "Verified technicians",
  "Track every step",
  "Pay after the job is done",
];

type AuthShellProps = {
  variant: AuthVariant;
  children: ReactNode;
};

/**
 * Split auth layout: branded navy panel + clean form panel.
 * UI only — no auth provider is wired up here.
 */
export default function AuthShell({ variant, children }: AuthShellProps) {
  const copy = COPY[variant];
  const year = new Date().getFullYear();

  return (
    <main className="flex min-h-screen flex-1 bg-background text-foreground">
      <div className="grid w-full lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {/* Brand panel */}
        <aside className="relative isolate overflow-hidden border-foreground/10 bg-navy px-6 pb-8 pt-7 text-on-dark sm:px-10 sm:pb-10 sm:pt-8 lg:sticky lg:top-0 lg:min-h-screen lg:self-start lg:border-r lg:px-12 lg:pb-12 lg:pt-11 xl:px-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-20 -top-24 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(77,168,218,0.32),transparent_66%)]" />
            <div className="absolute -left-24 top-1/2 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(0,124,199,0.24),transparent_68%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(18,35,46,0.75),transparent)]" />
          </div>

          <div className="relative z-10">
            <MendizoLogo />
          </div>

          <div className="relative z-10 mt-8 md:mt-10 md:flex md:items-center md:justify-between md:gap-10 lg:mt-12 lg:block">
            <div className="max-w-[32rem]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky">
                {copy.eyebrow}
              </p>

              <h2 className="mt-3 font-display text-[clamp(1.65rem,5.4vw,2.1rem)] leading-[1.12] tracking-tight sm:text-[clamp(1.9rem,4vw,2.4rem)] lg:text-[clamp(2.15rem,2.7vw,2.9rem)]">
                {copy.headline}
              </h2>

              <p className="mt-3 hidden max-w-[27rem] text-[13.5px] leading-6 text-on-dark/70 sm:block lg:mt-4 lg:text-[15px] lg:leading-7">
                {copy.description}
              </p>

              <ul className="mt-6 hidden gap-2.5 lg:grid">
                {BULLETS.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2.5 text-[13px] font-medium text-on-dark/75"
                  >
                    <CheckIcon className="h-4 w-4 shrink-0 text-sky" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tablet: compact circular stage next to the copy */}
            <div
              aria-hidden="true"
              className="relative hidden h-48 w-48 shrink-0 md:block lg:hidden"
            >
              <div className="absolute inset-0 rounded-full border border-white/60 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.95),rgba(255,255,255,0.45)_55%,rgba(0,124,199,0.16)_100%)] shadow-[0_32px_60px_-28px_rgba(0,0,0,0.65)]" />
              <Image
                src="/images/device-1.png"
                alt=""
                fill
                sizes="12rem"
                className="object-contain p-2 drop-shadow-[0_12px_16px_rgba(11,34,64,0.25)]"
              />
            </div>
          </div>

          {/* Desktop: photographic visual + floating badge */}
          <div className="relative z-10 mt-10 hidden lg:block">
            {/* Outer frame: equal gap (p-3) on all four sides */}
            <div className="w-full rounded-[28px] border border-white/20 bg-white/[0.07] p-3 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)]">
              <div className="relative aspect-[3/1] w-full overflow-hidden rounded-[18px]">
                <Image
                  src="/images/sign-in.png"
                  alt="Mendizo technicians repairing a smartphone, an AC and a washing machine"
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 0px"
                  className="scale-[1.02] object-cover object-[center_55%]"
                />

                <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-primary shadow-[0_12px_28px_-14px_rgba(11,34,64,0.6)]">
                  <CheckIcon className="h-3.5 w-3.5 text-primary" />
                  Verified professionals
                </span>
              </div>
            </div>
          </div>

          <p className="relative z-10 mt-8 hidden text-[11.5px] text-on-dark/50 lg:block">
            © {year} Mendizo. Expert repairs at your doorstep.
          </p>
        </aside>

        {/* Form panel */}
        <section className="flex flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-14 lg:py-8 xl:px-20">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[13px] font-semibold text-foreground/70 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky dark:hover:text-sky"
            >
              <ArrowLeftIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to home
            </Link>

            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center justify-center py-8 sm:py-10 lg:py-6">
            <div className="w-full max-w-[28rem]">
              <div className="rounded-[26px] border border-foreground/10 bg-white p-5 shadow-[0_30px_70px_-48px_rgba(18,35,46,0.55)] sm:p-6 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.8)]">
                {children}
              </div>
            </div>
          </div>

          <p className="text-center text-[11.5px] text-foreground/40 lg:hidden">
            © {year} Mendizo. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}