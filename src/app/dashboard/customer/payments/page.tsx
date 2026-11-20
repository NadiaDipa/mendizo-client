import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Payment History — Mendizo",
  description: "Review your Mendizo transactions and payment records.",
};

const CARD =
  "rounded-2xl border border-foreground/8 bg-white shadow-[0_6px_28px_-14px_rgba(18,35,46,0.12)] dark:border-white/8 dark:bg-white/[0.04] dark:shadow-[0_6px_28px_-14px_rgba(0,0,0,0.5)]";

// ─── Sample data (UI preview only) ───────────────────────────────────────────

type PaymentStatus = "Paid" | "Refunded";

type Payment = {
  id: string;
  service: string;
  technician: string;
  amount: number;
  transactionId: string;
  date: string;
  status: PaymentStatus;
  image: string;
};

const PAYMENTS: Payment[] = [
  {
    id: "PAY-2051",
    service: "Washing Machine Motor Repair",
    technician: "Sumon Hossain",
    amount: 2300,
    transactionId: "TXN-7C19M2Q8",
    date: "Nov 09, 2026",
    status: "Paid",
    image: "/images/technician-3.png",
  },
  {
    id: "PAY-2048",
    service: "Refrigerator Gas Recharge",
    technician: "Mizanur Rahman",
    amount: 1800,
    transactionId: "TXN-6B73P4R2",
    date: "Nov 02, 2026",
    status: "Paid",
    image: "/images/device-1.png",
  },
  {
    id: "PAY-2044",
    service: "Mobile Screen Replacement",
    technician: "Arif Billah",
    amount: 3200,
    transactionId: "TXN-4D91H6V3",
    date: "Oct 28, 2026",
    status: "Refunded",
    image: "/images/showcase-2.png",
  },
  {
    id: "PAY-2039",
    service: "LED TV Panel Repair",
    technician: "Kabir Uddin",
    amount: 3500,
    transactionId: "TXN-5A28N7T9",
    date: "Oct 24, 2026",
    status: "Paid",
    image: "/images/technician-3.png",
  },
  {
    id: "PAY-2031",
    service: "Laptop Keyboard Repair",
    technician: "Tanvir Ahmed",
    amount: 1500,
    transactionId: "TXN-3E64J8W5",
    date: "Oct 12, 2026",
    status: "Paid",
    image: "/images/device-1.png",
  },
];

const STATUS_BADGE: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  Refunded:
    "bg-slate-500/10 text-slate-600 dark:bg-white/10 dark:text-on-dark/70",
};

const totalPaid = PAYMENTS.filter((payment) => payment.status === "Paid").reduce(
  (sum, payment) => sum + payment.amount,
  0
);

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Intro */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-primary dark:text-sky">
            Payments
          </p>
          <h2 className="mt-1 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight tracking-tight text-navy dark:text-on-dark">
            Transaction history
          </h2>
          <p className="mt-1 text-[13px] text-foreground/55">
            Review your completed transactions and payment records.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex w-fit items-center rounded-full border border-foreground/10 bg-white px-3.5 py-1.5 text-[11.5px] font-semibold text-foreground/60 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-on-dark/70">
            {PAYMENTS.length} transactions
          </span>
          <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-[11.5px] font-semibold text-primary dark:border-sky/25 dark:bg-sky/10 dark:text-sky">
            Total paid ৳{totalPaid.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Desktop table */}
      <div className={`${CARD} hidden overflow-hidden md:block`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <caption className="sr-only">Payment history</caption>
            <thead className="bg-foreground/[0.02] dark:bg-white/[0.02]">
              <tr className="border-b border-foreground/8 dark:border-white/8">
                <th scope="col" className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/45">
                  Service
                </th>
                <th scope="col" className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/45">
                  Technician
                </th>
                <th scope="col" className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/45">
                  Amount
                </th>
                <th scope="col" className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/45">
                  Transaction ID
                </th>
                <th scope="col" className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/45">
                  Payment Date
                </th>
                <th scope="col" className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/45">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-foreground/8 dark:divide-white/8">
              {PAYMENTS.map((payment) => (
                <tr
                  key={payment.id}
                  className="transition-colors hover:bg-foreground/[0.015] dark:hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-foreground/8 bg-mist dark:border-white/8 dark:bg-navy">
                        <Image
                          src={payment.image}
                          alt={payment.service}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[200px] truncate text-[13px] font-semibold text-navy dark:text-on-dark">
                          {payment.service}
                        </p>
                        <p className="text-[10.5px] text-foreground/40">
                          {payment.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-[12.5px] text-foreground/60">
                    {payment.technician}
                  </td>

                  <td className="px-4 py-4 text-[13px] font-bold text-navy dark:text-on-dark">
                    ৳{payment.amount.toLocaleString()}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-md bg-foreground/[0.04] px-2 py-1 font-mono text-[11px] text-foreground/55 dark:bg-white/[0.06]">
                      {payment.transactionId}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-[12.5px] text-foreground/60">
                    {payment.date}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      label={payment.status}
                      className={STATUS_BADGE[payment.status]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {PAYMENTS.map((payment) => (
          <li key={payment.id} className={`${CARD} p-4`}>
            <div className="flex items-start gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-foreground/8 bg-mist dark:border-white/8 dark:bg-navy">
                <Image
                  src={payment.image}
                  alt={payment.service}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-snug text-navy dark:text-on-dark">
                  {payment.service}
                </p>
                <p className="mt-0.5 text-[11.5px] text-foreground/50">
                  {payment.technician}
                </p>
              </div>

              <p className="shrink-0 text-[14px] font-bold text-navy dark:text-on-dark">
                ৳{payment.amount.toLocaleString()}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-foreground/[0.02] p-3 dark:bg-white/[0.02]">
              <div className="min-w-0">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-foreground/40">
                  Transaction ID
                </p>
                <p className="mt-0.5 truncate font-mono text-[11.5px] text-foreground/60">
                  {payment.transactionId}
                </p>
              </div>

              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-foreground/40">
                  Payment Date
                </p>
                <p className="mt-0.5 text-[11.5px] text-foreground/60">
                  {payment.date}
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <StatusBadge
                label={payment.status}
                className={STATUS_BADGE[payment.status]}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
