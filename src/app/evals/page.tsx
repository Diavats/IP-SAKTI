import { getEvalMetrics, getRetrievalBakeOff } from "@/lib/api";
import { MockLabel } from "@/components/citation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Meter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm tabular-nums">{Math.round(value * 100)}%</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-sm bg-muted">
        <div
          className="h-full bg-primary"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

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

      <div className="overflow-x-auto rounded-sm border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Axis</TableHead>
              <TableHead>Measured</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Sample</TableHead>
              <TableHead>Measured on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((m) => (
              <TableRow key={m.axis}>
                <TableCell className="text-sm font-medium">{m.label}</TableCell>
                <TableCell>
                  <Meter value={m.value} />
                </TableCell>
                <TableCell className="max-w-80 whitespace-normal text-sm text-muted-foreground">
                  {m.method}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  n={m.sampleSize}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {m.measuredOn}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Retrieval bake-off (supporting metric)
        </h2>
        <div className="overflow-x-auto rounded-sm border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>nDCG@10</TableHead>
                <TableHead>Recall@20</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bakeOff.map((row) => (
                <TableRow key={row.method}>
                  <TableCell className="text-sm">{row.method}</TableCell>
                  <TableCell className="font-mono text-sm">{row.ndcg10.toFixed(2)}</TableCell>
                  <TableCell className="font-mono text-sm">{row.recall20.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
