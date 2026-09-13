"use client";

import * as React from "react";
import type { QueryDepth } from "@/lib/types";
import { cn } from "@/lib/utils";

const tiers: { key: QueryDepth; label: string }[] = [
  { key: "quick", label: "Quick" },
  { key: "guided", label: "Guided" },
  { key: "deep", label: "Deep" },
];

// Surfaces the Orchestrator's Depth Controller tier for this answer — the
// architecture's main differentiator (SAMHITA-PLAN.md §2.1), otherwise
// invisible on screen. Starts unresolved and settles onto the real tier a
// beat after mount, so the pick reads as a decision rather than a static label.
export function DepthIndicator({ depth }: { depth: QueryDepth }) {
  const [resolved, setResolved] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setResolved(true), 150);
    return () => clearTimeout(t);
  }, [depth]);

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-sm border border-border bg-secondary/50 p-0.5 font-mono text-[10px] uppercase tracking-wide"
      title="Depth Controller tier for this answer"
    >
      {tiers.map((t) => (
        <span
          key={t.key}
          className={cn(
            "rounded-[3px] px-1.5 py-0.5 transition-colors duration-300 motion-reduce:transition-none",
            t.key === depth && resolved
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
