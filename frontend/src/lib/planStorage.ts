import type { StoredPlan } from "@/types";

const STORAGE_KEY = "crewpilot.plans";

export function loadPlans(): StoredPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredPlan[]) : [];
  } catch {
    return [];
  }
}

export function savePlan(plan: StoredPlan): void {
  const plans = loadPlans().filter((p) => p.id !== plan.id);
  plans.unshift(plan);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch {
    console.error("Error saving plan:", plan.id);
  }
}
