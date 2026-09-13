"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Global, always-visible bar: which corpus snapshot answers are grounded in,
// and which jurisdiction's rules the (still-mocked) answers should reflect.
export function TopBar() {
  const [jurisdiction, setJurisdiction] = React.useState<"india" | "intl">("india");

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
      <span className="font-mono text-[11px] text-muted-foreground">
        Corpus 2026-09-10
      </span>
      <Tabs value={jurisdiction} onValueChange={(v) => setJurisdiction(v as "india" | "intl")}>
        <TabsList aria-label="Jurisdiction">
          <TabsTrigger value="india">India</TabsTrigger>
          <TabsTrigger value="intl">International</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
