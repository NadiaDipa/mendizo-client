import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  Send,
  Wrench,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Users,
} from "lucide-react";

export const metadata = {
  title: "How It Works & About — Mendizo",
  description: "Learn how Mendizo makes device and home appliance repair transparent, trackable, and stress-free.",
};

const STEPS = [
  {
    step: "01",
    title: "Find a Service",
    description: "Browse verified repair services by category, brand, or problem. Review starting prices, estimated completion times, and technician profiles.",
    icon: Search,
    color: "from-blue-500 to-sky-400",
  },
  {
    step: "02",
    title: "Send a Repair Request",
    description: "Describe the device issue, pick a convenient date, and provide your address. Receive instant confirmation when a qualified technician accepts.",
    icon: Send,
    color: "from-sky-500 to-cyan-400",
  },
  {
    step: "03",
    title: "Technician Fixes It",
    description: "Track the job live through clear stages: Requested → Accepted → In Progress → Completed. No mystery, no hidden surprises.",
    icon: Wrench,
    color: "from-amber-500 to-orange-400",
  },
  {
    step: "04",
    title: "Pay After Completion",
    description: "Once the work is inspected and finished, pay securely online via Stripe test checkout. No advance payment required.",
    icon: CreditCard,
    color: "from-emerald-500 to-teal-400",
  },
];

const TRUST_POINTS = [
  {
    title: "Verified Professionals",
    description: "Every technician passes identity verification and background credential checks before listing services.",
    icon: ShieldCheck,
  },
  {
    title: "Zero Advance Risk",
    description: "Your money stays with you until the technician sets the final amount and marks the repair as completed.",
    icon: CheckCircle2,
  },
  {
    title: "Live Milestone Pipeline",
    description: "Full visibility over who is handling your device and exactly what stage the repair is currently in.",
    icon: Clock,
  },
  {
    title: "Community Backed",
    description: "Customer reviews, verified badges, and active administrator moderation keep service quality top tier.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-navy pt-32 pb-20 text-on-dark sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent • Reliable • Guaranteed
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-on-dark sm:text-5xl lg:text-6xl">
            Repairing Appliances Should Not Be a Gamble.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-on-dark/75 sm:text-lg">
            Mendizo connects everyday people with verified, trustworthy technicians. Every job is
            tracked step by step, and you pay only after the job is completely done.
          </p>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-sky">
            Step-by-Step Flow
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-4xl">
            How Mendizo Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60 dark:text-on-dark/60">
            A frictionless, predictable experience from request to final payment.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-3xl border border-foreground/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/10 dark:bg-surface/40"
              >
                <span className="font-display text-4xl font-extrabold text-foreground/15 dark:text-white/15">
                  {item.step}
                </span>

                <div className={`mt-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-navy dark:text-on-dark">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-foreground/65 dark:text-on-dark/65">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Mendizo */}
      <section className="border-y border-foreground/10 bg-white/50 py-20 dark:border-white/10 dark:bg-navy/50 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-sky">
              Trust & Safety
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-4xl">
              Why Customers Love Mendizo
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-surface/30"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-bold text-base text-navy dark:text-on-dark">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/60 dark:text-on-dark/60">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <div className="rounded-3xl bg-gradient-to-r from-navy via-surface to-primary p-10 text-white shadow-2xl sm:p-14">
          <h2 className="font-display text-2xl font-bold sm:text-4xl">
            Have a Broken Device or Appliance?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sky-100 sm:text-base">
            Get it fixed by vetted experts in Dhaka. No stress, clear milestones, and pay only when
            it works like new again.
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

      <Footer />
    </div>
  );
}
