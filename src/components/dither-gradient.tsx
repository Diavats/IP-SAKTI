"use client";

// Dither-grid gradient backdrop.
//
// A colour wash that dissolves downward into a dot grid, so the lower half of
// the page reads as a designed surface rather than flat white. The dither is
// what keeps it from looking like the generic "pastel blob" gradient every AI
// site ships.
//
// Built from two tiled CSS layers and a mask, deliberately not a canvas or a
// WebGL shader: CLAUDE.md §9 records that a second continuously-running canvas
// crawls on demo hardware, and there is already one shader button on the home
// page. This composites on the GPU, animates nothing, and costs a single paint.
//
// Colour comes from --primary and --brand at low alpha. The neutrals were just
// de-tinted so the accent colours could read, so this stays faint on purpose:
// it is a surface, not a fifth colour competing with the four that carry
// meaning.

interface DitherGradientProps {
  /** Where the wash starts, as a percentage of viewport height. */
  from?: number;
  /** Peak opacity of the whole effect. Keep low; text sits on top of this. */
  intensity?: number;
}

export function DitherGradient({ from = 45, intensity = 1 }: DitherGradientProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Colour wash. Starts transparent at `from` so the top of the page keeps
          the clean white the palette work just bought. */}
      <div
        className="absolute inset-0"
        style={{
          opacity: intensity,
          background:
            `linear-gradient(180deg, transparent ${from}%, ` +
            "color-mix(in oklab, var(--primary) 7%, transparent) 78%, " +
            "color-mix(in oklab, var(--brand) 12%, transparent) 100%)",
        }}
      />

      {/* The dither. A 1px dot on a 4px grid, masked so the dots emerge as the
          wash deepens. Two grid sizes overlaid at different phases give the
          ordered, slightly irregular texture a single grid cannot. */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.55 * intensity,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--brand) 55%, transparent) 1px, transparent 0)",
          backgroundSize: "4px 4px",
          maskImage: `linear-gradient(180deg, transparent ${from + 8}%, black 100%)`,
          WebkitMaskImage: `linear-gradient(180deg, transparent ${from + 8}%, black 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.35 * intensity,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--primary) 50%, transparent) 1px, transparent 0)",
          backgroundSize: "9px 9px",
          backgroundPosition: "2px 3px",
          maskImage: `linear-gradient(180deg, transparent ${from + 20}%, black 100%)`,
          WebkitMaskImage: `linear-gradient(180deg, transparent ${from + 20}%, black 100%)`,
        }}
      />
    </div>
  );
}
