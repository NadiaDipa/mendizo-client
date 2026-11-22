import { CheckCircle2, XCircle } from "lucide-react";

type AvailabilityBadgeProps = {
  isAvailable: boolean;
  className?: string;
  showIcon?: boolean;
};

/**
 * Customer-facing service availability badge.
 * The value must come straight from the MongoDB `isAvailable` field.
 */
export default function AvailabilityBadge({
  isAvailable,
  className = "",
  showIcon = true,
}: AvailabilityBadgeProps) {
  const available = isAvailable === true;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-[10.5px] font-bold uppercase tracking-[0.08em]",
        "shadow-sm backdrop-blur-sm",
        available
          ? "border-emerald-500/35 bg-emerald-50/95 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-950/85 dark:text-emerald-300"
          : "border-red-500/30 bg-red-50/95 text-red-700 dark:border-red-400/30 dark:bg-red-950/85 dark:text-red-300",
        className,
      ].join(" ")}
      aria-label={available ? "Available" : "Unavailable"}
    >
      {showIcon &&
        (available ? (
          <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
        ) : (
          <XCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
        ))}
      {available ? "Available" : "Unavailable"}
    </span>
  );
}
