"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { QueryResponse } from "@/lib/types";

const agentLabel = { sahayak: "Sahayak", prahari: "Prahari" } as const;

export function SessionReportDialog({ thread }: { thread: QueryResponse[] }) {
  const answered = thread.filter((t) => !t.abstained);
  const abstained = thread.filter((t) => t.abstained);
  const avgConfidence =
    answered.length > 0
      ? answered.reduce((sum, t) => sum + t.confidence, 0) / answered.length
      : 0;
  const avgEval =
    answered.length > 0
      ? answered.reduce((sum, t) => sum + t.evalScore, 0) / answered.length
      : 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FileText className="size-4" /> View session report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Session Evaluation Report</DialogTitle>
          <DialogDescription>
            Every answer this session, its sources, and its measured citation
            faithfulness and confidence.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Questions</p>
            <p className="font-mono text-lg text-foreground">{thread.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg. citation faithfulness</p>
            <p className="font-mono text-lg text-foreground">
              {answered.length ? `${Math.round(avgEval * 100)}%` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg. confidence</p>
            <p className="font-mono text-lg text-foreground">
              {answered.length ? `${Math.round(avgConfidence * 100)}%` : "—"}
            </p>
          </div>
        </div>

        <ScrollArea className="max-h-[50vh]">
          <ol className="flex flex-col gap-4 pr-3">
            {thread.map((t, i) => (
              <li key={t.id} className="rounded-lg border border-border p-4">
                <p className="font-mono text-xs text-muted-foreground">Q{i + 1}</p>
                <p className="mt-0.5 text-sm font-medium">{t.query}</p>
                {t.abstained ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Abstained — {t.abstainReason}
                  </p>
                ) : (
                  <>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Engaged: {t.agents.map((a) => agentLabel[a]).join(", ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                      {t.citations.map((c) => (
                        <span key={c.label}>§ {c.label}</span>
                      ))}
                    </div>
                    <p className="mt-2 font-mono text-xs text-foreground">
                      Citation faithfulness {Math.round(t.evalScore * 100)}% · Confidence{" "}
                      {Math.round(t.confidence * 100)}%
                    </p>
                  </>
                )}
              </li>
            ))}
          </ol>
        </ScrollArea>

        {abstained.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {abstained.length} of {thread.length} questions were abstained rather than
            guessed — routed to a human IP facilitator.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
