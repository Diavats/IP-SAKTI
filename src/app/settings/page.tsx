import { getAuditLog, getConsentGrants } from "@/lib/api";
import { MockLabel } from "@/components/citation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function SettingsPage() {
  const [consents, audit] = await Promise.all([getConsentGrants(), getAuditLog()]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Settings</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Consent and audit are demoed against a mock connector — a working permission
          mechanism with no paid source behind it, stated plainly rather than faked.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Consent ledger</h2>
          <MockLabel>Mock connector</MockLabel>
        </div>
        <div className="overflow-x-auto rounded-sm border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scope</TableHead>
                <TableHead>Granted</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last accessed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consents.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="max-w-80 whitespace-normal text-sm">{c.scope}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.grantedOn}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.expiry}
                  </TableCell>
                  <TableCell className="text-sm">
                    {c.revoked ? (
                      <span className="text-verdict-barred">Revoked</span>
                    ) : (
                      <span className="text-verdict-open">Active</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.accessLog.at(-1)?.accessedOn.slice(0, 10) ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Audit log</h2>
        <div className="overflow-x-auto rounded-sm border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Corpus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audit.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{entry.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.actor}</TableCell>
                  <TableCell className="max-w-96 whitespace-normal text-sm text-muted-foreground">
                    {entry.details}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {entry.corpusVersion}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
