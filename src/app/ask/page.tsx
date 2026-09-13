"use client";

import * as React from "react";
import { Send, ShieldCheck } from "lucide-react";
import { previewQuerySteps, submitQuery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Citation } from "@/components/citation";
import { AgentBanner } from "@/components/ask/agent-banner";
import { EvalReveal } from "@/components/ask/eval-reveal";
import { LivePanel, type LivePanelState } from "@/components/ask/live-panel";
import { SessionReportDialog } from "@/components/ask/session-report-dialog";
import type { QueryDepth, QueryResponse } from "@/lib/types";

const suggestions = [
  "Can I patent my polyherbal formulation containing Ashwagandha, Guduchi and Turmeric?",
  "What is Prahari currently watching?",
  "Is a geographical indication open for wild-collected guggul from Rajasthan?",
  "Can I sell this formulation in Nepal?",
];

export default function AskPage() {
  const [query, setQuery] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [thread, setThread] = React.useState<QueryResponse[]>([]);
  const [panel, setPanel] = React.useState<LivePanelState>({ kind: "idle" });
  const revealTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    return () => {
      if (revealTimer.current) clearInterval(revealTimer.current);
    };
  }, []);

  async function runQuery(text: string, depth: QueryDepth) {
    if (!text.trim()) return;
    setPending(true);

    const preview = previewQuerySteps(text, depth);
    if (revealTimer.current) clearInterval(revealTimer.current);

    if (preview.abstained) {
      setPanel({ kind: "idle" });
    } else if (preview.agents.includes("prahari")) {
      const steps = preview.prahariSteps;
      let revealed = 0;
      setPanel({ kind: "prahari", steps, revealed: 0, done: false });
      revealTimer.current = setInterval(() => {
        revealed += 1;
        setPanel((prev) =>
          prev.kind === "prahari"
            ? { ...prev, revealed, done: revealed >= steps.length }
            : prev
        );
        if (revealed >= steps.length && revealTimer.current) {
          clearInterval(revealTimer.current);
        }
      }, 350);
    } else {
      const steps = preview.assemblySteps;
      let revealed = 0;
      setPanel({ kind: "sahayak", steps, revealed: 0, done: false });
      revealTimer.current = setInterval(() => {
        revealed += 1;
        setPanel((prev) =>
          prev.kind === "sahayak"
            ? { ...prev, revealed, done: revealed >= steps.length }
            : prev
        );
        if (revealed >= steps.length && revealTimer.current) {
          clearInterval(revealTimer.current);
        }
      }, 350);
    }

    try {
      const response = await submitQuery(text, depth);
      setThread((prev) => [...prev, response]);
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = query;
    setQuery("");
    void runQuery(text, "quick");
  }

  return (
    <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
      <div className="order-2 lg:order-1 lg:sticky lg:top-8 lg:h-[calc(100vh-8rem)]">
        <LivePanel state={panel} />
      </div>

      <div className="order-1 flex flex-col gap-6 lg:order-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold">Ask</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sahayak and Prahari both answer here — the Orchestrator picks who engages and
              at what depth, Quick by default.
            </p>
          </div>
          {thread.length > 0 && <SessionReportDialog thread={thread} />}
        </div>

        {thread.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">Try one of these:</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void runQuery(s, "quick")}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-left text-sm hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {thread.map((response) => (
            <ResponseCard
              key={response.id}
              response={response}
              onEscalate={(depth) => void runQuery(response.query, depth)}
            />
          ))}
          {pending && (
            <p className="text-sm text-muted-foreground">Retrieving and verifying…</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-border pt-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about a formulation, a jurisdiction, or Prahari's watchlist…"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={pending || !query.trim()}>
              <Send className="size-4" /> Ask
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResponseCard({
  response,
  onEscalate,
}: {
  response: QueryResponse;
  onEscalate: (depth: QueryDepth) => void;
}) {
  if (response.abstained) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary/50 p-5">
        <p className="text-sm font-medium">{response.query}</p>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-primary">
              Sahayak is choosing not to guess
            </p>
            <p className="text-sm text-foreground">{response.answer}</p>
            <p className="text-xs text-muted-foreground">{response.abstainReason}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-5">
      <p className="text-sm font-medium">{response.query}</p>
      <AgentBanner agents={response.agents} reason={response.agentReason} />
      <p className="text-sm">{response.answer}</p>
      {response.citations.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {response.citations.map((c) => (
            <Citation key={c.label}>{c.label}</Citation>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="font-mono">Corpus {response.corpusVersion}</span>
      </div>
      {response.escalations.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">
          {response.escalations.map((e) => (
            <Button key={e.label} size="sm" variant="outline" onClick={() => onEscalate(e.depth)}>
              {e.label}
            </Button>
          ))}
        </div>
      )}
      <EvalReveal
        evalScore={response.evalScore}
        confidence={response.confidence}
        method={response.evalMethod}
      />
    </div>
  );
}
