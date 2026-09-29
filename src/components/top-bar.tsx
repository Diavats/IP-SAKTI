"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useT } from "@/lib/i18n";

// Global, always-visible bar: which corpus snapshot answers are grounded in,
// which jurisdiction's rules the (still-mocked) answers should reflect, and
// which language the interface speaks.
export function TopBar() {
  const [jurisdiction, setJurisdiction] = React.useState<"india" | "intl">("india");
  const t = useT();

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
      {/* The corpus stamp is a version identifier, not prose. It stays in one
          form in every language, like the citations it governs. */}
      <span className="font-mono text-[11px] text-on-brand/75">
        {t("Corpus")} 2026-09-10
      </span>
      <Tabs value={jurisdiction} onValueChange={(v) => setJurisdiction(v as "india" | "intl")}>
        <TabsList aria-label={t("Jurisdiction")}>
          <TabsTrigger value="india">{t("India")}</TabsTrigger>
          <TabsTrigger value="intl">{t("International")}</TabsTrigger>
        </TabsList>
      </Tabs>
      <LanguageSwitcher />
    </div>
  );
}
