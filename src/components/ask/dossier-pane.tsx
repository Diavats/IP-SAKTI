"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { getDossierDetail, type DossierDetail } from "@/lib/api";
import { classificationLabels } from "@/lib/labels";
import { VerdictBadge } from "@/components/verdict-badge";
import { MockLabel } from "@/components/citation";

export interface DossierFact {
  label: string;
  value: string;
}

function FactsList({
  facts,
  title = "Facts from this session",
}: {
  facts: DossierFact[];
  title?: string;
}) {
  if (facts.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {facts.map((f) => (
          <li key={f.label} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-3.5 shrink-0 text-agent-sahayak" strokeWidth={2} />
            <div className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">{f.label}</span>
              <span className="break-words text-foreground">{f.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The Dossier tab is the live counterpart to SourcePane: instead of a fixed
// citation, it shows whichever formulation the conversation is building up -
// the scoped dossier's on-file status if entered from a card, plus whatever
// facts Sahayak/Prahari have assembled so far this session either way.
export function DossierPane({
  dossierId,
  facts,
}: {
  dossierId: string | null;
  facts: DossierFact[];
}) {
  // Cache-by-id instead of a reset-then-fetch effect: "not fetched yet" and
  // "no dossier scoped" both fall out of the lookup below, with no
  // synchronous setState needed in the effect body.
  const [detailCache, setDetailCache] = React.useState<Record<string, DossierDetail | null>>({});

  React.useEffect(() => {
    if (!dossierId || dossierId in detailCache) return;
    let active = true;
    getDossierDetail(dossierId).then((d) => {
      if (active) setDetailCache((prev) => ({ ...prev, [dossierId]: d }));
    });
    return () => {
      active = false;
    };
  }, [dossierId, detailCache]);

  const detail = dossierId && dossierId in detailCache ? detailCache[dossierId] : undefined;

  if (!dossierId) {
    return (
      <div className="glass flex h-full flex-col gap-4 rounded-2xl p-5">
        {facts.length === 0 ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Formulation Dossier
            </p>
            <p className="text-sm text-muted-foreground">
              No dossier scoped yet. Open a dossier card, or ask about a specific formulation,
              to build one here.
            </p>
          </div>
        ) : (
          <FactsList facts={facts} />
        )}
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="glass flex h-full min-h-[220px] items-center justify-center rounded-2xl p-5">
        <p className="text-sm text-muted-foreground">Loading dossier…</p>
      </div>
    );
  }

  return (
    <div className="glass flex h-full flex-col gap-4 overflow-y-auto rounded-2xl p-5">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{detail.dossier.name}</p>
        <p className="text-xs text-muted-foreground">
          {classificationLabels[detail.dossier.classification.category]}
        </p>
      </header>

      {detail.verdicts.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            IP regime verdicts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {detail.verdicts.map((v) => (
              <VerdictBadge key={v.regime} verdict={v.verdict} />
            ))}
          </div>
        </div>
      )}

      <FactsList facts={facts} />
      <MockLabel>Mock dossier data</MockLabel>
    </div>
  );
}
