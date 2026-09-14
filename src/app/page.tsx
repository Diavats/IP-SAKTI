"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowRight, MessageSquareText } from "lucide-react";
import { getDossiers, getPrahariAlerts } from "@/lib/api";
import { ipVerdictsByDossier } from "@/lib/mock/dossiers";
import { classificationLabels, statusLabels } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { ChatPanel, type ChatMode } from "@/components/ask/chat-panel";
import { GraphBackdrop } from "@/components/graph-backdrop";
import { RingStat } from "@/components/ring-stat";
import { MortarPestleIcon } from "@/components/mortar-pestle-icon";
import { cn } from "@/lib/utils";
import type { FormulationDossier, PrahariAlert } from "@/lib/types";

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

function HomeRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dossierParam = searchParams.get("d");
  const chatParam = searchParams.get("chat");
  const isOpen = Boolean(dossierParam) || chatParam === "1";
  const mode: ChatMode = dossierParam ? "dossier" : "general";

  // Tracks whether *this session* pushed the entry that's currently open, so
  // dismiss can pop it with router.back() (matching the browser back button)
  // instead of leaving the app when someone lands on a shared ?chat=1 link
  // with no prior "/" entry to go back to.
  const openedByUsRef = React.useRef(false);

  const [dossiers, setDossiers] = React.useState<FormulationDossier[] | null>(null);
  const [alerts, setAlerts] = React.useState<PrahariAlert[] | null>(null);

  React.useEffect(() => {
    getDossiers().then(setDossiers);
    getPrahariAlerts().then(setAlerts);
  }, []);

  function openGeneral() {
    openedByUsRef.current = true;
    router.push("/?chat=1", { scroll: false });
  }

  function openDossier(id: string) {
    openedByUsRef.current = true;
    router.push(`/?d=${id}`, { scroll: false });
  }

  function closePanel() {
    if (openedByUsRef.current) {
      openedByUsRef.current = false;
      router.back();
    } else {
      router.push("/", { scroll: false });
    }
  }

  return (
    <div className="relative flex flex-1 flex-col gap-8">
      <PageBackdrop />

      <div
        aria-hidden={isOpen || undefined}
        inert={isOpen}
        className={cn(
          "transition-opacity duration-300 ease-out",
          isOpen && "pointer-events-none opacity-40"
        )}
      >
        <Dashboard
          dossiers={dossiers}
          alerts={alerts}
          onAskGeneral={openGeneral}
          onAskDossier={openDossier}
        />
      </div>

      <ChatPanel open={isOpen} mode={mode} dossierId={dossierParam} onClose={closePanel} />
    </div>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={null}>
      <HomeRoute />
    </React.Suspense>
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

// The portfolio dashboard - always mounted behind the chat panel, dimmed and
// inert while it's open. Every entry point (the hero button, every dossier
// card) opens the same panel, just scoped differently.
function Dashboard({
  dossiers,
  alerts,
  onAskGeneral,
  onAskDossier,
}: {
  dossiers: FormulationDossier[] | null;
  alerts: PrahariAlert[] | null;
  onAskGeneral: () => void;
  onAskDossier: (id: string) => void;
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
      <div className="flex flex-col items-center gap-4 pt-2 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          SAMHITĀ <span className="text-muted-foreground">संहिता</span>
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Every formulation&apos;s protection status, across all seven Indian IP regimes.
        </p>
        <Button size="lg" onClick={onAskGeneral} className="mt-2">
          <MessageSquareText className="size-4" /> Ask Sahayak
        </Button>
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
              <button
                key={dossier.id}
                type="button"
                onClick={() => onAskDossier(dossier.id)}
                className="group glass relative flex flex-col overflow-hidden rounded-2xl text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    Ask about this <ArrowRight className="size-3" />
                  </span>
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
              </button>
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
