"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import type { DossierAssemblyStep } from "@/lib/types";
import { cn } from "@/lib/utils";

export type LivePanelState =
  | { kind: "idle" }
  | { kind: "sahayak"; steps: DossierAssemblyStep[]; revealed: number; done: boolean }
  | { kind: "prahari"; steps: string[]; revealed: number; done: boolean };

export function LivePanel({ state }: { state: LivePanelState }) {
  if (state.kind === "idle") {
    return (
      <div className="glass flex min-h-[220px] flex-col justify-center rounded-2xl px-6 py-10 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Formulation Dossier
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask a question and Sahayak&apos;s dossier — or Prahari&apos;s search — assembles
          here in real time.
        </p>
      </div>
    );
  }

  if (state.kind === "sahayak") {
    return (
      <div className="glass flex flex-col gap-4 rounded-2xl px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-agent-sahayak" />
          <h2 className="text-sm font-semibold text-agent-sahayak">
            Sahayak — assembling dossier
          </h2>
        </div>
        <ol className="flex flex-col gap-3">
          {state.steps.map((step, i) => {
            const visible = i < state.revealed;
            const isCurrent = i === state.revealed - 1 && !state.done;
            return (
              <li
                key={step.label}
                className={cn(
                  "flex items-start gap-2.5 transition-opacity duration-300",
                  visible ? "opacity-100" : "opacity-0"
                )}
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                  {isCurrent ? (
                    <Loader2 className="size-3.5 animate-spin text-agent-sahayak" />
                  ) : visible ? (
                    <Check className="size-3.5 text-agent-sahayak" />
                  ) : null}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{step.label}</span>
                  <span className="text-sm text-foreground">{step.value}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl px-5 py-5">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-agent-prahari" />
        <h2 className="text-sm font-semibold text-agent-prahari">Prahari — live search</h2>
      </div>
      <ol className="flex flex-col gap-3">
        {state.steps.map((source, i) => {
          const visible = i < state.revealed;
          const isCurrent = i === state.revealed - 1 && !state.done;
          return (
            <li
              key={source}
              className={cn(
                "flex items-center gap-2.5 transition-opacity duration-300",
                visible ? "opacity-100" : "opacity-0"
              )}
            >
              {isCurrent ? (
                <Loader2 className="size-3.5 shrink-0 animate-spin text-agent-prahari" />
              ) : (
                <Check className="size-3.5 shrink-0 text-agent-prahari" />
              )}
              <span className="text-sm text-foreground">
                {isCurrent ? `Querying ${source}…` : `Checked ${source}`}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
