import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Users,
  Wrench,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  HelpCircle,
  FileCheck,
  CreditCard,
  Target,
} from "lucide-react";

export const metadata = {
  title: "About Us — Mendizo | Smart Device & Home Appliance Repair Platform",
  description:
    "Discover Mendizo's mission to make device and home appliance repair in Bangladesh transparent, accountable, and hassle-free through verified technicians and milestone-based servicing.",
};

const STATS = [
  { value: "100+", label: "Verified Technicians" },
  { value: "5,000+", label: "Successful Repairs" },
  { value: "99.4%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Dedicated Support" },
];

const PROBLEMS_SOLVED = [
  {
    traditional: "Hidden fees, inflated estimates, and sudden price changes after disassembly.",
    mendizo: "Clear upfront base pricing with itemized final amounts agreed upon before payment.",
    title: "Transparent & Predictable Pricing",
    icon: CreditCard,
  },
  {
    traditional: "Endless waiting, missed appointments, and zero progress visibility.",
    mendizo: "Live milestone tracking: Requested → Accepted → In Progress → Completed.",
    title: "Accountable Milestone Pipeline",
    icon: Clock,
  },
  {
    traditional: "Unvetted freelance handymen with no credential checks or recourse for damage.",
    mendizo: "Strict technician onboarding with identity verification and admin approval.",
    title: "Certified Technician Network",
    icon: ShieldCheck,
  },
  {
    traditional: "Demands for large upfront deposits before any actual diagnosis is made.",
    mendizo: "Zero advance payment risk. You pay via secure Stripe checkout only after inspection.",
    title: "Pay Only After Completion",
    icon: CheckCircle2,
  },
];

