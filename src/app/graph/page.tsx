"use client";

import * as React from "react";
import { getGraphData } from "@/lib/api";
import type { GraphEdge, GraphNode, GraphNodeType } from "@/lib/types";

const lanes: { title: string; types: GraphNodeType[] }[] = [
  { title: "Dravya", types: ["Dravya", "Taxon"] },
  { title: "Formulations", types: ["Formulation"] },
  { title: "Statutes & provisions", types: ["Statute", "Provision"] },
  { title: "Patents & GI", types: ["Patent", "GI"] },
];

const LANE_WIDTH = 260;
const ROW_HEIGHT = 60;
const NODE_WIDTH = 210;
const NODE_HEIGHT = 40;
const PADDING = 40;

const edgeColor: Record<GraphEdge["type"], string> = {
  CONTAINS: "var(--muted-foreground)",
  GOVERNED_BY: "var(--primary)",
  BARRED_BY: "var(--verdict-barred)",
  CLAIMS_USE_OF: "var(--verdict-draft)",
  ANTICIPATED_BY: "var(--verdict-barred)",
  SYNONYM_OF: "var(--muted-foreground)",
};

interface Placed {
  node: GraphNode;
  x: number;
  y: number;
}

function layout(nodes: GraphNode[]) {
  const placed = new Map<string, Placed>();
  let maxRows = 0;

  lanes.forEach((lane, laneIndex) => {
    const laneNodes = nodes.filter((n) => lane.types.includes(n.type));
    maxRows = Math.max(maxRows, laneNodes.length);
    laneNodes.forEach((node, rowIndex) => {
      placed.set(node.id, {
        node,
        x: laneIndex * LANE_WIDTH + LANE_WIDTH / 2,
        y: PADDING + 40 + rowIndex * ROW_HEIGHT,
      });
    });
  });

  return { placed, height: PADDING * 2 + 40 + maxRows * ROW_HEIGHT };
}

export default function GraphPage() {
  const [data, setData] = React.useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(
    null
  );

  React.useEffect(() => {
    getGraphData().then(setData);
  }, []);

  if (!data) {
    return <p className="text-sm text-muted-foreground">Loading graph…</p>;
  }

  const { nodes, edges } = data;
  const { placed, height } = layout(nodes);
  const width = lanes.length * LANE_WIDTH;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Knowledge graph</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          A curated cross-reference, not a scraped web — every edge carries a provenance
          citation and confidence score. Hover an edge to read it.
        </p>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border bg-card p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          role="img"
          aria-label="Knowledge graph of dravya, formulations, statutes and patents"
          className="min-w-[820px]"
        >
          {edges.map((edge, i) => {
            const from = placed.get(edge.source);
            const to = placed.get(edge.target);
            if (!from || !to) return null;
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={edgeColor[edge.type]}
                strokeWidth={1.5}
                strokeOpacity={0.55}
              >
                <title>
                  {edge.type} (confidence {edge.confidence.toFixed(2)}) — {edge.provenance}
                </title>
              </line>
            );
          })}

          {lanes.map((lane, i) => (
            <text
              key={lane.title}
              x={i * LANE_WIDTH + LANE_WIDTH / 2}
              y={PADDING - 12}
              textAnchor="middle"
              className="fill-muted-foreground font-mono"
              fontSize={11}
            >
              {lane.title.toUpperCase()}
            </text>
          ))}

          {[...placed.values()].map(({ node, x, y }) => (
            <g key={node.id} transform={`translate(${x - NODE_WIDTH / 2}, ${y - NODE_HEIGHT / 2})`}>
              <rect
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={4}
                fill="var(--card)"
                stroke="var(--border)"
              >
                <title>{node.type}</title>
              </rect>
              <text
                x={NODE_WIDTH / 2}
                y={NODE_HEIGHT / 2 + 4}
                textAnchor="middle"
                fontSize={11.5}
                className="fill-foreground font-sans"
              >
                {node.label.length > 26 ? `${node.label.slice(0, 24)}…` : node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {(Object.keys(edgeColor) as (keyof typeof edgeColor)[]).map((type) => (
          <span key={type} className="flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-4"
              style={{ backgroundColor: edgeColor[type] }}
            />
            {type.replaceAll("_", " ").toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
