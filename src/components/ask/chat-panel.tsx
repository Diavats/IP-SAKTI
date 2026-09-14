"use client";

import * as React from "react";
import { Dialog as PanelPrimitive } from "radix-ui";
import { Mic, Paperclip, Send, ShieldCheck, X } from "lucide-react";
import { getDossier, previewQuerySteps, submitQuery } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Citation } from "@/components/citation";
import { AgentBanner } from "@/components/ask/agent-banner";
import { DepthIndicator } from "@/components/ask/depth-indicator";
import { EvalReveal } from "@/components/ask/eval-reveal";
import { LivePanel, type LivePanelState } from "@/components/ask/live-panel";
import { VerificationLine } from "@/components/ask/verification-line";
import { RightPane, type RightTab } from "@/components/ask/right-pane";
import type { DossierFact } from "@/components/ask/dossier-pane";
import { cn } from "@/lib/utils";
import type { QueryCitation, QueryDepth, QueryResponse } from "@/lib/types";

export type ChatMode = "general" | "dossier";

const suggestions = [
  "Can I patent my polyherbal formulation containing Ashwagandha, Guduchi and Turmeric?",
  "What is Prahari currently watching?",
  "Is a geographical indication open for wild-collected guggul from Rajasthan?",
  "Can I sell this formulation in Nepal?",
];

// Every response that carries dossier-building facts (Sahayak's
// assemblySteps, or Prahari's source-by-source sweep) folds into one running
// list, keyed by label so a later answer can update an earlier fact rather
// than duplicate it - this is the "Dossier tab updates live" mechanism.
function collectFacts(thread: QueryResponse[]): DossierFact[] {
  const map = new Map<string, string>();
  for (const r of thread) {
    for (const step of r.assemblySteps) map.set(step.label, step.value);
    for (const step of r.prahariSteps ?? []) map.set(`Prahari — ${step}`, "Checked");
  }
  return Array.from(map, ([label, value]) => ({ label, value }));
}

