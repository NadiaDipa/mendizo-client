import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  CalendarCheck,
  Clock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Wrench,
  BadgeCheck,
  DollarSign,
  FileText,
  UserCheck,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "How It Works — Mendizo | Transparent Appliance & Smart Device Repair",
  description:
    "Learn how Mendizo makes repairing home appliances and smart devices effortless. Explore the 4-step customer journey and verified technician workflow.",
};

const CUSTOMER_STEPS = [
  {
    step: "01",
    title: "Browse & Select Service",
    description:
      "Explore verified repair services across ACs, Refrigerators, Washing Machines, PCs, Smartphones, and TVs. Compare transparent starting prices, estimated completion times, and technician credentials.",
    icon: Search,
    color: "from-blue-500 to-sky-400",
    badges: ["Upfront Base Rates", "Verified Tech Profiles"],
  },
  {
    step: "02",
    title: "Send a Repair Request",
    description:
      "Describe what is wrong with your device, choose a preferred date and time, and enter your Dhaka address. Your request is sent directly to vetted, certified technicians in your neighborhood.",
    icon: CalendarCheck,
    color: "from-sky-500 to-cyan-400",
    badges: ["Flexible Scheduling", "Doorstep or Drop-off"],
  },
  {
    step: "03",
    title: "Track Live Milestones",
    description:
      "Monitor your repair progress live in your Customer Dashboard through structured milestones: Requested → Accepted → In Progress → Completed. No guesswork or disappearing handymen.",
    icon: Clock,
    color: "from-sky-500 to-blue-400 dark:from-sky-500 dark:to-cyan-400",
    badges: ["Real-time Status", "Direct Communication"],
  },
  {
    step: "04",
    title: "Inspect & Pay After Completion",
    description:
      "Once the technician finishes the repair and sets the final agreed invoice amount, inspect your working appliance. Pay securely online through Stripe test checkout. Zero advance payment risk.",
    icon: CreditCard,
    color: "from-emerald-500 to-teal-400",
    badges: ["Zero Advance Risk", "Stripe Checkout & Receipt"],
  },
];

const TECHNICIAN_WORKFLOW = [
  {
    step: "1",
    title: "Receive Booking Requests",
    description:
      "Technicians receive localized customer requests detailing the device issue, preferred date, and location.",
    icon: FileText,
  },
  {
    step: "2",
    title: "Accept & Plan Appointment",
    description:
      "Accept requests directly from your dashboard, prepare diagnostic tools or spare parts, and confirm schedule.",
    icon: UserCheck,
  },
  {
    step: "3",
    title: "Execute Repair on Site",
    description:
      "Arrive on time, perform comprehensive troubleshooting, and mark the job status as In Progress.",
    icon: Wrench,
  },
  {
    step: "4",
    title: "Invoice & Guaranteed Payout",
    description:
      "Enter the final service charge, mark the repair as Completed, and receive automated digital payout upon customer checkout.",
    icon: DollarSign,
  },
];

const PIPELINE_STAGES = [
  { name: "Requested", desc: "Customer submits problem and address" },
  { name: "Accepted", desc: "Technician reviews and confirms booking" },
  { name: "In Progress", desc: "Diagnostic & repair work underway" },
  { name: "Completed", desc: "Final amount set, repair inspected" },
  { name: "Paid", desc: "Payment settled securely via Stripe" },
];

