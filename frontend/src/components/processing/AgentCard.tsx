import { Code, Loader2, Package, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Agent, AgentType } from "@/types";

const agentIcons: Record<AgentType, React.ComponentType<{ className?: string }>> = {
  product: Package,
  market: TrendingUp,
  tech: Code,
};

const agentColors: Record<AgentType, string> = {
  product: "bg-info/20 text-info",
  market: "bg-success/20 text-success",
  tech: "bg-accent/20 text-accent",
};

interface AgentCardProps {
  agent: Agent;
  className?: string;
}

export function AgentCard({ agent, className }: AgentCardProps) {
  const Icon = agentIcons[agent.type];
  const colorClass = agentColors[agent.type];

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg border border-primary/50 bg-primary/5 p-4 transition-all",
        className
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          colorClass
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground">{agent.name}</h3>
          <span className="flex items-center gap-1.5 text-xs text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
            Running
          </span>
        </div>
        {agent.currentTask && (
          <p className="mt-1 text-sm text-muted-foreground truncate">{agent.currentTask}</p>
        )}
      </div>

      <div className="shrink-0">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    </div>
  );
}
