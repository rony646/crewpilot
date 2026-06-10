import { create } from "zustand";

import { loadPlans, savePlan } from "@/lib/planStorage";
import type { StoredPlan } from "@/types";

function toPlanMap(plans: StoredPlan[]): Record<string, StoredPlan> {
  return Object.fromEntries(plans.map((plan) => [plan.id, plan]));
}

interface PlanState {
  plans: Record<string, StoredPlan>;
  addPlan: (plan: StoredPlan) => void;
  hydrate: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: toPlanMap(loadPlans()),
  addPlan: (plan) => {
    savePlan(plan);
    set((state) => ({ plans: { ...state.plans, [plan.id]: plan } }));
  },
  hydrate: () => {
    set({ plans: toPlanMap(loadPlans()) });
  },
}));
