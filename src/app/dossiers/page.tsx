"use client";

import * as React from "react";
import Link from "next/link";
import { getDossiers } from "@/lib/api";
import { getLocalDossiers, getNameOverrides } from "@/lib/mock/local-store";
import { NewDossierDialog } from "@/components/new-dossier-dialog";
import { CountChip } from "@/components/count-chip";
import { ipVerdictsByDossier } from "@/lib/mock/dossiers";
import { classificationLabels, statusLabels } from "@/lib/labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FormulationDossier } from "@/lib/types";

function openCount(dossierId: string) {
  const verdicts = ipVerdictsByDossier[dossierId] ?? [];
  return verdicts.filter((v) => v.verdict === "open").length;
}

export default function DossiersPage() {
  const [dossiers, setDossiers] = React.useState<FormulationDossier[] | null>(null);

  React.useEffect(() => {
    const overrides = getNameOverrides();
    const applyOverride = (d: FormulationDossier) =>
      overrides[d.id] ? { ...d, name: overrides[d.id] } : d;
    getDossiers().then((seed) => {
      setDossiers([...getLocalDossiers(), ...seed].map(applyOverride));
    });
  }, []);

  function handleCreated(dossier: FormulationDossier) {
    setDossiers((prev) => [dossier, ...(prev ?? [])]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Dossiers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every formulation registered with Sahayak. Registering one also silently adds
            its species to Prahari&apos;s watchlist.
          </p>
        </div>
        <NewDossierDialog onCreated={handleCreated} />
      </div>

      <div className="overflow-x-auto rounded-sm border border-border">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>Dossier</TableHead>
              <TableHead>Dravya</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Open regimes</TableHead>
              <TableHead>Jurisdiction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dossiers === null ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  Loading dossiers…
                </TableCell>
              </TableRow>
            ) : dossiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No dossiers yet — create one to see Sahayak&apos;s classification and IP map.
                </TableCell>
              </TableRow>
            ) : (
              dossiers.map((dossier) => (
                <TableRow key={dossier.id}>
                  <TableCell className="max-w-64 whitespace-normal">
                    <Link href={`/dossiers/${dossier.id}`} className="hover:underline">
                      {dossier.name}
                    </Link>
                    <p className="font-mono text-xs text-muted-foreground">{dossier.id}</p>
                  </TableCell>
                  <TableCell className="max-w-56 truncate text-sm text-muted-foreground">
                    {dossier.dravyaList.join(", ")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {dossier.classification.confidence === 0
                      ? "Pending"
                      : classificationLabels[dossier.classification.category]}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {statusLabels[dossier.status]}
                  </TableCell>
                  <TableCell>
                    {ipVerdictsByDossier[dossier.id] ? (
                      <CountChip tone="open">{openCount(dossier.id)} of 7</CountChip>
                    ) : (
                      <CountChip tone="neutral">Not yet mapped</CountChip>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {dossier.jurisdiction === "IN" ? "India" : "International"}
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
