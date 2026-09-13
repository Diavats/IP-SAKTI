import type { QueryDepth } from "@/lib/types";
import { cn } from "@/lib/utils";

const tiers: { key: QueryDepth; label: string }[] = [
  { key: "quick", label: "Quick" },
  { key: "guided", label: "Guided" },
  { key: "deep", label: "Deep" },
];

// Surfaces the Orchestrator's Depth Controller tier for this answer — the
// architecture's main differentiator (SAMHITA-PLAN.md §2.1), otherwise
// invisible on screen.
export function DepthIndicator({ depth }: { depth: QueryDepth }) {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-sm border border-border bg-secondary/50 p-0.5 font-mono text-[10px] uppercase tracking-wide"
      title="Depth Controller tier for this answer"
    >
      {tiers.map((t) => (
        <span
          key={t.key}
          className={cn(
            "rounded-[3px] px-1.5 py-0.5",
            t.key === depth
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground"
          )}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}
