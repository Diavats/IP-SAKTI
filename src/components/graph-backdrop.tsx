"use client";

import * as React from "react";
import { getGraphData } from "@/lib/api";
import type { GraphEdge, GraphNode } from "@/lib/types";

// Decorative-only echo of the /graph visualization for the home background —
// a standalone read of the same graph data, kept separate from
// src/app/graph/page.tsx so that page's own layout is never touched here.
const COLS = 5;
const ROW_HEIGHT = 70;
const COL_WIDTH = 180;

export function GraphBackdrop() {
  const [data, setData] = React.useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(
    null
  );

  React.useEffect(() => {
    let active = true;
    getGraphData().then((d) => {
      if (active) setData(d);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!data) return null;

  const { nodes, edges } = data;
  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((n, i) => {
    positions.set(n.id, {
      x: (i % COLS) * COL_WIDTH + COL_WIDTH / 2,
      y: Math.floor(i / COLS) * ROW_HEIGHT + ROW_HEIGHT / 2,
    });
  });
  const width = COLS * COL_WIDTH;
  const height = (Math.ceil(nodes.length / COLS) + 1) * ROW_HEIGHT;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-[0.06] blur-[0.5px]"
    >
      {edges.map((e, i) => {
        const from = positions.get(e.source);
        const to = positions.get(e.target);
        if (!from || !to) return null;
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="var(--statute)"
            strokeWidth={1}
          />
        );
      })}
      {nodes.map((n) => {
        const p = positions.get(n.id);
        if (!p) return null;
        return <circle key={n.id} cx={p.x} cy={p.y} r={5} fill="var(--verdict-open)" />;
      })}
    </svg>
  );
}
