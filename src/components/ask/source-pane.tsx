"use client";

import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockLabel } from "@/components/citation";
import { statuteExcerpts, defaultStatuteExcerptNote } from "@/lib/statute-excerpts";
import type { QueryCitation } from "@/lib/types";

// The source pane is the product's premise made visible: every inline
// citation opens the statute it points to, right next to the answer that
// cited it, instead of asking the user to trust an unopened footnote.
export function SourcePane({
  citation,
  onClose,
}: {
  citation: QueryCitation | null;
  onClose: () => void;
}) {
  if (!citation) {
    return (
      <div className="glass flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl px-6 py-10 text-center">
        <BookOpen className="size-5 text-muted-foreground" strokeWidth={1.75} />
        <p className="text-sm text-muted-foreground">
          Click any <span className="font-mono">§ citation</span> in an answer to open its
          source here.
        </p>
      </div>
    );
  }

  const excerpt = statuteExcerpts[citation.label];

  return (
    <div className="glass flex h-full flex-col gap-3 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs text-statute">§ {citation.label}</p>
          <p className="text-xs text-muted-foreground">{citation.source}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={onClose}
          aria-label="Close source"
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-statute-bg/40 p-4 font-serif text-sm leading-relaxed text-foreground">
        {excerpt ?? `No excerpt on file for “${citation.label}”.`}
      </div>
      <MockLabel>{excerpt ? "Illustrative excerpt for this build" : "Not in this build's corpus"}</MockLabel>
      {excerpt && <p className="text-[11px] text-muted-foreground">{defaultStatuteExcerptNote}</p>}
    </div>
  );
}
