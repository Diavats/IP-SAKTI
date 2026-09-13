"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function RetrievalChart({
  rows,
}: {
  rows: { method: string; ndcg10: number; recall20: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <Bar
        data={{
          labels: rows.map((r) => r.method),
          datasets: [
            {
              label: "nDCG@10",
              data: rows.map((r) => r.ndcg10),
              backgroundColor: "#5c3a21",
              borderRadius: 3,
              maxBarThickness: 36,
            },
            {
              label: "Recall@20",
              data: rows.map((r) => r.recall20),
              backgroundColor: "#2f3f63",
              borderRadius: 3,
              maxBarThickness: 36,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 1,
              ticks: { color: "#70604c", font: { family: "IBM Plex Mono, monospace", size: 11 } },
              grid: { color: "#e2d3ac" },
            },
            x: {
              ticks: { color: "#3b2a1e", font: { size: 12 } },
              grid: { display: false },
            },
          },
          plugins: {
            legend: {
              position: "top",
              align: "end",
              labels: {
                color: "#3b2a1e",
                usePointStyle: true,
                pointStyle: "rectRounded",
                boxWidth: 10,
                font: { size: 12 },
              },
            },
            tooltip: {
              backgroundColor: "#fffdf8",
              titleColor: "#3b2a1e",
              bodyColor: "#3b2a1e",
              borderColor: "#e2d3ac",
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}`,
              },
            },
          },
        }}
      />
    </div>
  );
}
