import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { getDossiers, getPrahariAlerts } from "@/lib/api";
import { ipVerdictsByDossier } from "@/lib/mock/dossiers";
import { Button } from "@/components/ui/button";
import { classificationLabels, statusLabels } from "@/lib/labels";
import { RingStat } from "@/components/ring-stat";
import { MortarPestleIcon } from "@/components/mortar-pestle-icon";

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

// Counts how many of the 7 IP regimes are still "open" (pursuable) for a
// given dossier. Mirrors the same rule the old dossier table used, so the
// numbers don't drift between the two views.
function openCount(dossierId: string) {
  const verdicts = ipVerdictsByDossier[dossierId] ?? [];
  return verdicts.filter((v) => v.verdict === "open").length;
}

export default async function DashboardPage() {
  const [dossiers, alerts] = await Promise.all([getDossiers(), getPrahariAlerts()]);
  const urgent = alerts.filter((a) => a.daysRemaining <= 45).slice(0, 4);

  // Portfolio-wide stats for the ring row below - all derived from the real
  // mock data at request time, never hardcoded, so they can't drift out of
  // sync with the dossier/alert lists rendered further down the page.
  const avgOpenPct =
    dossiers.reduce((sum, d) => sum + openCount(d.id) / 7, 0) / dossiers.length;
  const mappedCount = dossiers.filter((d) => d.status === "mapped").length;

  return (
    // `relative` + the parent `<main>` (see app-shell.tsx) is what lets the
    // background below bleed edge-to-edge safely - no negative margins here,
    // because a negative-margin bleed inside a flex layout can silently
    // widen the row past the viewport and shift everything visually off to
    // one side. `absolute inset-0` can't do that: it's always sized to fit
    // its positioned parent, never bigger.
    <div className="relative flex flex-col gap-12">
      {/* Two soft radial washes (ochre top-left, indigo top-right) over the
          cream ground - replaces the blurred forest photo backdrop. `fixed`
          so it's sized to the viewport, not this page's scroll height;
          `pointer-events-none` so it never eats clicks, `-z-10` so it stays
          behind real content. */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, #c99a3f22, transparent 70%)," +
            "radial-gradient(50% 45% at 85% 20%, #2f3f6318, transparent 70%)," +
            "var(--background)",
        }}
      />

      {/* Hero: the product name, centered, separate from the small sidebar
          wordmark - this is the one place it gets real visual weight. */}
      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          SAMHITĀ <span className="text-muted-foreground">संहिता</span>
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Every formulation&apos;s protection status, across all seven Indian IP regimes.
        </p>
      </div>

      {/* Portfolio snapshot: 3 radial rings replacing the old plain-text
          "4 of 7 open regimes" badge style. Each ring's number is computed
          above from real mock data, not a fixed/target number. */}
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

      {/* Formulation dossiers: card grid (was a table) so each one can carry
          a photo + its own open-regime ring. */}
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
                {/* Image block: real photo when we have one, otherwise the
                    mascot mark on a soft gradient - never a mismatched stock
                    photo just to fill the space. */}
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
                  {/* Per-dossier "X of 7" ring - replaces the old CountChip text badge */}
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

      {/* Prahari watchlist: same urgent-alert data as before, but the urgency
          is now a meter bar instead of just a number - closer days = fuller,
          redder bar. */}
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
            // 90 days is the rough "just filed" baseline for these mock
            // alerts - closer to 0 remaining days reads as more urgent.
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
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-border"
                  role="img"
                  aria-label={`Urgency: ${alert.daysRemaining} days remaining`}
                >
                  <div
                    className="h-full rounded-full bg-verdict-barred"
                    style={{ width: `${urgencyPct * 100}%` }}
                  />
                </div>
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
