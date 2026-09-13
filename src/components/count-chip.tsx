import { cn } from "@/lib/utils";

export function CountChip({
  children,
  tone = "open",
}: {
  children: React.ReactNode;
  tone?: "open" | "barred" | "draft" | "neutral";
}) {
  const toneClass =
    tone === "open"
      ? "bg-verdict-open-bg text-verdict-open"
      : tone === "barred"
      ? "bg-verdict-barred-bg text-verdict-barred"
      : tone === "draft"
      ? "bg-verdict-draft-bg text-verdict-draft"
      : "bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-xs",
        toneClass
      )}
    >
      {children}
    </span>
  );
}