const CORE_VALUES = [
  {
    title: "Integrity First",
    description:
      "We believe trust is earned through transparency. No fake quotes, no surprise surcharges, and no misleading claims.",
    icon: Award,
  },
  {
    title: "Vetted Excellence",
    description:
      "Every technician listing services on Mendizo undergoes background checks, skill verification, and ongoing customer ratings audits.",
    icon: FileCheck,
  },
  {
    title: "Empowering Local Pros",
    description:
      "We provide independent repair professionals with modern digital tools to manage bookings, build reputation, and grow their income.",
    icon: TrendingUp,
  },
  {
    title: "Customer-Centric Care",
    description:
      "From seamless online booking to responsive customer support, we stand behind every repair completed on our platform.",
    icon: HeartHandshake,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ─── Hero Header ────────────────────────────────────────── */}
        <section className="bg-navy pt-32 pb-20 text-on-dark sm:pt-40 sm:pb-28">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky">
              <Sparkles className="h-3.5 w-3.5" />
              Our Mission & Purpose
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-on-dark sm:text-5xl lg:text-6xl">
              Transforming How Devices & Appliances Get Repaired.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-on-dark/75 sm:text-lg">
              When your refrigerator stops cooling, your washing machine fails mid-cycle, or your
              work laptop refuses to turn on, getting it fixed shouldn’t feel like a gamble. Mendizo
              was built to bring transparency, vetted craftsmanship, and zero-risk service to every home.
            </p>
          </div>
        </section>

        {/* ─── Stats Banner ───────────────────────────────────────── */}
        <section className="relative -mt-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-foreground/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-surface sm:grid-cols-4 sm:p-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-extrabold text-primary dark:text-sky sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-foreground/60 dark:text-on-dark/60 sm:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── The Problem We Solve ───────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-sky">
              The Problem & Our Solution
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-4xl">
              Why Mendizo Was Created
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/60 dark:text-on-dark/60">
              Traditional repair services often lack accountability, upfront pricing, and verifiable
              credentials. Mendizo replaces uncertainty with a dependable, standardized experience.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PROBLEMS_SOLVED.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-foreground/10 bg-white p-7 shadow-xs transition-all hover:shadow-lg dark:border-white/10 dark:bg-surface/30 sm:p-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-navy dark:text-on-dark">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-3">
                    {/* Traditional Pain Point (Red) */}
                    <div className="rounded-2xl border border-red-200/90 bg-red-50/70 p-4 transition-colors dark:border-red-900/40 dark:bg-red-950/25">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-extrabold text-red-600 dark:bg-red-900/50 dark:text-red-300">
                          ✕
                        </span>
                        <p className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                          Traditional Pain Point
                        </p>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                        {item.traditional}
                      </p>
                    </div>

                    {/* The Mendizo Standard (Green) */}
                    <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/70 p-4 transition-colors dark:border-emerald-900/40 dark:bg-emerald-950/25">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                          ✓
                        </span>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                          The Mendizo Standard
                        </p>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                        {item.mendizo}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Our Certified Technician Network ───────────────────── */}
        <section className="border-y border-foreground/10 bg-white/50 py-20 dark:border-white/10 dark:bg-navy/40 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:bg-sky/15 dark:text-sky">
                  <Users className="h-3.5 w-3.5" />
                  Technician Network
                </span>
                <h2 className="mt-3 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-4xl">
                  Empowering Skilled Local Professionals
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-foreground/70 dark:text-on-dark/70 sm:text-base">
                  Mendizo is not just for customers—it is an engine for economic empowerment. Skilled
                  technicians in Dhaka often struggle with marketing, unsteady income, and client dispute
                  management.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70 dark:text-on-dark/70 sm:text-base">
                  We give certified technicians a professional platform to showcase their specialties,
                  manage active repair pipelines, schedule appointments effortlessly, and receive guaranteed
                  digital payments upon job completion.
                </p>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-navy dark:text-on-dark">
                      Strict background checks & NID verification before approval
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-navy dark:text-on-dark">
                      Transparent technician profiles showing service coverage and bio
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-navy dark:text-on-dark">
                      Admin oversight and customer feedback to maintain highest service standards
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-foreground/10 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-surface/50 sm:p-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky/15 text-sky">
                    <Wrench className="h-7 w-7 text-primary dark:text-sky" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-navy dark:text-on-dark">
                      Are You a Repair Specialist?
                    </h3>
                    <p className="text-xs text-foreground/60 dark:text-on-dark/60">
                      Join hundreds of technicians growing their business on Mendizo.
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3.5 text-xs text-foreground/75 dark:text-on-dark/75">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-primary dark:text-sky">✓</span>
                    <span>List your repair services with customized prices, diagnostic times, and terms.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-primary dark:text-sky">✓</span>
                    <span>Receive real-time repair requests from verified households across your service area.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-primary dark:text-sky">✓</span>
                    <span>Direct status controls: move repairs smoothly through accepted, in progress, and completed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-primary dark:text-sky">✓</span>
                    <span>Fast, guaranteed payment processing without chasing overdue invoices.</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    href="/sign-up"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 px-5 text-sm font-bold text-white shadow-md transition hover:bg-primary/90"
                  >
                    Apply as a Technician
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Core Values ────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-sky">
              Our Core Principles
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-4xl">
              Values That Guide Every Repair
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60 dark:text-on-dark/60">
              The foundation of trust between our customers, technicians, and team.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="rounded-3xl border border-foreground/10 bg-white p-7 shadow-xs dark:border-white/10 dark:bg-surface/30 sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold text-navy dark:text-on-dark">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/65 dark:text-on-dark/65">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Final CTA ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="rounded-3xl bg-gradient-to-r from-navy via-surface to-primary p-10 text-white shadow-2xl sm:p-14 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-4xl">
              Have a Broken Device or Home Appliance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sky-100 sm:text-base">
              Experience transparent, milestone-tracked repairs from verified technicians in Dhaka.
              Zero upfront risk—pay only when your device works like new again.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-navy shadow-md transition hover:bg-sky-100 hover:scale-105"
              >
                Browse All Services
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Join as a Technician
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
