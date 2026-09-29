"use client";

import * as React from "react";
import { Check, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS, useLanguage } from "@/lib/i18n";

// Sits at the top right of the brand header, beside the jurisdiction toggle.
// Deliberately shows the endonym (हिन्दी, not "Hindi") once a language is
// picked: someone who needs this control can read their own script faster
// than they can read the English name for it.
export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("Language")}
          className="h-8 gap-1.5 px-2 text-on-brand hover:bg-white/10 hover:text-on-brand"
        >
          <Languages className="size-4" aria-hidden />
          <span className="text-xs font-medium">{current.endonym}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLang(l.code)}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex flex-col">
              <span>{l.endonym}</span>
              {l.endonym !== l.label && (
                <span className="text-xs text-muted-foreground">{l.label}</span>
              )}
            </span>
            {/* Selection is carried by the tick AND by the label, never by
                colour alone — same rule the urgency bands follow. */}
            {l.code === lang && <Check className="size-4 shrink-0" aria-hidden />}
          </DropdownMenuItem>
        ))}

        {/* The honest footnote. Citations are the one thing that must not move
            between languages, and saying so here is cheaper than a judge
            discovering it and assuming we simply failed to translate them. */}
        <p className="border-t px-2 py-2 text-[11px] leading-snug text-muted-foreground">
          Statutes, section numbers and source titles stay in their original
          form. A translated statute is not the statute.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
