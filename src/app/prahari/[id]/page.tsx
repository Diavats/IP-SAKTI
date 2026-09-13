"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileCheck2, Sparkles } from "lucide-react";
import {
  generateForm7ADossier,
  getForm7ADossier,
  getPrahariAlert,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Citation, MockLabel } from "@/components/citation";
import type { AlertStatus, Form7ADossier, PrahariAlert } from "@/lib/types";

const statusLabel: Record<AlertStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  drafted: "Dossier drafted",
  filed: "Filed",
};

export default function PrahariAlertPage() {
  const params = useParams<{ id: string }>();
  const [alert, setAlert] = React.useState<PrahariAlert | null | undefined>(undefined);
  const [dossier, setDossier] = React.useState<Form7ADossier | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [reviewed, setReviewed] = React.useState(false);

  React.useEffect(() => {
    getPrahariAlert(params.id).then(async (a) => {
      setAlert(a);
      if (a) {
        const existing = await getForm7ADossier(a.id);
        setDossier(existing);
        setReviewed(a.status === "filed");
      }
    });
  }, [params.id]);

  async function handleGenerate() {
    if (!alert) return;
    setGenerating(true);
    try {
      const draft = await generateForm7ADossier(alert);
      setDossier(draft);
    } finally {
      setGenerating(false);
    }
  }

  function handleMarkReviewed() {
    setReviewed(true);
  }

  if (alert === undefined) {
    return <p className="text-sm text-muted-foreground">Loading alert…</p>;
  }

  if (alert === null) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          No alert matches <span className="font-mono">{params.id}</span>.
        </p>
        <Link href="/prahari" className="text-sm text-primary hover:underline">
          <ArrowLeft className="mr-1 inline size-3.5" /> Back to Prahari
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/prahari"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Prahari
        </Link>
        <h1 className="font-heading text-2xl font-semibold">{alert.title}</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {alert.applicationNo} · IPC {alert.ipc}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-sm border border-border p-5 sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">Applicant</dt>
          <dd className="mt-1 text-sm">{alert.applicant}</dd>
          <dd className="text-xs text-muted-foreground">{alert.applicantCountry}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Published</dt>
          <dd className="mt-1 font-mono text-sm">{alert.publishedOn}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Earliest possible grant</dt>
          <dd className="mt-1 font-mono text-sm">{alert.earliestGrant}</dd>
          <dd className="text-xs font-medium text-verdict-barred">
            {alert.daysRemaining} days remaining
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Status</dt>
          <dd className="mt-1 text-sm">{statusLabel[reviewed ? "filed" : alert.status]}</dd>
        </div>
      </dl>

      <div className="rounded-sm border border-border p-5">
        <p className="text-sm text-muted-foreground">
          Matched species: {alert.matchedSpecies.join(", ")} · risk score {alert.riskScore}/100 ·
          urgency score {alert.urgencyScore}/100 (urgency × risk ranking, not risk alone)
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Form 7A prior-art dossier
          </h2>
          <MockLabel>Generated client-side for this demo</MockLabel>
        </div>

        {!dossier ? (
          <div className="flex flex-col items-start gap-3 rounded-sm border border-dashed border-border px-5 py-8">
            <p className="text-sm text-muted-foreground">
              No dossier drafted yet for this application.
            </p>
            <Button size="sm" onClick={handleGenerate} disabled={generating}>
              <Sparkles className="size-4" />
              {generating ? "Drafting…" : "Draft Form 7A representation"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-sm border border-border p-5">
            <p className="text-sm">{dossier.summary}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {dossier.citations.map((c) => (
                <Citation key={c}>{c}</Citation>
              ))}
            </div>
            <pre className="whitespace-pre-wrap rounded-sm bg-muted p-4 font-mono text-xs leading-relaxed text-foreground">
              {dossier.draftText}
            </pre>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Drafted {dossier.generatedOn} — mandatory human review before anything is filed.
              </p>
              {reviewed ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-verdict-open">
                  <FileCheck2 className="size-4" /> Reviewed and filed
                </span>
              ) : (
                <Button size="sm" variant="outline" onClick={handleMarkReviewed}>
                  <FileCheck2 className="size-4" /> Mark reviewed &amp; filed
                </Button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
