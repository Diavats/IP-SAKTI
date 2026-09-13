"use client";

import * as React from "react";
import Link from "next/link";
import { Radar } from "lucide-react";
import { getPrahariAlerts } from "@/lib/api";
import { CountChip } from "@/components/count-chip";
import { Button } from "@/components/ui/button";
import { LivePanel, type LivePanelState } from "@/components/ask/live-panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AlertStatus, PrahariAlert } from "@/lib/types";

const statusLabel: Record<AlertStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  drafted: "Dossier drafted",
  filed: "Filed",
};

function urgencyTone(days: number): "barred" | "draft" | "open" {
  if (days <= 14) return "barred";
  if (days <= 45) return "draft";
  return "open";
}

const sweepSources = [
  "Patent Office Journal (weekly PDF)",
  "Google Patents BigQuery — CPC A61K36/*",
  "POWO / IPNI / GBIF species resolution",
  "NLI claim-vs-prior-art matching",
  "Opposition-window computation",
];

export default function PrahariPage() {
  const [alerts, setAlerts] = React.useState<PrahariAlert[] | null>(null);
  const [sweep, setSweep] = React.useState<LivePanelState>({ kind: "idle" });
  const [sweepDone, setSweepDone] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    getPrahariAlerts().then(setAlerts);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function runSweep() {
    setSweepDone(false);
    let revealed = 0;
    setSweep({ kind: "prahari", steps: sweepSources, revealed: 0, done: false });
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      revealed += 1;
      const done = revealed >= sweepSources.length;
      setSweep({ kind: "prahari", steps: sweepSources, revealed, done });
      if (done) {
        clearInterval(timer.current!);
        setSweepDone(true);
      }
    }, 450);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Prahari</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            A standing watchlist over published foreign filings claiming Indian-origin
            dravya. Prahari acts on a Friday schedule, never inside a live query — nothing
            here is a named accusation, only prior art potentially relevant to examination.
          </p>
        </div>
        <Button size="sm" onClick={runSweep} disabled={sweep.kind === "prahari" && !sweepDone}>
          <Radar className="size-4" /> Run watchlist sweep
        </Button>
      </div>

      {sweep.kind === "prahari" && (
        <div className="max-w-md">
          <LivePanel state={sweep} />
          {sweepDone && (
            <p className="mt-2 text-xs text-muted-foreground">
              Sweep complete — 3 candidates matched above threshold this week.
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-sm border border-border">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>Application</TableHead>
              <TableHead>Matched species</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Days to earliest grant</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts === null ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  Loading watchlist…
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="max-w-72 whitespace-normal">
                    <Link href={`/prahari/${alert.id}`} className="hover:underline">
                      {alert.title}
                    </Link>
                    <p className="font-mono text-xs text-muted-foreground">
                      {alert.applicationNo} · {alert.applicant} ({alert.applicantCountry})
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alert.matchedSpecies.join(", ")}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {alert.publishedOn}
                  </TableCell>
                  <TableCell>
                    <CountChip tone={urgencyTone(alert.daysRemaining)}>
                      {alert.daysRemaining} days
                    </CountChip>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {statusLabel[alert.status]}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