export function ChatPanel({
  open,
  mode,
  dossierId,
  onClose,
}: {
  open: boolean;
  mode: ChatMode;
  dossierId: string | null;
  onClose: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [thread, setThread] = React.useState<QueryResponse[]>([]);
  const [livePanel, setLivePanel] = React.useState<LivePanelState>({ kind: "idle" });
  const [selectedCitation, setSelectedCitation] = React.useState<QueryCitation | null>(null);
  const [escalated, setEscalated] = React.useState<Set<string>>(new Set());
  const [rightTab, setRightTab] = React.useState<RightTab>(mode === "dossier" ? "dossier" : "sources");
  const [mobileView, setMobileView] = React.useState<"conversation" | "pane">("conversation");
  const [dossierNames, setDossierNames] = React.useState<Record<string, string | null>>({});
  const revealTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const wasOpenRef = React.useRef(open);

  // Radix keeps this component mounted across close/reopen (only its
  // internal Content presence toggles for the exit animation), so without
  // this the panel would resurface a stale thread from a previous dossier.
  // Reset only on the closed -> open edge - not on close, or the thread
  // would visibly empty out mid-exit-animation.
  React.useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;
    if (open && !wasOpen) {
      setQuery("");
      setPending(false);
      setThread([]);
      setLivePanel({ kind: "idle" });
      setSelectedCitation(null);
      setEscalated(new Set());
      setRightTab(mode === "dossier" ? "dossier" : "sources");
      setMobileView("conversation");
      if (revealTimer.current) {
        clearInterval(revealTimer.current);
        revealTimer.current = null;
      }
    }
  }, [open, mode]);

  // Cache-by-id instead of a plain reset effect: the "clear to null when
  // dossierId is absent" case then falls out of the lookup below rather than
  // needing its own synchronous setState in the effect body.
  React.useEffect(() => {
    if (!dossierId || dossierId in dossierNames) return;
    let active = true;
    getDossier(dossierId).then((d) => {
      if (active) setDossierNames((prev) => ({ ...prev, [dossierId]: d?.name ?? null }));
    });
    return () => {
      active = false;
    };
  }, [dossierId, dossierNames]);
  const dossierName = dossierId ? (dossierNames[dossierId] ?? null) : null;

  React.useEffect(() => {
    return () => {
      if (revealTimer.current) clearInterval(revealTimer.current);
    };
  }, []);

  const facts = React.useMemo(() => collectFacts(thread), [thread]);

  // "Adjusting state when a prop changes" (react.dev) instead of an effect:
  // reading a ref during render isn't allowed, and writing one from an
  // effect can't drive this render's own dossierHasUpdate value in time.
  const [prevRightTab, setPrevRightTab] = React.useState(rightTab);
  const [seenFactsCount, setSeenFactsCount] = React.useState(0);
  if (rightTab !== prevRightTab) {
    setPrevRightTab(rightTab);
    if (rightTab === "dossier") setSeenFactsCount(facts.length);
  }
  const dossierHasUpdate = rightTab !== "dossier" && facts.length > seenFactsCount;

  function focusSources() {
    setRightTab("sources");
    setMobileView("pane");
  }

  async function runQuery(text: string, depth: QueryDepth) {
    if (!text.trim()) return;
    setPending(true);

    const preview = previewQuerySteps(text, depth);
    if (revealTimer.current) clearInterval(revealTimer.current);

    if (preview.abstained) {
      setLivePanel({ kind: "idle" });
    } else if (preview.agents.includes("prahari")) {
      const steps = preview.prahariSteps;
      let revealed = 0;
      setLivePanel({ kind: "prahari", steps, revealed: 0, done: false });
      revealTimer.current = setInterval(() => {
        revealed += 1;
        setLivePanel((prev) =>
          prev.kind === "prahari" ? { ...prev, revealed, done: revealed >= steps.length } : prev
        );
        if (revealed >= steps.length && revealTimer.current) {
          clearInterval(revealTimer.current);
        }
      }, 350);
    } else {
      const steps = preview.assemblySteps;
      let revealed = 0;
      setLivePanel({ kind: "sahayak", steps, revealed: 0, done: false });
      revealTimer.current = setInterval(() => {
        revealed += 1;
        setLivePanel((prev) =>
          prev.kind === "sahayak" ? { ...prev, revealed, done: revealed >= steps.length } : prev
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

  function handleEscalate(responseId: string) {
    setEscalated((prev) => new Set(prev).add(responseId));
  }

  function handleOpenCitation(c: QueryCitation) {
    setSelectedCitation(c);
    focusSources();
  }

  const hasConversation = pending || thread.length > 0;
  const title = mode === "dossier" && dossierName ? dossierName : "Ask Sahayak";

  return (
    <PanelPrimitive.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <PanelPrimitive.Portal>
        <PanelPrimitive.Overlay className="fixed inset-0 z-40 bg-transparent" />
        <PanelPrimitive.Content className="chat-panel-content fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-background shadow-2xl outline-none sm:max-w-[1200px]">
          <PanelPrimitive.Title className="sr-only">{title}</PanelPrimitive.Title>
          <PanelPrimitive.Description className="sr-only">
            Conversation with Sahayak and Prahari, with sources and dossier facts alongside.
          </PanelPrimitive.Description>

          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div className="flex min-w-0 flex-col">
              <p className="truncate font-heading text-sm font-semibold text-foreground">{title}</p>
              {mode === "dossier" && (
                <p className="text-xs text-muted-foreground">Scoped to this dossier</p>
              )}
            </div>
            <PanelPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close chat">
                <X className="size-4" />
              </Button>
            </PanelPrimitive.Close>
          </header>

          <div className="border-b border-border px-4 py-2 sm:hidden">
            <Tabs
              value={mobileView === "conversation" ? "conversation" : rightTab}
              onValueChange={(v) => {
                if (v === "conversation") setMobileView("conversation");
                else {
                  setRightTab(v as RightTab);
                  setMobileView("pane");
                }
              }}
            >
              <TabsList aria-label="Panel section" className="w-full">
                <TabsTrigger value="conversation" className="flex-1">
                  Conversation
                </TabsTrigger>
                <TabsTrigger value="sources" className="flex-1">
                  Sources
                </TabsTrigger>
                <TabsTrigger value="dossier" className="relative flex-1">
                  Dossier
                  {dossierHasUpdate && (
                    <span
                      aria-hidden
                      className="absolute right-2 top-1.5 size-1.5 rounded-full bg-primary"
                    />
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto sm:max-w-[760px]",
                mobileView !== "conversation" && "hidden sm:flex"
              )}
            >
              {!hasConversation && (
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading text-xl font-semibold">
                    {mode === "dossier" && dossierName
                      ? `Ask about ${dossierName}`
                      : "Ask Sahayak or Prahari"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    The Orchestrator picks who engages and at what depth, Quick by default. Try
                    one of these:
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void runQuery(s, "quick")}
                        className="rounded-xl border border-border bg-card px-3 py-2.5 text-left text-sm break-words hover:bg-secondary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasConversation && (
                <div className="flex flex-col gap-4">
                  {thread.map((response, i) => (
                    <ResponseCard
                      key={response.id}
                      response={response}
                      index={i}
                      escalatedToHuman={escalated.has(response.id)}
                      onEscalate={(depth) => void runQuery(response.query, depth)}
                      onEscalateToHuman={() => handleEscalate(response.id)}
                      onOpenCitation={handleOpenCitation}
                    />
                  ))}
                  {pending && <LivePanel state={livePanel} />}
                  {pending && (
                    <p className="text-sm text-muted-foreground">Retrieving and verifying…</p>
                  )}
                </div>
              )}

              <Composer query={query} setQuery={setQuery} onSubmit={handleSubmit} pending={pending} />
            </div>

            <div
              className={cn(
                "min-h-0 w-full flex-col sm:flex sm:w-[380px] sm:shrink-0",
                mobileView === "conversation" ? "hidden sm:flex" : "flex"
              )}
            >
              <RightPane
                activeTab={rightTab}
                onTabChange={setRightTab}
                citation={selectedCitation}
                onCloseCitation={() => setSelectedCitation(null)}
                dossierId={dossierId}
                facts={facts}
                dossierHasUpdate={dossierHasUpdate}
              />
            </div>
          </div>
        </PanelPrimitive.Content>
      </PanelPrimitive.Portal>
    </PanelPrimitive.Root>
  );
}

function Composer({
  query,
  setQuery,
  onSubmit,
  pending,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  pending: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 border-t border-border pt-4">
      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about a formulation, a jurisdiction, or Prahari's watchlist…"
        rows={2}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
          }
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-disabled="true"
                aria-label="Voice input (not available in this build)"
                onClick={(e) => e.preventDefault()}
              >
                <Mic className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice input — not available in this build</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-disabled="true"
                aria-label="Attach a document (not available in this build)"
                onClick={(e) => e.preventDefault()}
              >
                <Paperclip className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach a document — not available in this build</TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-1 pl-1">
            {["PDF", "DOCX", "Image"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-dashed border-border px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={pending || !query.trim()}>
          <Send className="size-4" /> Ask
        </Button>
      </div>
    </form>
  );
}

function ResponseCard({
  response,
  index,
  escalatedToHuman,
  onEscalate,
  onEscalateToHuman,
  onOpenCitation,
}: {
  response: QueryResponse;
  index: number;
  escalatedToHuman: boolean;
  onEscalate: (depth: QueryDepth) => void;
  onEscalateToHuman: () => void;
  onOpenCitation: (c: QueryCitation) => void;
}) {
  const revealStyle = { animationDelay: `${Math.min(index, 4) * 40}ms` };

  if (response.abstained) {
    return (
      <div
        className="message-reveal flex flex-col gap-3 rounded-2xl border border-border bg-secondary/50 p-5"
        style={revealStyle}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{response.query}</p>
          <DepthIndicator depth={response.depth} />
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-verdict-draft/40 bg-verdict-draft-bg px-4 py-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-verdict-draft" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-verdict-draft">
              Data limited for this jurisdiction — human review recommended
            </p>
            <p className="text-xs text-muted-foreground">{response.abstainReason}</p>
          </div>
        </div>

        <p className="text-sm text-foreground">{response.answer}</p>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={escalatedToHuman}
            onClick={onEscalateToHuman}
          >
            {escalatedToHuman ? "Escalated to human review" : "Escalate to human review"}
          </Button>
        </div>

        <VerificationLine passed={false} />
      </div>
    );
  }

  return (
    <div className="message-reveal glass flex flex-col gap-3 rounded-2xl p-5" style={revealStyle}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{response.query}</p>
        <DepthIndicator depth={response.depth} />
      </div>
      <AgentBanner agents={response.agents} reason={response.agentReason} />
      <p className="text-sm">{response.answer}</p>
      {response.citations.length > 0 && (
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {response.citations.map((c) => (
            <Citation key={c.label} onClick={() => onOpenCitation(c)}>
              {c.label}
            </Citation>
          ))}
        </div>
      )}
      <VerificationLine passed />
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
