"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function EvalReveal({
  evalScore,
  confidence,
  method,
}: {
  evalScore: number;
  confidence: number;
  method: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-t border-border/60 pt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        {open ? "Hide eval score" : "Show eval score"}
      </button>
      {open && (
        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <div>
            <dt className="text-muted-foreground">Citation faithfulness</dt>
            <dd className="font-mono text-foreground">{Math.round(evalScore * 100)}%</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Confidence</dt>
            <dd className="font-mono text-foreground">{Math.round(confidence * 100)}%</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Method</dt>
            <dd className="text-foreground">{method}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
