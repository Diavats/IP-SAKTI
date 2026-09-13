"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDossierDetail, type DossierDetail } from "@/lib/api";
import { getLocalDossier, getNameOverrides } from "@/lib/mock/local-store";
import { VerdictBadge } from "@/components/verdict-badge";
import { EditableDossierName } from "@/components/editable-dossier-name";
import { Citation, DraftLabel } from "@/components/citation";
import { classificationLabels, obligationCategoryLabels } from "@/lib/labels";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const regimeOrder = [
  "patent",
  "trademark",
  "geographical_indication",
  "copyright",
  "design",
  "trade_secret",
  "plant_variety",
] as const;

export default function DossierDetailPage() {
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = React.useState<DossierDetail | null | undefined>(undefined);

  React.useEffect(() => {
    const overrides = getNameOverrides();
    getDossierDetail(params.id).then((seedDetail) => {
      if (seedDetail) {
        const name = overrides[params.id] ?? seedDetail.dossier.name;
        setDetail({ ...seedDetail, dossier: { ...seedDetail.dossier, name } });
        return;
      }
      const local = getLocalDossier(params.id);
      if (local) {
        setDetail({
          dossier: { ...local, name: overrides[params.id] ?? local.name },
          verdicts: [],
          obligations: [],
          examinerObjections: null,
          cultivator: null,
        });
        return;
      }
      setDetail(null);
    });
  }, [params.id]);

  if (detail === undefined) {
    return <p className="text-sm text-muted-foreground">Loading dossier…</p>;
  }

  if (detail === null) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          No dossier matches <span className="font-mono">{params.id}</span>.
        </p>
        <Link href="/dossiers" className="text-sm text-primary hover:underline">
          <ArrowLeft className="mr-1 inline size-3.5" /> Back to dossiers
        </Link>
      </div>
    );
  }

  const { dossier, verdicts, obligations, examinerObjections, cultivator } = detail;
  const patentVerdict = verdicts.find((v) => v.regime === "patent");
  const orderedVerdicts = regimeOrder
    .map((regime) => verdicts.find((v) => v.regime === regime))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/dossiers"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Dossiers
        </Link>
        <EditableDossierName
          id={dossier.id}
          name={dossier.name}
          onRenamed={(name) =>
            setDetail((prev) => (prev ? { ...prev, dossier: { ...prev.dossier, name } } : prev))
          }
        />
        <p className="font-mono text-xs text-muted-foreground">{dossier.id}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>{dossier.dravyaList.join(", ")}</span>
          <span>·</span>
          <span className="capitalize">{dossier.sourcing.replace("_", " ")}</span>
          <span>·</span>
          <span>{dossier.jurisdiction === "IN" ? "India" : "International"}</span>
        </div>
        {dossier.classicalTextRef && (
          <p className="mt-2">
            <Citation>{dossier.classicalTextRef}</Citation>
          </p>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">IP Protection Map</TabsTrigger>
          <TabsTrigger value="obligations">Obligations</TabsTrigger>
          <TabsTrigger value="examiner">Examiner View</TabsTrigger>
          <TabsTrigger value="cultivator">Cultivator View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4 pt-4">
          <dl className="glass grid grid-cols-1 gap-x-8 gap-y-4 rounded-2xl p-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Classification</dt>
              <dd className="mt-1 text-sm">
                {dossier.classification.confidence === 0
                  ? "Pending classification"
                  : classificationLabels[dossier.classification.category]}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Confidence</dt>
              <dd className="mt-1 text-sm">
                {dossier.classification.confidence === 0
                  ? "—"
                  : `${Math.round(dossier.classification.confidence * 100)}%`}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground">Citation</dt>
              <dd className="mt-1">
                <Citation>{dossier.classification.citation}</Citation>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Claimed indication</dt>
              <dd className="mt-1 text-sm">{dossier.claimedIndication}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Target market</dt>
              <dd className="mt-1 text-sm">{dossier.targetMarket.join(", ")}</dd>
            </div>
          </dl>
        </TabsContent>

        <TabsContent value="map" className="pt-4">
          {orderedVerdicts.length === 0 ? (
            <EmptyState text="The IP Protection Map generates once Sahayak classifies this dossier." />
          ) : (
            <div className="overflow-x-auto rounded-sm border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Regime</TableHead>
                    <TableHead>Verdict</TableHead>
                    <TableHead>Citation</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderedVerdicts.map((v) => (
                    <TableRow key={v.regime}>
                      <TableCell className="text-sm font-medium">{v.label}</TableCell>
                      <TableCell>
                        <VerdictBadge verdict={v.verdict} />
                      </TableCell>
                      <TableCell>
                        <Citation>{v.citation}</Citation>
                      </TableCell>
                      <TableCell className="max-w-80 whitespace-normal text-sm text-muted-foreground">
                        {v.note}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="obligations" className="pt-4">
          {obligations.length === 0 ? (
            <EmptyState text="Obligations generate from the regulatory-profile engine once this dossier is classified." />
          ) : (
            <ul className="flex flex-col gap-px overflow-hidden rounded-sm border border-border bg-border">
              {obligations.map((o) => (
                <li key={o.id} className="flex flex-col gap-1.5 bg-card px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{o.title}</span>
                    <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {obligationCategoryLabels[o.category]}
                    </span>
                    {o.status === "not_applicable" && (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        not applicable
                      </span>
                    )}
                    {o.status === "conditional" && (
                      <span className="font-mono text-[11px] text-verdict-draft">
                        conditional
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{o.description}</p>
                  <Citation>{o.citation}</Citation>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="examiner" className="pt-4">
          {patentVerdict?.verdict !== "maybe_open" ? (
            <EmptyState
              text={
                patentVerdict
                  ? `Examiner View only fires when the patent verdict is "may be open." For this dossier, patent is currently ${patentVerdict.verdict.replace("_", " ")}.`
                  : "Examiner View only fires once a patent verdict exists for this dossier."
              }
            />
          ) : (
            <div className="flex flex-col gap-4">
              <DraftLabel />
              <ul className="flex flex-col gap-px overflow-hidden rounded-sm border border-border bg-border">
                {examinerObjections?.map((obj) => (
                  <li key={obj.section} className="flex flex-col gap-1.5 bg-card px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-sm bg-verdict-barred-bg px-1.5 py-0.5 font-mono text-[11px] font-medium text-verdict-barred">
                        {obj.section}
                      </span>
                      <span className="text-sm font-medium">{obj.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{obj.argument}</p>
                    <Citation>{obj.citation}</Citation>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cultivator" className="pt-4">
          {!cultivator ? (
            <EmptyState text="Cultivator View applies to wild-collected dravya with a claimed growing region — e.g. 'I grow X in district Y.' This dossier has no cultivator assessment." />
          ) : (
            <dl className="grid grid-cols-1 gap-x-8 gap-y-4 rounded-sm border border-border p-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Species</dt>
                <dd className="mt-1 text-sm">{cultivator.species}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">District</dt>
                <dd className="mt-1 text-sm">{cultivator.district}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">GI eligibility</dt>
                <dd className="mt-1">
                  <VerdictBadge verdict={cultivator.giEligible ? "open" : "barred"} />
                  <span className="ml-2 text-sm text-muted-foreground">{cultivator.giNote}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">ABS posture</dt>
                <dd className="mt-1 text-sm">{cultivator.absPosture}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">PPV&amp;FR route</dt>
                <dd className="mt-1 text-sm">{cultivator.ppvfrRoute}</dd>
              </div>
            </dl>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-sm border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
