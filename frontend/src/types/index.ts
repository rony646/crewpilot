export type AgentType = "product" | "market" | "tech";

export type AgentStatus = "idle" | "queued" | "running" | "done" | "error";

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  status: AgentStatus;
  currentTask?: string;
  elapsedTime?: number;
}

export interface PlanRequest {
  idea: string;
}

export interface PlanResponse {
  product: string;
  market: string;
  tech: string;
}
