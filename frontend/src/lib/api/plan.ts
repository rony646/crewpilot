import { PlanRequest, PlanResponse } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export async function createPlan(body: PlanRequest, signal?: AbortSignal): Promise<PlanResponse> {
  const response = await fetch(`${API_URL}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail ?? "Plan generation failed");
  }

  return response.json();
}
