"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Mic,
  Paperclip,
  Send,
  ShieldCheck,
} from "lucide-react";
import { getDossiers, getPrahariAlerts, previewQuerySteps, submitQuery } from "@/lib/api";
import { ipVerdictsByDossier } from "@/lib/mock/dossiers";
import { classificationLabels, statusLabels } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Citation } from "@/components/citation";
import { AgentBanner } from "@/components/ask/agent-banner";
import { DepthIndicator } from "@/components/ask/depth-indicator";
import { EvalReveal } from "@/components/ask/eval-reveal";
import { LivePanel, type LivePanelState } from "@/components/ask/live-panel";
import { SourcePane } from "@/components/ask/source-pane";
import { VerificationLine } from "@/components/ask/verification-line";
import { GraphBackdrop } from "@/components/graph-backdrop";
import { RingStat } from "@/components/ring-stat";
import { MortarPestleIcon } from "@/components/mortar-pestle-icon";
import { cn } from "@/lib/utils";
import type {
  FormulationDossier,
  PrahariAlert,
  QueryCitation,
  QueryDepth,
  QueryResponse,
} from "@/lib/types";

const suggestions = [
  "Can I patent my polyherbal formulation containing Ashwagandha, Guduchi and Turmeric?",
  "What is Prahari currently watching?",
  "Is a geographical indication open for wild-collected guggul from Rajasthan?",
  "Can I sell this formulation in Nepal?",
];

// Real (non-fabricated) stock photography stand-in for herb/ingredient
// imagery. Only dossiers with a matching photo get one - the rest fall back
// to the mark rather than showing a mismatched picture.
const dossierImages: Record<string, string> = {
  "dos-001": "/images/formulation-ashwagandha.jpg",
  "dos-002": "/images/formulation-brahmi.jpg",
  "dos-003": "/images/formulation-turmeric.jpg",
  "dos-004": "/images/formulation-guggul.jpg",
  "dos-005": "/images/formulation-amla.jpg",
};

function openCount(dossierId: string) {
  const verdicts = ipVerdictsByDossier[dossierId] ?? [];
  return verdicts.filter((v) => v.verdict === "open").length;
}

// Three stronger radial pools (was 9-13% alpha, read as flat tan) plus a
// faint knowledge-graph echo behind the glass panels - decorative only,
// re-verified at 4.5:1 for every text token over the strongest gradient area.
function PageBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        aria-hidden
        style={{
          background:
            "radial-gradient(70% 55% at 12% -5%, #c99a3f55, transparent 65%)," +
            "radial-gradient(55% 50% at 88% 15%, #2f3f6340, transparent 65%)," +
            "radial-gradient(60% 60% at 50% 105%, #3f7d5230, transparent 70%)," +
            "var(--background)",
        }}
      />
      <GraphBackdrop />
    </>
  );
}

// No end-of-session evaluation report here (Stage 2 had one): answer
// accuracy can't be measured on a five-question session with no ground
// truth to score against. Per-answer verification (VerificationLine,
// EvalReveal) still runs on every response - system-level measurement lives
// only on /evals, against the gold set.
export default function AskPage() {
  const [query, setQuery] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [thread, setThread] = React.useState<QueryResponse[]>([]);
  const [panel, setPanel] = React.useState<LivePanelState>({ kind: "idle" });
  const [selectedCitation, setSelectedCitation] = React.useState<QueryCitation | null>(null);
  const [escalated, setEscalated] = React.useState<Set<string>>(new Set());
  const revealTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const [dossiers, setDossiers] = React.useState<FormulationDossier[] | null>(null);
  const [alerts, setAlerts] = React.useState<PrahariAlert[] | null>(null);

  React.useEffect(() => {
    getDossiers().then(setDossiers);
    getPrahariAlerts().then(setAlerts);
    return () => {
      if (revealTimer.current) clearInterval(revealTimer.current);
    };
  }, []);

  const hasConversation = pending || thread.length > 0;

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

  function handleEscalate(responseId: string) {
    setEscalated((prev) => new Set(prev).add(responseId));
  }

  return (
    <div className="relative flex flex-1 flex-col gap-8">
      <PageBackdrop />

      {!hasConversation && (
        <EmptyStateOverview dossiers={dossiers} alerts={alerts} />
      )}

      <div
        className={cn(
          "mx-auto flex w-full flex-1 flex-col gap-6",
          hasConversation
            ? "max-w-[1180px] lg:flex-row lg:items-start lg:justify-center"
            : "max-w-3xl"
        )}
      >
        <div className={cn("flex min-w-0 flex-col gap-6", hasConversation && "lg:max-w-[760px]")}>
          {!hasConversation && (
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold">Ask Sahayak or Prahari</h2>
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
                  onOpenCitation={setSelectedCitation}
                />
              ))}
              {pending && (
                <p className="text-sm text-muted-foreground">Retrieving and verifying…</p>
              )}
            </div>
          )}

          <Composer
            query={query}
            setQuery={setQuery}
            onSubmit={handleSubmit}
            pending={pending}
          />
        </div>

        {hasConversation && (
          <div className="flex w-full flex-col gap-4 lg:sticky lg:top-8 lg:w-[380px] lg:shrink-0">
            {pending && <LivePanel state={panel} />}
            <SourcePane citation={selectedCitation} onClose={() => setSelectedCitation(null)} />
          </div>
        )}
      </div>
    </div>
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
  // A stable key + mount-only animation means this never replays for
  // earlier cards when the thread re-renders for a new message.
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

