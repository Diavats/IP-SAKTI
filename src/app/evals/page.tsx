import { getEvalMetrics, getRetrievalBakeOff } from "@/lib/api";
import { MockLabel } from "@/components/citation";
import { RetrievalChart } from "@/components/evals/retrieval-chart";

export default async function EvalsPage() {
  const [metrics, bakeOff] = await Promise.all([getEvalMetrics(), getRetrievalBakeOff()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Evals</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            The problem statement&apos;s own four axes, measured — not targeted. No number below
            is a goal; each is what the last run produced.
          </p>
        </div>
        <MockLabel>Illustrative values for this build</MockLabel>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.axis}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
            <p className="font-mono text-4xl font-semibold tabular-nums text-foreground">
              {Math.round(m.value * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">{m.method}</p>
            <div className="mt-2 flex items-center gap-3 border-t border-border/60 pt-2 font-mono text-[11px] text-muted-foreground">
              <span>n={m.sampleSize}</span>
              <span>{m.measuredOn}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Retrieval bake-off (supporting metric)
        </h2>
        <div className="rounded-2xl border border-border bg-card p-5">
          <RetrievalChart rows={bakeOff} />
          <table className="sr-only">
            <caption>Retrieval bake-off: nDCG@10 and Recall@20 by method</caption>
            <thead>
              <tr>
                <th>Method</th>
                <th>nDCG@10</th>
                <th>Recall@20</th>
              </tr>
            </thead>
            <tbody>
              {bakeOff.map((row) => (
                <tr key={row.method}>
                  <td>{row.method}</td>
                  <td>{row.ndcg10.toFixed(2)}</td>
                  <td>{row.recall20.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
