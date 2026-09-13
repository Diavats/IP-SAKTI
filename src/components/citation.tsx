export function Citation({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs text-muted-foreground before:mr-1 before:content-['§']">
      {children}
    </span>
  );
}

export function DraftLabel() {
  return (
    <span className="inline-flex items-center rounded-sm bg-verdict-draft-bg px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-verdict-draft">
      Draft — unverified
    </span>
  );
}

export function MockLabel({ children = "Mock data" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-dashed border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}
