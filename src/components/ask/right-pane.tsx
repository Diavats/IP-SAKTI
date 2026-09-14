"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SourcePane } from "@/components/ask/source-pane";
import { DossierPane, type DossierFact } from "@/components/ask/dossier-pane";
import type { QueryCitation } from "@/lib/types";

export type RightTab = "sources" | "dossier";

// The single 380px pane a citation and a dossier now share, tabbed instead
// of stacked - only one reference surface open at a time. Its own tab list
// is desktop-only (`hidden sm:inline-flex`): on mobile the panel's segmented
// control (Conversation | Sources | Dossier) drives the same `activeTab`
// state instead, so this never shows two competing tab bars at once.
export function RightPane({
  activeTab,
  onTabChange,
  citation,
  onCloseCitation,
  dossierId,
  facts,
  dossierHasUpdate,
}: {
  activeTab: RightTab;
  onTabChange: (tab: RightTab) => void;
  citation: QueryCitation | null;
  onCloseCitation: () => void;
  dossierId: string | null;
  facts: DossierFact[];
  dossierHasUpdate: boolean;
}) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as RightTab)}
      className="flex h-full min-h-0 flex-col gap-3"
    >
      <TabsList aria-label="Reference pane" className="hidden self-start sm:inline-flex">
        <TabsTrigger value="sources">Sources</TabsTrigger>
        <TabsTrigger value="dossier" className="relative">
          Dossier
          {dossierHasUpdate && (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-primary"
            />
          )}
          {dossierHasUpdate && <span className="sr-only"> (updated)</span>}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sources" className="min-h-0 flex-1 overflow-y-auto">
        <SourcePane citation={citation} onClose={onCloseCitation} />
      </TabsContent>
      <TabsContent value="dossier" className="min-h-0 flex-1 overflow-y-auto">
        <DossierPane dossierId={dossierId} facts={facts} />
      </TabsContent>
    </Tabs>
  );
}
