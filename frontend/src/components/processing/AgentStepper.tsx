import type { Agent } from "@/types";

import { AgentCard } from "@/components/processing/AgentCard";

const AGENTS: Agent[] = [
  {
    id: "product",
    type: "product",
    name: "Product Agent",
    status: "running",
    currentTask: "Analyzing product-market fit",
  },
  {
    id: "market",
    type: "market",
    name: "Market Agent",
    status: "running",
    currentTask: "Researching market opportunities",
  },
  {
    id: "tech",
    type: "tech",
    name: "Tech Agent",
    status: "running",
    currentTask: "Planning technical architecture",
  },
];

export function AgentStepper() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Agents</h2>
      <div className="space-y-3">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="relative">
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>
    </div>
  );
}