function UrgencyBar({ pct }: { pct: number }) {
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(pct * 100));
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-border"
      role="img"
      aria-label={`Urgency: ${Math.round(pct * 100)}%`}
    >
      <div
        className="h-full rounded-full bg-verdict-barred transition-[width] duration-700 ease-out motion-reduce:transition-none"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// The old Overview dashboard - now the empty state shown before the first
// message in a session, collapsing away as soon as one is sent.
function EmptyStateOverview({
  dossiers,
  alerts,
}: {
  dossiers: FormulationDossier[] | null;
  alerts: PrahariAlert[] | null;
}) {
  if (!dossiers || !alerts) {
    return <p className="text-sm text-muted-foreground">Loading portfolio…</p>;
  }

  const urgent = alerts.filter((a) => a.daysRemaining <= 45).slice(0, 4);
  const avgOpenPct =
    dossiers.reduce((sum, d) => sum + openCount(d.id) / 7, 0) / (dossiers.length || 1);
  const mappedCount = dossiers.filter((d) => d.status === "mapped").length;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          SAMHITĀ <span className="text-muted-foreground">संहिता</span>
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Every formulation&apos;s protection status, across all seven Indian IP regimes.
        </p>
      </div>

      <section className="glass mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl px-6 py-7 sm:px-10">
        <h2 className="text-sm font-medium text-muted-foreground">Portfolio snapshot</h2>
        <div className="flex flex-wrap items-start justify-center gap-10 sm:justify-between">
          <RingStat
            pct={avgOpenPct}
            value={`${Math.round(avgOpenPct * 100)}%`}
            label="Avg. regimes still open across portfolio"
            color="var(--agent-prahari)"
            size={104}
          />
          <RingStat
            pct={dossiers.length ? mappedCount / dossiers.length : 0}
            value={`${mappedCount}/${dossiers.length}`}
            label="Dossiers with IP map generated"
            color="var(--primary)"
            size={104}
          />
          <RingStat
            pct={alerts.length ? urgent.length / alerts.length : 0}
            value={String(urgent.length)}
            label="Opposition windows closing soon"
            color="var(--verdict-barred)"
            size={104}
          />
        </div>
      </section>

      <section aria-labelledby="dossiers-heading" className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="dossiers-heading" className="font-heading text-lg font-semibold text-foreground">
            Formulation dossiers
          </h2>
          <Button asChild size="sm" variant="outline">
            <Link href="/dossiers">
              All dossiers <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dossiers.map((dossier) => {
            const open = openCount(dossier.id);
            const img = dossierImages[dossier.id];
            return (
              <Link
                key={dossier.id}
                href={`/dossiers/${dossier.id}`}
                className="glass group flex flex-col overflow-hidden rounded-2xl transition-transform hover:-translate-y-0.5"
              >
                <div className="relative h-32 w-full shrink-0 overflow-hidden bg-gradient-to-br from-agent-prahari-bg to-secondary">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={`${dossier.dravyaList.join(", ")} — ${dossier.name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <MortarPestleIcon className="size-10 opacity-60" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 items-start justify-between gap-3 px-4 py-4">
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <p className="line-clamp-2 text-sm font-medium text-foreground">
                      {dossier.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {classificationLabels[dossier.classification.category]}
                    </p>
                    <span className="mt-1 w-fit rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                      {statusLabels[dossier.status]}
                    </span>
                  </div>
                  <RingStat
                    pct={open / 7}
                    value={`${open}/7`}
                    label="Open regimes"
                    color="var(--verdict-barred)"
                    size={56}
                    thickness={5}
                    className="shrink-0"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="watchlist-heading" className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="watchlist-heading" className="font-heading text-lg font-semibold text-foreground">
            Closing opposition windows
          </h2>
          <Link
            href="/prahari"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View watchtower <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-4">
          {urgent.map((alert) => {
            const urgencyPct = Math.max(0.08, 1 - alert.daysRemaining / 90);
            return (
              <Link
                key={alert.id}
                href={`/prahari/${alert.id}`}
                className="glass flex min-w-64 flex-1 flex-col gap-2.5 rounded-2xl px-4 py-4 transition-colors hover:bg-white/70"
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle
                    className="size-3.5 text-verdict-barred"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {alert.applicationNo}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm">{alert.title}</p>
                <UrgencyBar pct={urgencyPct} />
                <p className="font-mono text-xs font-medium text-verdict-barred">
                  {alert.daysRemaining} days to earliest grant
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
