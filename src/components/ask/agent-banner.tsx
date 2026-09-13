import type { AgentName } from "@/lib/types";
import { cn } from "@/lib/utils";

const agentLabel: Record<AgentName, string> = {
  sahayak: "Sahayak",
  prahari: "Prahari",
};

export function AgentBanner({
  agents,
  reason,
}: {
  agents: AgentName[];
  reason: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      {agents.map((agent) => (
        <span
          key={agent}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium",
            agent === "sahayak"
              ? "bg-agent-sahayak-bg text-agent-sahayak"
              : "bg-agent-prahari-bg text-agent-prahari"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              agent === "sahayak" ? "bg-agent-sahayak" : "bg-agent-prahari"
            )}
          />
          {agentLabel[agent]} engaged
        </span>
      ))}
      <span>— {reason}</span>
    </div>
  );
}
