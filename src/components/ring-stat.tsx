import { cn } from "@/lib/utils";

// Radial progress ring built with a CSS conic-gradient - no charting library
// needed for a single ring. Used for both the big portfolio-level stats and
// the small per-dossier "X of 7 regimes" indicator, just at different sizes.
export function RingStat({
  pct,
  value,
  label,
  color,
  size = 96,
  thickness = 8,
  className,
}: {
  /** 0..1 - fraction of the ring to fill */
  pct: number;
  value: string;
  label: string;
  color: string;
  size?: number;
  thickness?: number;
  className?: string;
}) {
  // Clamp to [0,1] so a bad input can't wrap the gradient past 360deg.
  const deg = Math.max(0, Math.min(1, pct)) * 360;
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* The ring itself: a solid-color wedge up to `deg`, track color after
          that. role="img" + aria-label carries the same info a sighted user
          gets from the wedge, so the chart isn't color-only. */}
      <div
        role="img"
        aria-label={`${label}: ${value}`}
        className="relative shrink-0 rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${deg}deg, var(--border) 0deg)`,
        }}
      >
        {/* Punches the "donut hole" by covering the ring's center with a
            same-color-as-card circle, then shows the value on top of that. */}
        <div
          className="absolute inset-0 m-auto flex items-center justify-center rounded-full bg-card font-heading font-semibold text-foreground"
          style={{
            width: size - thickness * 2,
            height: size - thickness * 2,
            fontSize: size >= 80 ? "1.1rem" : "0.8rem",
          }}
        >
          {value}
        </div>
      </div>
      <p className="max-w-[9rem] text-center text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
