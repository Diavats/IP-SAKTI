export function Citation({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const className =
    "inline-flex items-center gap-1 rounded-sm bg-statute-bg px-1.5 py-0.5 font-mono text-xs text-statute";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} transition-colors hover:bg-statute hover:text-statute-bg`}
      >
        <span aria-hidden>§</span>
        {children}
      </button>
    );
  }

  return (
    <span className={className}>
      <span aria-hidden>§</span>
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
