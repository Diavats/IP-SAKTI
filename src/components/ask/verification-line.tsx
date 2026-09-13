import { ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerificationLine({ passed }: { passed: boolean }) {
  const Icon = passed ? ShieldCheck : ShieldAlert;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs",
        passed ? "text-muted-foreground" : "text-verdict-barred"
      )}
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
      <span>
        {passed
          ? "Verification Agent — passed, citations checked against source"
          : "Verification Agent — abstained, escalated to human review"}
      </span>
    </div>
  );
}