const FAQS = [
  {
    q: "Do I have to pay anything before the technician arrives?",
    a: "Never. Mendizo strictly enforces a pay-after-completion policy. You do not pay any advance deposit. You only pay once the repair is finished and inspected.",
  },
  {
    q: "How are technicians verified on Mendizo?",
    a: "Every technician submits National ID (NID), background information, and skill qualifications. Accounts are manually verified and approved by administrators before services can be published.",
  },
  {
    q: "Can I cancel a booking if my schedule changes?",
    a: "Yes. Customers can easily cancel pending or accepted bookings directly from their Customer Dashboard with one click.",
  },
  {
    q: "How does the final service payment work?",
    a: "After inspecting the fixed device, you click 'Pay Now' in your dashboard. You are redirected to Stripe test checkout to pay securely via card, and an instant digital receipt is generated.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ─── Hero Header ────────────────────────────────────────── */}
        <section className="bg-navy pt-32 pb-20 text-on-dark sm:pt-40 sm:pb-28">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky">
              <Sparkles className="h-3.5 w-3.5" />
              Simple & Transparent Workflow
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-on-dark sm:text-5xl lg:text-6xl">
              How Mendizo Works
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-on-dark/75 sm:text-lg">
              A predictable, milestone-driven repair platform. From finding a verified technician to
              live job tracking and zero-advance payment—see how we make device and home appliance
              repairs effortless.
            </p>
          </div>
        </section>

        {/* ─── Customer 4-Step Process ────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-sky">
              The Customer Journey
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-4xl">
              Four Steps from Problem to Fixed
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60 dark:text-on-dark/60">
              Clear stages, transparent pricing, and complete control at your fingertips.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CUSTOMER_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col rounded-3xl border border-foreground/10 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/10 dark:bg-surface/40"
                >
                  <span className="font-display text-4xl font-extrabold text-foreground/15 dark:text-white/15">
                    {item.step}
                  </span>

                  <div
                    className={`mt-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold text-navy dark:text-on-dark">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-foreground/65 dark:text-on-dark/65">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
                    {item.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-[10px] font-semibold text-foreground/75 dark:bg-white/10 dark:text-on-dark/80"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Milestone Pipeline Visualizer ──────────────────────── */}
        <section className="border-y border-foreground/10 bg-white/50 py-16 dark:border-white/10 dark:bg-navy/40 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:bg-sky/15 dark:text-sky">
                <BadgeCheck className="h-4 w-4" />
                Live Tracking
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-3xl">
                The Milestone Status Pipeline
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-foreground/60 dark:text-on-dark/60">
                Every booking on Mendizo strictly progresses through five verifiable stages.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {PIPELINE_STAGES.map((stage, idx) => (
                <div
                  key={stage.name}
                  className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-surface/50 text-center"
                >
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs">
                    {idx + 1}
                  </div>
                  <h4 className="mt-3 font-display text-sm font-bold text-navy dark:text-on-dark">
                    {stage.name}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-foreground/60 dark:text-on-dark/60">
                    {stage.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Technician Workflow ─────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:bg-sky/15 dark:text-sky">
                <Wrench className="h-3.5 w-3.5" />
                For Technicians
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-4xl">
                A Modern Operating System for Repair Pros
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70 dark:text-on-dark/70 sm:text-base">
                Mendizo empowers independent technicians with real management tools. Instead of chasing
                unreliable leads or arguing over fees, technicians receive confirmed requests with transparent
                pricing and guaranteed payouts.
              </p>
              <div className="mt-6">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary/90"
                >
                  Join Our Technician Network
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              {TECHNICIAN_WORKFLOW.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-surface/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-sky/15 dark:text-sky">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-sky">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold text-navy dark:text-on-dark">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground/60 dark:text-on-dark/60">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Frequently Asked Questions ──────────────────────────── */}
        <section className="border-t border-foreground/10 bg-white/40 py-20 dark:border-white/10 dark:bg-navy/30 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:bg-sky/15 dark:text-sky">
                <HelpCircle className="h-4 w-4" />
                Got Questions?
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-navy dark:text-on-dark sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-3xl border border-foreground/10 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-surface/40"
                >
                  <h3 className="font-display text-base font-bold text-navy dark:text-on-dark">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/65 dark:text-on-dark/65">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-navy via-surface to-primary p-10 text-white shadow-2xl sm:p-14">
            <h2 className="font-display text-2xl font-bold sm:text-4xl">
              Ready to Book Your Next Repair?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sky-100 sm:text-base">
              Explore verified services in Dhaka. Compare prices, schedule a convenient time slot,
              and enjoy transparent milestone tracking.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-navy shadow-md transition hover:bg-sky-100 hover:scale-105"
              >
                Browse All Services
              </Link>
              <Link
                href="/contact"
                className="rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Have a Question? Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
