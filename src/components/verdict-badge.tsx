import type { Verdict } from "@/lib/types";
import { cn } from "@/lib/utils";

const verdictConfig: Record<Verdict, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "bg-verdict-open-bg text-verdict-open",
  },
  barred: {
    label: "Barred",
    className: "bg-verdict-barred-bg text-verdict-barred",
  },
  maybe_open: {
    label: "May be open",
    className: "bg-verdict-draft-bg text-verdict-draft",
  },
};

export function VerdictBadge({ verdict, className }: { verdict: Verdict; className?: string }) {
  const config = verdictConfig[verdict];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-xs font-medium uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
